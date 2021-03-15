# Selvbetjening UI

## Kom i gang

For å kjøre prosjektet må du installere Node/NPM. Dette kan forenkles ved å [installere nvm](https://github.com/nvm-sh/nvm) (Node Version Manager).

Dersom du ikke har installert Yarn kan du kjøre:\
`npm install --global yarn`

Deretter sjekk at det ble installert riktig:\
`yarn --version`


### Kjøre lokalt

Installere prosjektet:\
`yarn install`

Kjøre prosjektet:\
`yarn start`

Kjører prosjektet lokalt.\
Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

Teste prosjektet:\
`yarn test`

### Koble til APIet lokalt

For å koble til `selvbetjening-api` kan du bruke port forwarding: 

`kubectl -n etterlatte port-forward svc/selvbetjening-api 8085:80`

### Bygging for produksjon:

```
yarn install
yarn run build
```

For å kjøre build lokalt kan `serve` brukes:
https://www.npmjs.com/package/serve

```
yarn install -g serve
serve build
```


## NAV Frontend-moduler

Tar i bruk designsystemet til NAV.

Les mer her: https://design.nav.no eller se [prosjektet sitt repo](https://github.com/navikt/nav-frontend-moduler).

---

## Diverse

Bruker pakken `Craco` https://www.npmjs.com/package/@craco/craco for å kunne extende Webpack-features uten å ta i bruk `eject`.

Satt opp for å støtte lasting av `less` filer ved hjelp av `craco-less` https://github.com/DocSpring/craco-less#readme.

Prosjektet kjører `pretty-quick` on-`git commit` for automatisk kjøring av prettier, samt linting av js/ts og less on-`git push`.
