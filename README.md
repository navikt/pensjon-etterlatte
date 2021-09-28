# pensjon-etterlatte

Monorepo for ny løsning for ytelser til etterlatte


## Apper

[dodsfall-fra-leesah](apps/dodsfall-fra-leesah) \
`// TODO`

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

[finn-etterlatte](apps/finn-etterlatte) \
`// TODO`

[finn-fnr-soeknad](apps/finn-fnr-soeknad) \
Finner alle mulige fnr. (11 siffer) i en søknad og validerer de. Videresender alle gyldige fnr.  

[heartbeat](apps/heartbeat) \
`// TODO`

[innsendt-soeknad](apps/innsendt-soeknad) \
Database app for håndtering av søknader (lagring, uthenting, sending, m.m.).

[journalfoer-soeknad](apps/journalfoer-soeknad) \
Sikrer korrekt Journalføring av innsendt søknad.

[journalpost-info](apps/journalpost-info) \
Oppdaterer JournalpostInfo med korrekt enhet/ruting.

[selvbetjening-api](apps/selvbetjening-api) \
API som gjør det mulig for [frontend](apps/selvbetjening-ui) å kommunisere med diverse apper. 

[selvbetjening-ui](apps/selvbetjening-ui) \
Brukergrensesnittet for "Søknad om gjenlevendepensjon".

[sjekk-adressebeskyttelse](apps/sjekk-adressebeskyttelse) \
Går gjennom en liste med fnr. og sjekker om noen av de har adressebeskyttelse. 

[sjekk-alder-etterlatte](apps/sjekk-alder-etterlatte) \
`// TODO`

# Bygg og deploy

En app bygges og deployes automatisk når en endring legges til i `main`. 

For å trigge **manuell deploy** kan du gå til `Actions -> (velg workflow) -> Run workflow from <branch>`


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.


## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #po-pensjon-teambarnepensjon-utvikling.


