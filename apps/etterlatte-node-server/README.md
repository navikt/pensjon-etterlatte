# etterlatte-node-server

## Om prosjektet

Felles node backend for Team Etterlatte.

## Hvordan ta i bruk

`etterlatte-node-server` bygges til et Docker-image sammen med valgte forntend.

Frontend appen sin NAIS config må også inneholde følgende verdier under `env`:

| Nøkkel      | Beskrivelse                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------- |
| `BASE_PATH` | Del av ingress hvor appen ligger. Eks. nav.no/produkt/soknad gir base path `/produkt/soknad` |
| `API_URL`   | URL til APIet i Kubernetes-clusteret                                                         |
| `AUDIENCE`  | Audience for å kalle på APIet                                                                |

(se [barnepensjon-ui](../barnepensjon-ui/.nais), [omstillingsstoenad-ui](../omstillingsstoenad-ui/.nais) eller
[selvbetjening-ui](../selvbetjening-ui/.nais) for referanser)

## Kjøre lokalt

Vi bruker personal access token til autentisering for å hente intern pakker til prosjektet.
Du må derfor sette `export NPM_TOKEN='DITT_TOKEN'` som miljøvariabel.
Dette tokenet må autoriseres mot navikt.

Installere prosjektet:\
`yarn install`

Kjøre prosjektet (uten BASE_PATH):\
`yarn start`

### Kjøre barnepensjon og omstillingstønad søknader lokalt

Kjøre prosjektet (BASE_PATH=/barnepensjon/soknad):\
`yarn start:bp`

Kjøre prosjektet (BASE_PATH=/omstillingsstonad/soknad):\
`yarn start:oms`

### Kjøre selvbetjening lokalt

For å kunne koble selvbetjening mot Sanity trenger du følgende miljøvariabler i en `.env` fil, verdiene til disse miljøvariablene kan du få utlevert av en i team etterlatte.

| Nøkkel              | Beskrivelse                                                     |
| ------------------- | --------------------------------------------------------------- |
| `SANITY_API_TOKEN`  | Token for å autentisere seg mot etterlatte sitt Sanity prosjekt |
| `SANITY_PROJECT_ID` | Prosjekt ID hvor etterlatte sitt Sanity prosjekt lever          |

Kjøre prosjektet (BASE_PATH=/omstillingsstonad/skjema):\
`yarn start:selvbetjening`

### OBS!

Grunnet manglende støtte for lokalt token er det kun mulig å kjøre mock-api lokalt.
