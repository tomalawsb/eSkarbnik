# Etap 4 — udostępnianie tekstu do eSkarbnika

Ten etap dodaje lekką integrację PWA z menu udostępniania Androida.

## Jak ma działać

1. Użytkownik otwiera Obiektyw Google albo aparat z rozpoznawaniem tekstu.
2. Zaznacza tekst z paragonu.
3. Wybiera `Udostępnij`, jeżeli Android / aplikacja OCR pokazuje taką opcję.
4. Wybiera `eSkarbnik`.
5. Aplikacja otwiera sekcję `Paragony`, wstawia odebrany tekst i uruchamia analizę lokalną.

## Ograniczenia

- To nie jest OCR w eSkarbniku.
- Aplikacja nie dostaje zdjęcia paragonu i go nie zapisuje.
- Działanie zależy od Androida, przeglądarki oraz tego, czy Obiektyw Google / aparat udostępnia rozpoznany tekst jako zwykły tekst.
- Jeżeli opcja udostępnienia nie działa, podstawowa metoda zostaje bez zmian: skopiuj tekst i kliknij `Wklej i analizuj`.

## Zmienione pliki

- `manifest.json` — dodano `share_target`.
- `app.js` — dodano obsługę parametrów `shareTarget=receipt`, `text`, `title`, `url`.
- `index.html` — dopisano instrukcję dla użytkownika.
- `service-worker.js` — podbito cache PWA.
