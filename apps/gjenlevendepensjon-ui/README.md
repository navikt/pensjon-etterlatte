# gjenlevendepensjon-ui

## Kom i gang

For å kjøre prosjektet må du installere Node/NPM. Dette kan forenkles ved å [installere nvm](https://github.com/nvm-sh/nvm) (Node Version Manager).

Dersom du ikke har installert Yarn kan du kjøre:\
`npm install --global yarn`

Deretter sjekk at det ble installert riktig:\
`yarn --version`

Du er også nødt til å installere `naisdevice` og sette opp `kubectl` for at koblinger mot GCP skal fungere.\
Les mer her: https://doc.nais.io

## Kjøre lokalt

Installere prosjektet:\
`yarn install`

Kjøre prosjektet (med labs sitt mock-api):\
`yarn start` eller `yarn start:labs` 

Kjøre prosjektet (mot lokalt kjørende [etterlatte-node-server](../etterlatte-node-server)):\
`yarn start:mock`

Åpne [http://localhost:3000/gjenlevendepensjon/soknad](http://localhost:3000/gjenlevendepensjon/soknad) i nettleseren.


### Testing

Teste prosjektet:\
`yarn test`

Kjøre cypress tester (krever at prosjektet kjører lokalt først):

- `yarn cy:open` Åpner Cypress konsollet i din nettleser for å interaktivt kunne se kjøringene.

- `yarn cy:test` Kjører testene headless fra CLI.

### Koble til APIet lokalt

Grunnet manglende støtte for Token/IDporten lokalt er det ikke mulig å kjøre mot APIet lokalt. 
Appen går derfor enten mot labs-gcp eller lokalt mock api (se [etterlatte-node-server](../etterlatte-node-server))
Dette er ikke en ideel løsning og burde på sikt forbedres.

## Testmiljøet

Applikasjonen kjører på `dev-gcp` og kan testes på følgende url:
[https://etterlatte.dev.nav.no/gjenlevendepensjon/soknad](https://etterlatte.dev.nav.no/gjenlevendepensjon/soknad) 

Må koble til [naisdevice](https://doc.nais.io/device/) eller åpne adressen via Citrix/Utviklerimage.

Innloggingsdetaljer kan oppdrives av noen i teamet. 

# NAV Avhengigheter

## Dekoratøren

https://github.com/navikt/nav-dekoratoren

## NAV Frontend-moduler / Designsystemet

Tar i bruk designsystemet til NAV.

Les mer her: https://design.nav.no eller se [prosjektet sitt repo](https://github.com/navikt/nav-frontend-moduler).

Vil på sikt gå helt over til [Designsystemet](https://navikt.github.io/Designsystemet) når det er ferdig. 

# Annet

Bruker `react-scripts`: https://www.npmjs.com/package/react-scripts med `SCSS`.

Prosjektet kjører `pretty-quick` on-`git commit` for automatisk kjøring av prettier, samt linting av js/ts og less on-`git push`.
