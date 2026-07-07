# eSkarbnik 1.6.3 ETAP 3 — responsywność telefonu

Zakres zmian:

1. Kafelki `summary-card` i `dashboard-cards-grid` przechodzą teraz na układ `auto-fit`, więc nie wymuszają 4 kolumn na telefonie.
2. Długie napisy w kafelkach, przyciskach, tabelach i listach zawijają się zamiast ucinać lub wypychać ekran.
3. Przyciski w wierszach akcji mają elastyczny układ — na szerokim ekranie mogą być obok siebie, a na wąskim schodzą do jednej kolumny.
4. Formularze, listy, tabele raportów/importu i wiersze podsumowań nie powinny powodować poziomego przewijania.
5. Nagłówek mobilny, logo, badge statusów i menu boczne mają ciaśniejsze wartości na małych ekranach.
6. Poprawiono niejednoznaczne zmienne CSS `--border-color`, `--surface-color`, `--muted-text` dla podglądu raportów/importu.
7. Podbito wersję, build i cache PWA do `1.6.3-etap3-responsive`.

To jest etap wyglądu/responsywności, bez usuwania opisów z interfejsu. Usuwanie zbędnych opisów zostaje na etap 4.
