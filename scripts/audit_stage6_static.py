from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'index.html').read_text(encoding='utf-8')
js = (ROOT / 'app.js').read_text(encoding='utf-8')
sw = (ROOT / 'service-worker.js').read_text(encoding='utf-8')
manifest = json.loads((ROOT / 'manifest.json').read_text(encoding='utf-8'))

failures = []

# 1. Nawigacja: każdy przycisk menu musi mieć sekcję docelową.
sections = set()
for match in re.finditer(r'<section\b([^>]*)>', html, flags=re.I):
    attrs = match.group(1)
    id_match = re.search(r'id="([^"]+)"', attrs)
    class_match = re.search(r'class="([^"]*)"', attrs)
    if id_match and class_match and 'view' in class_match.group(1).split():
        sections.add(id_match.group(1))
nav_targets = re.findall(r'data-section="([^"]+)"', html)
missing_nav = [target for target in nav_targets if target not in sections]
if missing_nav:
    failures.append(f'Brak sekcji dla pozycji menu: {missing_nav}')

# 2. Przyciski: każdy przycisk z id musi być obsłużony bezpośrednio w JS albo przez formularz.
forms = {}
for match in re.finditer(r'<form\b[^>]*id="([^"]+)"', html):
    end = html.find('</form>', match.end())
    if end != -1:
        forms[match.group(1)] = (match.start(), end + len('</form>'))

button_issues = []
for match in re.finditer(r'<button\b([^>]*)>', html, flags=re.I):
    tag = match.group(0)
    id_match = re.search(r'id="([^"]+)"', tag)
    if not id_match:
        continue
    button_id = id_match.group(1)
    type_match = re.search(r'type="([^"]+)"', tag)
    button_type = type_match.group(1) if type_match else 'submit'

    referenced_in_js = bool(re.search(rf'\b{re.escape(button_id)}\b', js))
    containing_form = None
    for form_id, (start, end) in forms.items():
        if start <= match.start() <= end:
            containing_form = form_id
            break
    form_handled = bool(containing_form and re.search(rf'\b{re.escape(containing_form)}\b', js))

    if not referenced_in_js and not form_handled:
        button_issues.append(button_id)

if button_issues:
    failures.append(f'Nieobsłużone przyciski: {button_issues}')

# 3. Funkcje z etapów 2-5.
required_checks = {
    'ikony maskowalne w manifest.json': any('maskable' in icon.get('purpose', '') for icon in manifest.get('icons', [])),
    'share_target w manifest.json': 'share_target' in manifest,
    'obsługa share target w app.js': 'handleSharedReceiptTextOnLaunch' in js,
    'przyciski schowka paragonów': 'pasteReceiptClipboardButton' in html and 'pasteAnalyzeReceiptClipboardButton' in html,
    'obsługa schowka w app.js': 'pasteReceiptTextFromClipboard' in js,
    'opis PDF zgodny z działaniem': 'Drukuj / zapisz PDF' in html,
    'walidacja kopii JSON': 'validateBackupSnapshotForImport' in js,
    'komunikat o nadpisaniu JSON': 'Tryb importu: NADPISANIE.' in js,
    'cache PWA zawiera ikony maskowalne': 'maskable-icon-512.png' in sw and 'maskable-icon-192.png' in sw,
    'wersja 1.6.3 w UI': '1.6.3 ETAP 4 - eSkarbnik RR' in html and '1.6.3 ETAP 4 - eSkarbnik RR' in js,
    'plik czyszczenia cache': (ROOT / 'reload-cache.html').exists() and 'refreshAppCacheButton' in html and 'clearBrowserAppCacheAndReload' in js,
    'logowanie Google': 'googleLoginButton' in html and 'signInWithGoogleUser' in js,
}
for name, ok in required_checks.items():
    if not ok:
        failures.append(f'Brak: {name}')

# 4. Robocze etykiety nie powinny być w UI.
for filename in ['index.html', 'app.js']:
    content = (ROOT / filename).read_text(encoding='utf-8')
    legacy_a = 'Etap ' + '15'
    legacy_b = legacy_a + '.2'
    if legacy_a in content or legacy_b in content:
        failures.append(f'Robocza etykieta starego etapu została w pliku {filename}')

if failures:
    print('BŁĄD AUDYTU ETAP 6')
    for failure in failures:
        print('-', failure)
    raise SystemExit(1)

print('OK: statyczny audyt etapu 6 przeszedł poprawnie.')
print(f'OK: pozycje menu sprawdzone: {len(nav_targets)}')
button_count = len(re.findall(r'<button\b[^>]*id=', html, flags=re.I))
print(f'OK: przyciski z id sprawdzone: {button_count}')
print('OK: funkcje etapów 2-5 potwierdzone.')
