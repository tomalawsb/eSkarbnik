# Etap 3 — paragony ze schowka

Wdrożono lekką obsługę paragonów bez własnego OCR i bez zapisywania zdjęć.

## Przepływ użytkownika

1. Użytkownik otwiera Obiektyw Google albo aparat z rozpoznawaniem tekstu.
2. Skanuje paragon.
3. Zaznacza tekst i wybiera „Kopiuj”.
4. Wraca do eSkarbnika.
5. Klika „Wklej ze schowka” albo „Wklej i analizuj”.

## Technicznie

- Odczyt schowka jest wykonywany tylko po kliknięciu użytkownika.
- Aplikacja używa `navigator.clipboard.readText()`.
- Przyciski działają najlepiej w PWA/HTTPS albo na localhost.
- Gdy przeglądarka blokuje schowek, użytkownik może wkleić tekst ręcznie w pole paragonu.
