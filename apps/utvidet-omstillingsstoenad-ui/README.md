# utvidet-omstillingsstoenad-ui

## Status for søknaden

Skjemagrunnmuren har seks steg med egne ruter, fremdrift, Forrige/Neste/Avbryt og kladdlagring før navigasjon. Introsiden og kvitteringen telles ikke med. Stegene viser foreløpig at de er under arbeid, og det finnes ingen knapp for innsending. Feltene og innholdet kommer i egne arbeidspakker.

`SoeknadSteg` gir hvert steg en egen react-hook-form-instans, `FormProvider` og en feilliste med fokus og lenker til feltene. Bruk feltets navn som `id`, også for nøstede felt. Betingede felt styres med `watch`/`useWatch` og fjernes med `shouldUnregister`. Steget oppdaterer sin del av søknaden gjennom `oppdaterSoeknad`. Neste steg validerer før lagring. Forrige steg og Fortsett senere lagrer også ufullstendige svar.

Frontendmodellen ligger i `src/typer/skjema.ts`. `src/utils/mapSoeknad.ts` mapper svarene til kontrakten og tar inn oversettelsesfunksjonen for valgt språk. Mappingen kobles til innsending når oppsummeringen bygges. Testene bruker kopier av de tre `utvidet_omstillingsstoenad*.json`-eksemplene fra `pensjon-etterlatte-felles/common/src/test/resources/soeknad/`, hentet 20. oktober 2026. Innholdet er uendret, men filene er formatert med Biome.

Mappingen følger spesifikasjonen der eksempeltekstene avviker. Aktivitetsplan sendes bare ved tiltak (Å1), samboers inntekt er `null` (Å2), og utbetalingsinformasjon er `null` (Å5). Disse spørsmålene må fortsatt avklares før innsendingen ferdigstilles.

Felles [veikart og arbeidspakker](../../.github/utvidet-oms/veikart.md), [beslutninger](../../.github/utvidet-oms/beslutninger.md) og [spesifikasjon](../../.github/utvidet-oms/spesifikasjon.md) ligger i dette repoet. Start `copilot` fra reporoten, og velg `utvidet-oms` med `/agent`. Agenten, dokumentasjonen og statusskriptet flyttes tilbake til Gjenny når arbeidet går over til behandlingsløpet der (B7).

## Kom i gang

For å kjøre prosjektet må du installere Node/NPM. Dette kan forenkles ved å [installere nvm](https://github.com/nvm-sh/nvm) (Node Version Manager).\
_Må bruke en stabil versjon av node (f.eks 20)._

Dersom du ikke har installert Yarn kan du kjøre:\
`npm install --global yarn`

Deretter sjekk at det ble installert riktig:\
`yarn --version`

Du er også nødt til å installere `naisdevice` og sette opp `kubectl` for at koblinger mot GCP skal fungere.\
Les mer her: https://doc.nais.io

### Legg til PAT

1. Gå til [New personal access token](https://github.com/settings/tokens/new) på GitHub
2. Skriv noe som `NAV IT` under `Note`
3. Velg hvor lenge du vil at det skal vare under `Expiration`
4. Under `Select scope` velg `repo` og `read:packages`
5. Trykk `Generate token`
6. Kopier `ghp_x...` tokenet og putt det i `.npmrc` filen på maskinen din.\
   Eks: `//npm.pkg.github.com/:_authToken=ghp_x...`
7. Trykk `Configure SSO`
8. Trykk `Authorize` på `navikt`
9. Ferdig!

## Kjøre lokalt

Installere prosjektet:\
`yarn install`

Installere etterlatte-node-server:\
`cd ../etterlatte-node-server && yarn install`

Kjøre opp både frontend og [etterlatte-node-server](../etterlatte-node-server) samtidig:\
`yarn dev`

Kjøre prosjektet (mot lokalt kjørende [etterlatte-node-server](../etterlatte-node-server)):\
`yarn start` 

Åpne [http://localhost:3000/utvidet-omstillingsstonad/soknad](http://localhost:3000/utvidet-omstillingsstonad/soknad) i nettleseren.

### Testing

Teste prosjektet:\
`yarn test`

Kjøre cypress tester (krever at prosjektet kjører lokalt først):

-   `yarn cy:open` Åpner Cypress konsollet i din nettleser for å interaktivt kunne se kjøringene.

-   `yarn cy:test` Kjører testene headless fra CLI.

### Koble til APIet lokalt

Grunnet manglende støtte for Token/IDporten lokalt er det ikke mulig å kjøre mot APIet lokalt. 
Appen må gå mot lokalt mock api (se [etterlatte-node-server](../etterlatte-node-server))
Dette er ikke en ideel løsning og burde på sikt forbedres.

## Testmiljøet

Appen har bare ett deployment-oppsett: `.nais/dev.yaml` for `dev-gcp`. Intern og ekstern dev-adresse peker til samme Nais-app, `utvidet-omstillingsstoenad-ui`. Workflowen har produksjonsdeploy deaktivert. Appen er ikke klar for produksjon.

Applikasjonen kjører på `dev-gcp` og kan testes på følgende url:
[https://etterlatte.intern.dev.nav.no/utvidet-omstillingsstonad/soknad](https://etterlatte.intern.dev.nav.no/utvidet-omstillingsstonad/soknad)

Må koble til [naisdevice](https://doc.nais.io/device/) eller åpne adressen via Citrix/Utviklerimage.

Innloggingsdetaljer kan oppdrives av noen i teamet.

# Nav avhengigheter

## Dekoratøren

https://github.com/navikt/nav-dekoratoren

## Aksel

Tar i bruk designsystemet til Nav, Aksel.

Les mer her: https://aksel.nav.no
