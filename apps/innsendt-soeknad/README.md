# innsendt-soeknad

## Om tjenesten

Appen **innsendt-soeknad** lagrer data tilknyttet søknader. Søknader lagres som kladd mens brukeren jobber med den.\
Ved innsending av søknad blir den konvertert til vanlig søknad og videresendt 
[etterlatte-gyldig-soeknad](https://github.com/navikt/pensjon-etterlatte-saksbehandling/tree/main/apps/etterlatte-gyldig-soeknad)



### Tabeller

| Navn     | Beskrivelse                                                                      |
|----------|----------------------------------------------------------------------------------|
| hendelse | Alle hendelser/endringer på søknaden                                             |
| innhold  | Søknadens innhold. **OBS:** Innhold slettes så fort søknad får status `ARKIVERT` |
| soeknad  | Holder på søknad ID, type og kilde                                               |
| status   | Tabell som inneholder alle gyldige statuser. Brukes som FK av `hendelse`         |

### Status på søknad

Flyten mellom de forskjellige statusene går i følgende rekkefølge:

| No. | Status            | Beskrivelse                                                        |
|-----|-------------------|--------------------------------------------------------------------|
| 1   | `LAGRETKLADD`     | Indikerer at søknaden foreløpig er under arbeid.                   |
| 2   | `FERDIGSTILT`     | Søknad er innsendt av bruker og klar for å publiseres på Kafka.    |
| 3   | `SENDT`           | Søknaden er publisert på Kafka og avventer arkivering.             |
| 4   | `ARKIVERT`        | Søknaden er arkivert OK.                                           |
| 5   | `ARKIVERINGSFEIL` | En feil oppsto ved arkivering.                                     |
| -   | `KONVERTERT`      | Indikerer kladd som konverteres når noen sender på vegne av andre. |
| -   | `SLETTET`         | Bruker har selv slettet søkaden sin.                               |
| -   | `UTGAATT`         | Kladd har blitt automatisk slettet                                 |

## API (endepunkter)

Appens API håndterer mottak og

### Søknad

```http 
POST /api/soeknad
```

Endepunktet forventer **body** i form av objektet `InnsendtSoeknad`.
Se [pensjon-etterlatte-libs](https://github.com/navikt/pensjon-etterlatte-libs).

### Kladd

Endepunkter tilknyttet henting og lagring av kladd. \
En søknad regnes som kladd når den har status `LAGRETKLADD`.

#### Lagre kladd

```http
POST /api/kladd
```

Uthenting av kladd krever `body` og query param `kilde` (`barnepensjon-ui` eller `omstillingsstoenad-ui`). \
Kreves kun at body er i form av JSON.

#### Hent kladd

```http
GET /api/kladd
```

Uthenting av kladd krever query param `kilde` (`barnepensjon-ui` eller `omstillingsstoenad-ui`).
Sjekker om det finnes søknad lagret på innlogget fnr og kilde. Returnerer kladd hvis funnet,
og 404 hvis ikke.

#### Slett kladd

```http
DELETE /api/kladd
```

Sletting av kladd krever query param `kilde` (`barnepensjon-ui` eller `omstillingsstoenad-ui`).
Søknaden blir så slettet (hvis den finnes) basert på innlogget fnr og kilde.

## Databasetilgang

[Les mer om databasetilgang i NAIS sin dokumentasjon.](https://doc.nais.io/persistence/postgres/#personal-database-access)
