# Publikacja aplikacji eSkarbnik

## 1. GitHub

1. Utwórz puste repozytorium na GitHub.
2. W PowerShell uruchom z katalogu projektu:

```powershell
.\scripts\publish_to_github.ps1
```

GitHub ma służyć jako miejsce przechowywania kodu i historii zmian.

## 2. Firebase

W Firebase Console utwórz projekt i włącz:

- Authentication → Email/Password,
- Firestore Database,
- Hosting.

Następnie w katalogu projektu:

```powershell
npm install -g firebase-tools
firebase login
firebase init hosting firestore
```

Jeżeli `firebase init` nadpisze `firebase.json`, przywróć plik z tej paczki.

Utwórz plik `.firebaserc` na podstawie `.firebaserc.example`:

```json
{
  "projects": {
    "default": "TWOJ_FIREBASE_PROJECT_ID"
  }
}
```

## 3. Pierwszy skarbnik Rady

Najbezpieczniej: po utworzeniu konta w aplikacji dodaj dokument roli ręcznie w Firestore:

Ścieżka:

```text
radaRodzicowPro / TWOJ_OBSZAR_SYNCHRONIZACJI / roles / UID_UZYTKOWNIKA
```

Dane dokumentu:

```json
{
  "role": "schoolTreasurer",
  "email": "twoj@email.pl",
  "classIds": [],
  "createdAt": "2026-06-26T00:00:00.000Z",
  "updatedAt": "2026-06-26T00:00:00.000Z",
  "updatedBy": "manual"
}
```

Alternatywa: tymczasowo użyj `firestore.bootstrap.rules`, ustaw siebie jako pierwszego skarbnika Rady w aplikacji, a potem natychmiast wróć do `firestore.rules`.

## 4. Wdrożenie

```powershell
.\scripts\deploy_firebase.ps1
```

Nowy skrypt działa jak wersja używana w projekcie „Listy zakupów”:

- pobiera lokalnie przenośny Node.js 20 do `.firebase_node20`,
- instaluje lokalnie Firebase CLI 14.18.0,
- nie korzysta z globalnego Node/Firebase CLI z Windows,
- przy pierwszym uruchomieniu zapyta o Firebase Project ID i zapisze go w lokalnym `.firebaserc`,
- wdraża Hosting, reguły Firestore i indeksy Firestore.

Jeżeli masz kilka kont Google w Firebase, możesz wymusić konto:

```powershell
.\scripts\deploy_firebase.ps1 -FirebaseAccount "twoj-adres@gmail.com"
```

Możesz też podać projekt bez zapisywania ręcznie `.firebaserc`:

```powershell
.\scripts\deploy_firebase.ps1 -ProjectId "twoj-firebase-project-id"
```

## 5. Konfiguracja w aplikacji

W aplikacji wejdź w zakładkę **Synchronizacja**, wklej `firebaseConfig` z Firebase Console i wpisz obszar synchronizacji, np.:

```text
eskarbnik-zsp-czermin
```

Potem zaloguj się w zakładce **Użytkownicy**.


## Lokalny folder projektu

Docelowo rozpakuj lub skopiuj projekt do:

```text
E:\Programy\Dropbox\Wszystko\Prace\Tomek\Python\App Firebase\Rada_rodzicow\eSkarbnik
```

Skrypt `publish_to_github.ps1` ma domyślnie ustawione repozytorium:

```text
https://github.com/tomalawsb/eSkarbnik.git
```
