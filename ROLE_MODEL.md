# Model kont i uprawnień — eSkarbnik 1.6.2

## Konto a rola

Konto Firebase Authentication służy tylko do logowania: e-mail + hasło.

Rola użytkownika jest osobnym wpisem w Firestore, przypisanym do UID użytkownika w danym obszarze synchronizacji.

## Skarbnik Rady i skarbnik klasy jednocześnie

Jedna osoba może być jednocześnie skarbnikiem Rady Rodziców i prowadzić prywatną kasę konkretnej klasy.

W aplikacji ustaw wtedy:

1. Główna rola: `Skarbnik Rady Rodziców`.
2. Dodatkowy dostęp do prywatnych kas klasowych: zaznacz właściwą klasę lub klasy.

Nie trzeba tworzyć drugiego konta.

## Dlaczego są klasy prywatne

Dane Rady Rodziców i prywatne kasy klasowe są rozdzielone. Skarbnik Rady ma uprawnienia do danych Rady i administracji, ale prywatne kasy klasowe są dostępne tylko wtedy, gdy dana klasa jest zaznaczona przy jego koncie.

## UID

UID to nie e-mail i nie nazwa pliku. UID jest widoczny w panelu `Użytkownicy` po zalogowaniu konta. Można użyć przycisku `Wstaw mój UID`, gdy edytujesz swoje własne konto.
