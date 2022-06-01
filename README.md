# pensjon-etterlatte

Monorepo for ny løsning for ytelser til etterlatte


## Apper

[barnepensjon-ui](apps/barnepensjon-ui) \
Brukergrensesnittet for "Søknad om barnepensjon".

[etterlatte-node-server](apps/etterlatte-node-server) \
Felles node backend for Team Etterlatte sine React-apper.

[gjenlevendepensjon-ui](apps/gjenlevendepensjon-ui) \
Brukergrensesnittet for "Søknad om gjenlevendepensjon".

[innsendt-soeknad](apps/innsendt-soeknad) \
Database app for håndtering av søknader (lagring, uthenting, sending, m.m.).

[journalfoer-soeknad](apps/journalfoer-soeknad) \
Sikrer korrekt Journalføring av innsendt søknad.

[selvbetjening-api](apps/selvbetjening-api) \
API som tilgjengeliggjør data for frontend å kommunisere med diverse apper. 

[sjekk-adressebeskyttelse](apps/sjekk-adressebeskyttelse) \
Går igjennom alle fødselsnummer i søknaden og sjekker om noen av de har adressebeskyttelse.


# Bygg og deploy

En app bygges og deployes automatisk når en endring legges til i `main`. 

For å trigge **manuell deploy** kan du gå til `Actions -> (velg workflow) -> Run workflow from <branch>`


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.


## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #po-pensjon-team-etterlatte.
