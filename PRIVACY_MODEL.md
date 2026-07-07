# Model prywatności — wersja finalna po etapach 1–6

## Najważniejsza zasada

W aplikacji nie ma osobnego administratora, który widzi wszystko.

**Skarbnik Rady Rodziców administruje aplikacją**, ale jego dostęp finansowy dotyczy tylko obszaru Rady Rodziców.

Prywatne pieniądze klasowe są widoczne tylko dla skarbnika danej klasy albo osoby, której skarbnik Rady przypisał tę konkretną klasę.

## Zakres Rady Rodziców

Skarbnik Rady Rodziców widzi i obsługuje:

- lata szkolne,
- listę klas,
- listę uczniów do kontroli składek na Radę,
- wpłaty na Radę Rodziców,
- wydatki Rady Rodziców,
- raporty Rady Rodziców,
- użytkowników i role.

Nie widzi automatycznie:

- wpłat prywatnej kasy klasowej,
- wydatków prywatnej kasy klasowej,
- salda prywatnej kasy klasowej.

## Zakres klasy

Skarbnik klasy widzi tylko przypisaną klasę, np. Vb:

- uczniów tej klasy,
- prywatne wpłaty klasowe tej klasy,
- wydatki klasowe tej klasy,
- saldo tej klasy,
- raporty tej klasy.

Nie widzi pieniędzy innych klas.

## Użytkownik z dwiema funkcjami

Jeżeli ta sama osoba jest skarbnikiem Rady Rodziców i skarbnikiem klasy, nadaje się jej rolę **Skarbnik Rady Rodziców** oraz zaznacza prywatną klasę w polu klas.

Wtedy widzi:

- finanse Rady Rodziców,
- prywatną kasę swojej klasy,
- ale nie widzi kas klasowych innych klas.

## Synchronizacja Firebase

Od etapu 15.2 dane w Firebase są rozdzielone na dwa typy dokumentów:

- `snapshots/main` — zakres Rady Rodziców,
- `classSnapshots/{classId}` — prywatny zakres konkretnej klasy.

Dzięki temu prywatne finanse klasowe nie są wrzucane do jednego wspólnego dokumentu razem z danymi Rady.
