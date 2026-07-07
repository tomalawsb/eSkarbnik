# eSkarbnik — etap 6: test końcowy

Data testu: 2026-07-06
Baza paczki: `eSkarbnik_etap5_PDF_kopie_JSON.zip`

## Wynik

Etap 6 przeszedł poprawnie w zakresie testów technicznych i statycznego audytu podpięcia interfejsu.

## Wykonane testy automatyczne

1. Składnia JavaScript:
   - `node --check app.js` — OK
   - `node --check db.js` — OK
   - `node --check service-worker.js` — OK

2. Walidator projektu:
   - `python3 validate_project.py` — OK

3. Audyt statyczny etapu 6:
   - `python3 scripts/audit_stage6_static.py` — OK

## Co sprawdza audyt statyczny

1. Menu główne:
   - sprawdzono 13 pozycji menu;
   - każda pozycja `data-section` ma odpowiadającą sekcję `section.view`.

2. Przyciski:
   - sprawdzono 43 przyciski z `id`;
   - każdy przycisk jest obsłużony bezpośrednio w JS albo przez formularz `submit`.

3. Etap 2 — ikony PWA:
   - manifest zawiera zwykłe ikony `any`;
   - manifest zawiera ikony `maskable`;
   - service worker cache'uje ikony maskowalne.

4. Etap 3 — paragony ze schowka:
   - istnieje `Wklej ze schowka`;
   - istnieje `Wklej i analizuj`;
   - w `app.js` istnieje obsługa schowka.

5. Etap 4 — udostępnianie tekstu:
   - manifest zawiera `share_target`;
   - w `app.js` istnieje obsługa uruchomienia z udostępnionym tekstem.

6. Etap 5 — PDF / kopie JSON:
   - przycisk opisuje realne działanie jako `Drukuj / zapisz PDF`;
   - import kopii JSON ma walidację snapshotu;
   - komunikat importu jasno wskazuje tryb `NADPISANIE`.

7. Robocze etykiety:
   - w `index.html` i `app.js` nie znaleziono roboczych etykiet starego etapu.

## Rzeczy, których nie da się w pełni potwierdzić samym audytem plików

Te elementy wymagają testu w realnej przeglądarce / na telefonie:

1. Czy Android pokaże eSkarbnika w menu `Udostępnij` po zainstalowaniu PWA.
2. Czy konkretna aplikacja aparatu / Obiektyw Google przekaże tekst jako `text` do `share_target`.
3. Czy przeglądarka pozwoli odczytać schowek po kliknięciu `Wklej i analizuj`.
4. Czy systemowe okno drukowania na danym urządzeniu pokaże opcję `Zapisz jako PDF`.
5. Czy logowanie Firebase działa na docelowym hostingu i regułach produkcyjnych.

## Zalecany test ręczny po wdrożeniu

1. Uruchomić aplikację przez lokalny serwer albo hosting HTTPS.
2. Przejść kolejno przez menu: Pulpit, Klasy, Budżety, Wpłaty, Wydatki, Kategorie, Paragony, Raporty, Import, Synchronizacja, Użytkownicy, AI, Ustawienia.
3. Kliknąć przyciski `Wyczyść` / `Anuluj` w formularzach.
4. W sekcji Paragony wkleić tekst przykładowego paragonu i kliknąć `Analizuj lokalnie`.
5. Skopiować tekst do schowka i użyć `Wklej i analizuj`.
6. Wyeksportować kopię JSON.
7. Spróbować przywrócić kopię JSON i sprawdzić komunikat przed nadpisaniem.
8. Otworzyć raport i użyć `Drukuj / zapisz PDF`.

## Wniosek

Paczka po etapach 1-5 jest spójna technicznie. Etap 6 nie wykazał brakujących podpięć przycisków ani niespójności w menu. Do potwierdzenia na docelowym urządzeniu zostają tylko funkcje zależne od Androida, przeglądarki, schowka, drukowania i Firebase.

## Poprawka skryptu deploy Firebase

Poprawiono `scripts/deploy_firebase.ps1`: walidacja Python działa poprawnie również wtedy, gdy `python.exe` znajduje się na dysku z literą, np. `E:\...`, i PowerShell nie ucina ścieżki do pierwszej litery.

