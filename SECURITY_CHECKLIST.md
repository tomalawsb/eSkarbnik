# Lista bezpieczeństwa przed użyciem produkcyjnym

- [ ] Firebase Authentication: włączone tylko logowanie e-mail/hasło.
- [ ] Firestore: wdrożone finalne `firestore.rules`, nie bootstrap.
- [ ] Pierwszy skarbnik Rady ustawiony świadomie.
- [ ] Hasła użytkowników mają minimum 8 znaków i nie są współdzielone.
- [ ] Obszar synchronizacji ma unikalną nazwę, np. `eskarbnik-zsp-czermin-2025`.
- [ ] Role użytkowników sprawdzone w zakładce **Użytkownicy**.
- [ ] Skarbnik klasy ma przypisaną tylko swoją klasę.
- [ ] Podgląd nie ma prawa zapisu.
- [ ] Klucz API do AI nie jest wpisany w kodzie źródłowym.
- [ ] Regularnie pobierana jest kopia JSON w zakładce **Ustawienia**.
- [ ] Przed importem Excela wykonana jest kopia JSON.
- [ ] Nie są przechowywane zdjęcia paragonów, tylko dane wydatku.


## Prywatność kas klasowych

- [ ] Skarbnik Rady Rodziców nie ma przypisanych klas prywatnych, których nie prowadzi.
- [ ] Skarbnik klasy ma przypisaną wyłącznie swoją klasę.
- [ ] Reguły `firestore.rules` są wdrożone po bootstrapie.
- [ ] Nie używasz produkcyjnie `firestore.bootstrap.rules`.
- [ ] W Firebase dane Rady są w `snapshots/main`, a dane klas w `classSnapshots/{classId}`.
