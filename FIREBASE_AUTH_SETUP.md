# Firebase Authentication — szybka kontrola

Jeżeli przy tworzeniu konta pojawia się błąd `auth/configuration-not-found`, problem zwykle nie jest w haśle ani w aplikacji, tylko w konfiguracji Firebase.

Sprawdź kolejno:

1. Firebase Console → Build → Authentication.
2. Kliknij **Get started**, jeśli Authentication nie było jeszcze uruchomione.
3. Wejdź w **Sign-in method**.
4. Włącz provider **Email/Password**.
5. W zakładce **Project settings → General → Your apps** skopiuj pełny config aplikacji webowej.
6. W eSkarbniku wejdź w **Synchronizacja**, wklej config i kliknij **Zapisz konfigurację**.
7. Dopiero wtedy utwórz konto w zakładce **Użytkownicy**.

Uwaga: config musi pochodzić z tego samego projektu, na który wdrażasz hosting, np. `eskarbnik-fa364`.


## Dopisek 1.6.2

Przycisk `Utwórz konto e-mail/hasło` działa tylko, gdy w Firebase Authentication włączony jest dostawca Email/Password. Przycisk `Google` działa tylko, gdy w Authentication → Sign-in method włączony jest dostawca Google oraz domena aplikacji jest na liście Authorized domains.

## Dopisek 1.6.3 ETAP 1

- Config projektu `eskarbnik-fa364` jest wpisany w kod aplikacji.
- Pole `Firebase config` w zakładce Synchronizacja służy tylko do nadpisania configu, jeśli projekt Firebase zostanie zmieniony.
- Tworzenie konta e-mail/hasło wymaga teraz pola `Powtórz hasło`.
- Logowanie Google na telefonie używa przekierowania, a na komputerze próbuje okna Google i w razie blokady przechodzi na przekierowanie.
- Jeżeli nadal pojawia się `auth/configuration-not-found`, trzeba w Firebase Console włączyć Authentication oraz dostawcę Email/Password i Google. Kod aplikacji nie może tego aktywować za projekt.
