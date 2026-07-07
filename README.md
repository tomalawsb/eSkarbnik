# eSkarbnik — wersja z brandingiem

Lokalizacja projektu u użytkownika:

```text
E:\Programy\Dropbox\Wszystko\Prace\Tomek\Python\App Firebase\Rada_rodzicow\eSkarbnik
```

Repozytorium GitHub:

```text
https://github.com/tomalawsb/eSkarbnik
```

Logo: wariant 2, zapisane w `assets/logo-eskarbnik-full.png`, ikony PWA w `assets/icons/`.

---


## Wersja 1.6.3 ETAP 4 — responsywność telefonu

- Poprawiono kafelki i siatki na telefonie — brak wymuszonych 4 kolumn.
- Długie napisy w przyciskach, kafelkach, listach i tabelach zawijają się zamiast ucinać.
- Akcje formularzy i list automatycznie przechodzą do jednej kolumny na wąskich ekranach.
- Ograniczono poziome przewijanie i dopracowano nagłówek mobilny.
- Podbito cache PWA do `1.6.3-etap4-clean-ui`.

## Wersja 1.6.3 ETAP 2 — menu i nagłówek

- Dodano pływający przycisk menu, niezależny od banera/nagłówka.
- Na telefonie i tablecie menu jest wysuwanym panelem bocznym z tłem przyciemniającym ekran.
- Menu można zamknąć kliknięciem w tło, ponownym kliknięciem przycisku, wyborem pozycji albo klawiszem Escape.
- Po przewinięciu strony przycisk menu zostaje stale dostępny.
- Zwężono nagłówek mobilny i usunięto układ, w którym przycisk menu zwiększał wysokość banera.
- Podbito cache PWA do `1.6.3-etap2-menu`.

## Wersja 1.6.3 ETAP 1 — logowanie i konta

- Wpisano domyślny config Firebase projektu `eskarbnik-fa364` bezpośrednio w kod aplikacji.
- Dodano pole `Powtórz hasło` przy tworzeniu konta e-mail/hasło.
- Dodano walidację zgodności haseł przed wywołaniem Firebase Authentication.
- Poprawiono logowanie Google: na telefonach używane jest przekierowanie, na komputerze popup z awaryjnym przejściem na przekierowanie.
- Doprecyzowano komunikaty błędów Firebase Authentication.


# eSkarbnik — wersja 1.6.2 FINAL

Wersja 1.6.2 FINAL porządkuje model kont, dodaje widoczną kontrolę wersji oraz narzędzia do czyszczenia cache po publikacji.

## Co dodano

- konfigurację `firebase.json`,
- finalne reguły Firestore `firestore.rules`,
- tymczasowe reguły pierwszej konfiguracji `firestore.bootstrap.rules`,
- pusty plik indeksów `firestore.indexes.json`,
- przykład `.firebaserc.example`,
- `.gitignore`,
- skrypt publikacji do GitHub,
- skrypt wdrożenia Firebase,
- skrypt kontroli przed publikacją,
- opcjonalny workflow GitHub Actions,
- instrukcję `PUBLISHING.md`,
- listę bezpieczeństwa `SECURITY_CHECKLIST.md`,
- podniesienie wersji aplikacji do `1.6.0 FINAL`,
- odświeżenie cache PWA.

## Nadal zachowane

- PWA,
- lata szkolne,
- klasy i uczniowie,
- budżety Rady Rodziców i kasy klasowe,
- wpłaty,
- wydatki,
- kategorie,
- analiza tekstu paragonu bez AI,
- raporty CSV / XLSX / PDF przez drukowanie,
- import Excela,
- Firebase / Firestore,
- logowanie i role,
- opcjonalna analiza AI,
- kontrola danych i kopie JSON,
- przyciski bez pogrubionej czcionki.

## Uruchomienie lokalne

```powershell
.\scripts\run_local_server.ps1
```

Potem otwórz:

```text
http://localhost:8080
```

## Kontrola projektu

```powershell
.\scripts\check_before_deploy.ps1
```

albo:

```powershell
python validate_project.py
```

## Publikacja

Szczegółowa instrukcja jest w pliku:

```text
PUBLISHING.md
```

Najkrócej:

1. kod wrzucasz na GitHub,
2. aplikację publikujesz na Firebase Hosting,
3. Firestore zabezpieczasz regułami z `firestore.rules`,
4. pierwszego skarbnika Rady ustawiasz ręcznie w Firestore albo przez tymczasowy bootstrap.


## Poprawiony model prywatności

Dodano rozdzielenie zakresów dostępu:

- skarbnik Rady Rodziców administruje aplikacją i widzi finanse Rady,
- skarbnik Rady Rodziców nie widzi prywatnych kas klasowych innych klas,
- skarbnik klasy widzi tylko prywatną kasę swojej klasy,
- użytkownik może być jednocześnie skarbnikiem Rady i skarbnikiem wybranej klasy,
- synchronizacja Firebase rozdziela dane Rady od prywatnych danych klasowych.

Szczegóły są w pliku `PRIVACY_MODEL.md`.

## Etap 1 — porządkowanie kodu

W tej paczce uporządkowano elementy wskazane w audycie:

- ujednolicono `schemaVersion` eksportowanych kopii do `15`,
- usunięto nieużywane funkcje pomocnicze z `app.js`,
- podpięto opis `dashboardPaymentsSmall` do rzeczywistych danych z filtrów,
- usunięto techniczne etykiety robocze z interfejsu użytkownika.

## Etap 2 — ikony PWA / Android

- Wygenerowano nowe ikony z polskim akronimem `RR` i podpisem `SKARBNIK`.
- Usunięto białe tło z ikon, żeby Android nie tworzył białych obwódek.
- Dodano osobne ikony maskowalne: `maskable-icon-192.png` i `maskable-icon-512.png`.
- Zaktualizowano `manifest.json`, `service-worker.js` i cache PWA.
- Logo w nagłówku aplikacji nie ma już wymuszonego białego tła z CSS.

## Etap 3 — paragony ze schowka, bez OCR w aplikacji

- Dodano przycisk `Wklej ze schowka` w sekcji paragonów.
- Dodano przycisk `Wklej i analizuj`, który pobiera tekst ze schowka i od razu uruchamia analizę lokalną.
- Dopisano instrukcję użycia Obiektywu Google albo aparatu z rozpoznawaniem tekstu.
- Aplikacja nadal nie zapisuje zdjęć paragonów i nie zawiera własnego OCR. Analizowany jest wyłącznie tekst skopiowany przez użytkownika.
- Cache PWA podbito do `eskarbnik-v1-5-3-etap3-clipboard`.


## Etap 4 — udostępnianie tekstu do aplikacji

- Dodano `share_target` w `manifest.json`, żeby zainstalowana PWA mogła pojawić się w menu udostępniania Androida.
- Obsługiwany jest lekki scenariusz: Obiektyw Google / aparat rozpoznaje tekst, użytkownik wybiera udostępnienie tekstu, a eSkarbnik otwiera sekcję `Paragony`.
- Odebrany tekst jest wpisywany w pole paragonu i analizowany lokalnie.
- Nie dodano OCR, AI obrazu ani zapisywania zdjęć w aplikacji.
- Pozostaje metoda awaryjna: skopiuj tekst i użyj `Wklej i analizuj`.
- Cache PWA podbito do `eskarbnik-v1-5-3-etap4-share-target`.


## Etap 5 — PDF / drukowanie i kopie JSON

W tej paczce doprecyzowano funkcje raportów i kopii zapasowej:

- przycisk raportu opisuje faktyczne działanie: „Drukuj / zapisz PDF”,
- komunikaty wyjaśniają, że PDF powstaje przez systemowe okno drukowania,
- import kopii JSON pokazuje nazwę pliku, rok, datę eksportu, wersję, schemaVersion i liczbę rekordów,
- przed importem aplikacja wyraźnie informuje, że kopia nadpisuje lokalne dane, a nie dopisuje rekordów,
- po przywróceniu kopii aplikacja czyści podgląd importu, ładuje dane ponownie i odświeża widoki.

## Etap 6 — test końcowy

W paczce dodano raport `TESTY_KONCOWE_ETAP6.md` oraz skrypt `scripts/audit_stage6_static.py`, który sprawdza menu, podpięcie przycisków i obecność zmian z etapów 2-5.


## Dopisek finalny po kontroli etapów 1–6

- ujednolicono nazwę cache PWA do `eskarbnik-v1-5-3-etap6-final`;
- uporządkowano nagłówek dokumentacji prywatności, aby nie zawierał roboczej etykiety etapu.

## Poprawka skryptu deploy Firebase

Poprawiono `scripts/deploy_firebase.ps1`: walidacja Python działa poprawnie również wtedy, gdy `python.exe` znajduje się na dysku z literą, np. `E:\...`, i PowerShell nie ucina ścieżki do pierwszej litery.



## Model ról 1.6.2

Szczegóły kont, UID i łączenia roli skarbnika Rady z prowadzeniem klasy opisuje `ROLE_MODEL.md`.

### Poprawka publikacji GitHub

Skrypt `scripts/publish_to_github.ps1` ma poprawione sprawdzanie `.firebase_node20`, żeby nie zatrzymywał publikacji przy prawidłowym `.gitignore`.



## Wersja 1.6.2 FINAL

- Dodano widoczną wersję/build w ustawieniach.
- Dodano przycisk czyszczenia cache aplikacji oraz plik `reload-cache.html`.
- Zmieniono service worker na strategię network-first dla HTML/JS/CSS, żeby po publikacji łatwiej ładować nową wersję.
- Doprecyzowano zakładanie kont Firebase: e-mail/hasło oraz opcjonalne logowanie Google.
