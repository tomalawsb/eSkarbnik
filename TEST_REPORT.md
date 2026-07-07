# Raport kontroli — wersja 1.6.2 FINAL

## Zakres zmian

Wersja 1.6.0 FINAL poprawia model prywatności kas klasowych.

Najważniejsze zmiany:

- brak osobnej roli administratora widzącego wszystko,
- skarbnik Rady Rodziców administruje aplikacją,
- skarbnik Rady widzi finanse Rady Rodziców,
- skarbnik Rady nie widzi prywatnych kas klasowych innych klas,
- skarbnik klasy widzi tylko przypisaną klasę,
- użytkownik może mieć rolę skarbnika Rady i jednocześnie przypisaną prywatną klasę,
- Firebase rozdziela dane na `snapshots/main` oraz `classSnapshots/{classId}`.

## Kontrola techniczna

Wykonane kontrole:

- `python3 validate_project.py` — OK,
- `node --check app.js` — OK,
- `node --check db.js` — OK,
- `node --check service-worker.js` — OK.

## Uwagi produkcyjne

Przed użyciem z prawdziwymi danymi trzeba wdrożyć finalne `firestore.rules` i nie zostawiać aktywnych reguł bootstrap.


## Branding eSkarbnik

Sprawdzono po zmianie nazwy aplikacji na `eSkarbnik`:

- `manifest.json` ma nazwę `eSkarbnik`,
- `index.html` ma tytuł `eSkarbnik`,
- dodano logo wariant 2,
- wygenerowano ikony PWA 192 i 512 px,
- skrypt GitHub ma domyślne repo `https://github.com/tomalawsb/eSkarbnik.git`.

## Kontrola po etapie 1

Dodatkowo sprawdzono po porządkowaniu kodu:

- `schemaVersion` w eksporcie lokalnym i snapshotach ma wartość `15`,
- usunięto nieużywane funkcje pomocnicze wskazane w audycie,
- opis karty „Zebrano” na pulpicie jest aktualizowany przez JavaScript,
- etykiety techniczne starego etapu nie są pokazywane w głównym interfejsie.

## Etap 2 — kontrola ikon

- Sprawdzono rozmiary ikon: 192x192 i 512x512.
- Sprawdzono, że narożniki ikon nie są białe i mają pełne krycie.
- Dodano oddzielne wpisy `purpose: any` oraz `purpose: maskable` w `manifest.json`.
- Cache PWA podbito do `eskarbnik-v1-5-3-etap2-icons`.

## Etap 3 — kontrola paragonów ze schowka

- Potwierdzono obecność przycisków `pasteReceiptClipboardButton` i `pasteAnalyzeReceiptClipboardButton` w `index.html`.
- Potwierdzono obsługę odczytu schowka przez `navigator.clipboard.readText()` po kliknięciu użytkownika.
- Potwierdzono, że `Wklej i analizuj` uruchamia istniejącą lokalną analizę paragonu, bez OCR/AI w aplikacji.
- Potwierdzono, że przy braku dostępu do schowka aplikacja pokazuje komunikat i pozwala wkleić tekst ręcznie.
- Cache PWA podbito do `eskarbnik-v1-5-3-etap3-clipboard`.



## Etap 4 — kontrola udostępniania tekstu

- Potwierdzono obecność `share_target` w `manifest.json`.
- Potwierdzono, że `share_target` przekazuje parametry `title`, `text` i `url` do `index.html?shareTarget=receipt`.
- Dodano obsługę startu z udostępnionym tekstem w `handleSharedReceiptTextOnLaunch()`.
- Potwierdzono, że odebrany tekst trafia do `receiptText`, sekcja `Paragony` otwiera się automatycznie, a analiza lokalna uruchamia się bez OCR/AI w aplikacji.
- Cache PWA podbito do `eskarbnik-v1-5-3-etap4-share-target`.


## Etap 5 — kontrola PDF / drukowania i kopii JSON

- Potwierdzono zmianę opisu przycisku raportu na „Drukuj / zapisz PDF”.
- Potwierdzono, że funkcja `exportReportPdf()` otwiera widok do druku i informuje o zapisie PDF przez okno drukowania.
- Dodano walidację struktury kopii JSON przed przywróceniem.
- Dodano szczegółowe potwierdzenie importu kopii: plik, rok, data eksportu, wersja, schemaVersion oraz liczba rekordów.
- Potwierdzono, że import kopii działa jako nadpisanie lokalnych danych, nie jako dopisanie.
- Po przywróceniu kopii wykonywane jest `loadData()` i `renderAll()`.
- Cache PWA podbito do `eskarbnik-v1-5-3-etap5-backup-print`.

## Etap 6 — test końcowy

- Dodano `scripts/audit_stage6_static.py`.
- Sprawdzono składnię `app.js`, `db.js` i `service-worker.js`.
- Sprawdzono 13 pozycji menu i 43 przyciski z `id`.
- Potwierdzono obecność funkcji z etapów 2-5: ikony maskowalne, schowek paragonów, share target, opis PDF i walidacja kopii JSON.
- Szczegóły są w pliku `TESTY_KONCOWE_ETAP6.md`.


## Kontrola finalna po poprawkach porządkowych

- `CACHE_NAME` w `app.js` i `service-worker.js`: `eskarbnik-v1-5-3-etap6-final`.
- `PRIVACY_MODEL.md` ma uporządkowany nagłówek bez roboczej etykiety etapu.

## Poprawka skryptu deploy Firebase

Poprawiono `scripts/deploy_firebase.ps1`: walidacja Python działa poprawnie również wtedy, gdy `python.exe` znajduje się na dysku z literą, np. `E:\...`, i PowerShell nie ucina ścieżki do pierwszej litery.

## Poprawka GitHub publish

- `scripts/publish_to_github.ps1` sprawdza teraz ignorowanie `.firebase_node20/` jako katalogu, a nie wyłącznie ścieżki bez ukośnika.
- `.gitignore` zawiera oba wpisy: `.firebase_node20` oraz `.firebase_node20/`, żeby Git nie próbował publikować lokalnego Node.js.

