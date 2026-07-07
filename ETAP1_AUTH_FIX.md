# eSkarbnik 1.6.3 ETAP 1 — logowanie i konta

Wprowadzone zmiany:

1. Config Firebase projektu `eskarbnik-fa364` jest wpisany bezpośrednio w `app.js`.
2. Zakładka Synchronizacja nadal pozwala nadpisać config, ale domyślnie aplikacja używa configu z kodu.
3. Dodano pole `Powtórz hasło` w formularzu logowania/tworzenia konta.
4. `Utwórz konto` sprawdza:
   - poprawny e-mail,
   - minimum 6 znaków hasła,
   - czy pole `Powtórz hasło` jest wypełnione,
   - czy oba hasła są identyczne.
5. Logowanie Google:
   - na telefonie używa `signInWithRedirect`,
   - na komputerze używa `signInWithPopup`,
   - gdy popup zostanie zablokowany, przełącza się na redirect.
6. Dodano obsługę wyniku logowania Google po powrocie z przekierowania.
7. Doprecyzowano komunikaty Firebase Authentication.
8. Podbito wersję, build, cache PWA i cache bustery do `1.6.3-etap1-auth`.

Ważne:

Jeżeli mimo tej poprawki nadal pojawia się `auth/configuration-not-found`, to w Firebase Console nadal nie jest aktywne Firebase Authentication albo provider logowania. Tego aplikacja nie może włączyć sama z poziomu kodu.

W Firebase Console musi być włączone:

- Authentication → Get started,
- Sign-in method → Email/Password,
- Sign-in method → Google,
- Authentication → Settings → Authorized domains: domena, na której działa aplikacja.
