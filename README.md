# pensjon-etterlatte

Monorepo for ny løsning for ytelser til etterlatte


## Apper

[etterlatte-kafkamanager](apps/etterlatte-kafkamanager) \
Kafka Manager for å enkelt se flyten til en søknad.

[etterlatte-notifikasjoner](apps/etterlatte-notifikasjoner) \
App som sender notifikasjoner (e-post, sms, melding på nav.no) til sluttbrukeren.

[etterlatte-pdl-proxy](apps/etterlatte-pdl-proxy) \
Ny proxy for å tillate kommunikasjon mellom GCP og On-Prem.

[etterlatte-proxy](apps/etterlatte-proxy) \
Proxy for å tillate kommunikasjon mellom GCP og On-Prem.

[ey-pdfgen](apps/ey-pdfgen) \
Enkel app for opprettelse av PDF til journalføring. Benytter seg av [pdfgen](https://github.com/navikt/pdfgen)

[innsendt-soeknad](apps/innsendt-soeknad) \
Database app for håndtering av søknader (lagring, uthenting, sending, m.m.).

[journalfoer-soeknad](apps/journalfoer-soeknad) \
Sikrer korrekt Journalføring av innsendt søknad.

[selvbetjening-api](apps/selvbetjening-api) \
API som tilgjengeliggjør data for frontend å kommunisere med diverse apper. 

[gjenlevendepensjon-ui](apps/gjenlevendepensjon-ui) \
Brukergrensesnittet for "Søknad om gjenlevendepensjon".

[sjekk-adressebeskyttelse](apps/sjekk-adressebeskyttelse) \
Går igjennom alle fødselsnummer i søknaden og sjekker om noen av de har adressebeskyttelse.


# Bygg og deploy

En app bygges og deployes automatisk når en endring legges til i `main`. 

For å trigge **manuell deploy** kan du gå til `Actions -> (velg workflow) -> Run workflow from <branch>`


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.


## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #po-pensjon-team-etterlatte.
