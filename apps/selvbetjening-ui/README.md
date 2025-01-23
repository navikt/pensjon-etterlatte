# selvbetjening-ui

# WIP!

## Kom i gang

For å kjøre prosjektet må du installere Node/NPM. Dette kan forenkles ved å [installere nvm](https://github.com/nvm-sh/nvm) (Node Version Manager).\
_Må bruke en stabil versjon av node (v22+)._

Dersom du ikke har installert Yarn kan du kjøre:\
`npm install --global yarn`

Deretter sjekk at det ble installert riktig:\
`yarn --version`

Du er også nødt til å installere `naisdevice` og sette opp `kubectl` for at koblinger mot GCP skal fungere.\
Les mer her: https://doc.nais.io

Installere prosjektet:\
`yarn install`

Kjøre opp både frontend og [etterlatte-node-server](../etterlatte-node-server) samtidig:\
`yarn dev`

Kjøre prosjektet (mot lokalt kjørende [etterlatte-node-server](../etterlatte-node-server)):\
`yarn start`

Åpne [http://localhost:5173/omstillingsstonad/skjema/inntekt/innledning](http://localhost:5173/omstillingsstonad/inntekt/innledning) i nettleseren.

### Testing

Teste prosjektet:\
`yarn test`

Kjøre cypress tester (krever at prosjektet kjører lokalt først):

- `yarn cy:open` Åpner Cypress konsollet i din nettleser for å interaktivt kunne se kjøringene.

- `yarn cy:test` Kjører testene headless fra CLI.

### Koble til APIet lokalt

Grunnet manglende støtte for Token/IDporten lokalt er det ikke mulig å kjøre mot APIet lokalt.
Appen må gå mot lokalt mock api (se [etterlatte-node-server](../etterlatte-node-server))
Dette er ikke en ideel løsning og burde på sikt forbedres.

## Testmiljøet

Applikasjonen kjører på `dev-gcp` og kan testes på følgende url:
[https://etterlatte.ekstern.dev.nav.no/omstillingsstonad/inntekt/innledning](https://etterlatte.intern.dev.nav.no/selvbetjening)

Må koble til [naisdevice](https://doc.nais.io/device/) eller åpne adressen via Citrix/Utviklerimage.

Innloggingsdetaljer kan oppdrives av noen i teamet.

# Nav avhengigheter

## Dekoratøren

https://github.com/navikt/nav-dekoratoren

## Aksel

Tar i bruk designsystemet til Nav, Aksel.

Les mer her: https://aksel.nav.no.
