# pensjon-etterlatte

Monorepo for ny løsning for ytelser til etterlatte.

Hvordan appene henger sammen kan du se her: [Arkitekturskisse - Confluence](https://confluence.adeo.no/display/TE/Arkitektur)


# Apper

[barnepensjon-ui](apps/barnepensjon-ui) \
Brukergrensesnittet for "Søknad om barnepensjon".

[etterlatte-node-server](apps/etterlatte-node-server) \
Felles node backend for søknadsdialogene (gjenlevendepensjon og barnepensjon).

[gjenlevendepensjon-ui](apps/gjenlevendepensjon-ui) \
Brukergrensesnittet for "Søknad om gjenlevendepensjon".

[innsendt-soeknad](apps/innsendt-soeknad) \
Database app for håndtering av søknader (lagring, uthenting, sending, m.m.).

[journalfoer-soeknad](apps/journalfoer-soeknad) \
Sikrer korrekt Journalføring av innsendt søknad.

[omstillingsstoenad-ui](apps/omstillingsstoenad-ui) \
Brukergrensesnittet for "Søknad om omstillingsstønad".

[selvbetjening-api](apps/selvbetjening-api) \
API som tilgjengeliggjør data for frontend å kommunisere med diverse apper. 

[sjekk-adressebeskyttelse](apps/sjekk-adressebeskyttelse) \
Går igjennom alle fødselsnummer i søknaden og sjekker om noen av de har adressebeskyttelse.

# Flyt

### Søknad mottatt
```mermaid
flowchart LR

classDef app fill:#88AACC,color:#000,stroke:#335577
classDef db fill:#ccc,color:#000,stroke:#777
classDef text fill:none,color:#ddd

barnepensjon-ui:::app --> selvbetjening-api
gjenlevendepensjon-ui:::app --> selvbetjening-api

subgraph frontend["Soeknad frontend"]
    barnepensjon-ui
    gjenlevendepensjon-ui
end

selvbetjening-api:::app --> innsendt-soeknad
innsendt-soeknad:::app <--> innsendt-soeknad-v2[(soeknad\ndatabase)]:::db
innsendt-soeknad -.-> sjekk-adressebeskyttelse
sjekk-adressebeskyttelse:::app -.-> journalfoer-soeknad
journalfoer-soeknad:::app --> dokarkiv
journalfoer-soeknad -. dokarkivResponse .-> innsendt-soeknad
journalfoer-soeknad --> ey-pdfgen:::app

selvbetjening-api --> pdl
selvbetjening-api --> kodeverk
sjekk-adressebeskyttelse --> pdl

subgraph ekstern["NAV felles"]
    dokarkiv
    kodeverk
    pdl
end
```

# Kom i gang

Noen avhengigheter i prosjektet ligger i Github Package Registry som krever autentisering. Det enkleste er å lage en [PAT (Personal Access Token)](https://github.com/settings/tokens). 

1. [Opprett PAT her](https://github.com/settings/tokens). I tilfelle lenken ikke fungerer går man til `Github -> Settings -> Developer settings -> Personal access tokens`
2. Huk av `read:packages`. Ikke legg til flere scopes enn nødvendig.
3. Autoriser navikt-organisasjonen for SSO ved å velge "Configure SSO" på tokenet
4. Tokenet legges i `.zshrc` med `export GITHUB_TOKEN=<token>`

# Felles apper

Alle apper som er felles for Team Etterlatte ligger i [etterlatte-pensjon-felles](https://github.com/navikt/pensjon-etterlatte-felles).  

# Kafka / Rapids & Rivers

Topic.yaml-filer er flyttet til [etterlatte-pensjon-felles](https://github.com/navikt/pensjon-etterlatte-felles).

# Bygg og deploy

En app bygges og deployes automatisk når en endring legges til i `main`. 

For å trigge **manuell deploy** kan du gå til `Actions -> (velg workflow) -> Run workflow from <branch>`


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.


## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #po-pensjon-team-etterlatte.
