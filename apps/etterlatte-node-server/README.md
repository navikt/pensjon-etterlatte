# etterlatte-node-server

## Om prosjektet

Felles node backend for Team Etterlatte.

## Hvordan ta i bruk

`etterlatte-node-server` bygges til et Docker-image som kan brukes av eksempelvis en React app.

Skal fungere ved å legge til følgende linjer i appen sin Dockerfile: 

``` 
FROM ghcr.io/navikt/pensjon-etterlatte/etterlatte-node-server:<VERSJON>

COPY build ./build
```

Frontend appen sin NAIS config må også inneholde følgende verdier under `env`:

| Nøkkel     | Beskrivelse |
| ---        | ---         |
|`BASE_PATH` | Del av ingress hvor appen ligger. Eks. nav.no/produkt/soknad gir base path `/produkt/soknad`  |        
|`API_URL`   | URL til APIet i Kubernetes-clusteret |   
|`AUDIENCE`  | Audience for å kalle på APIet |   

(se [barnepensjon-ui](../barnepensjon-ui/.nais), [gjenlevendepensjon-ui](../gjenlevendepensjon-ui/.nais) eller [omstillingsstoenad-ui](../omstillingsstoenad-ui/.nais) for referanser)

## Kjøre lokalt 

Installere prosjektet:\
`yarn install`

Kjøre prosjektet (uten BASE_PATH):\
`yarn start`

Kjøre prosjektet (BASE_PATH=/gjenlevendepensjon/soknad):\
`yarn start:gjenlevendepensjon`

Kjøre prosjektet (BASE_PATH=/barnepensjon/soknad):\
`yarn start:barnepensjon`

Kjøre prosjektet (BASE_PATH=/omstillingsstoenad/soknad)

### OBS!

Grunnet manglende støtte for lokalt token er det kun mulig å kjøre mock-api lokalt. 
