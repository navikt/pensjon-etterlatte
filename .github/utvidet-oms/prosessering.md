# Mottak av utvidet omstillingsstønad via efterlatte-prosessering

Teknisk plan for fase 5 i [veikartet](veikart.md). Søknaden om utvidet omstillingsstønad skal tas imot som en kjede av små tasks i `etterlatte-behandling`. Hver task er idempotent og kan rekjøres, og vi følger og styrer dem fra utviklerdashboardet `efterlatte-verktoy`. Det synkrone mottaket i `NySoeknadRiver` (B4) blir fallback til kjeden er verifisert i dev.

Beslutningene står i [beslutninger.md](beslutninger.md) som B8–B11. Åpne spørsmål står som Å10–Å12.

| Kortnavn | Repo |
|---|---|
| `lib` | [efterlatte-prosessering](https://github.com/navikt/efterlatte-prosessering): biblioteket (motor, outbox, Postgres) |
| `sb` | pensjon-etterlatte-saksbehandling (Gjenny) |
| `pe` | pensjon-etterlatte |
| `felles` | pensjon-etterlatte-felles |
| `vt` | [efterlatte-verktoy](https://github.com/navikt/efterlatte-verktoy): dashboardet som viser og styrer tasks |

Ekspertagenter: `../efterlatte-prosessering/.github/agents/efterlatte-prosessering-ekspert.md`, `../efterlatte-verktoy/.github/agents/efterlatte-verktoy-ekspert.md` og `../pensjon-etterlatte-saksbehandling/.github/agents/gjenny-ekspert.md`.

## Valgt omfang

- Hele mottakskjeden flyttes til `etterlatte-behandling`: lagre søknaden (outbox), knytt til sak, journalfør, opprett oppgave og kvitter til innsendt-soeknad.
- Biblioteket endres først, slik at steg i Gjenny skriver forretningsdata på stegets egen transaksjon. Da committer skrivet atomisk med `FULLFØRT`.
- Siste steg oppretter en `TILLEGGSINFORMASJON`-oppgave som i B4. Steget byttes til revurdering når Å8 er avklart.
- Planen gjelder dev. Prod er en egen fase (se «Utenfor omfang»).
- Mønsteret er generelt, slik at BP- og OMS-søknader kan flyttes over senere uten ny arkitektur.

## Nåsituasjon (2026-11-10)

| Hva | Status | Kilde |
|---|---|---|
| Mottak av utvidet OMS i Gjenny (B4) | Merget 2026-10-27 | sb [#8971](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8971) |
| innsendt-soeknad tar imot typen | Merget 2026-10-27 | pe [#2531](https://github.com/navikt/pensjon-etterlatte/pull/2531) |
| PDF-mal `utvidet_omstillingsstoenad_v1` (1.4) | Finnes ikke i felles. Journalføringen av utvidet OMS feiler derfor i dev. | `pensjon-etterlatte-felles` main |
| Prosessering i `etterlatte-behandling` | `installProsessering` med `SoeknadMottakSkygge` og `FeilbarDemo` (dev). Admin-API: list, finn, rekjor, avbryt, logg, kommentar og avvik. | `apps/etterlatte-behandling/src/main/kotlin/prosessering/ProsesseringModule.kt` |
| Bibliotekversjon i Gjenny | `1.20260915130553_bb84d63` | `gradle/libs.versions.toml` |
| Ekte outbox i Gjenny | Ikke i main. Bare `opprettIEgenTransaksjon` brukes. WIP-hjelperen `opprettPaaAktivBehandlingstransaksjon` ligger på `origin/kristian/prosessering-poc` (commit `9365a06f4`). | |
| Gjennys `prosessering_task` | V352, V355 (metadata) og V358 (hendelse). Mangler `UNIQUE(type, payload)`, som biblioteket regner som en invariant. Mangler `siste_feilmelding` og `sist_endret_tid`. | `db/migration/V352`, `V355` |
| Feilmelding i biblioteket | 5.2 er implementert lokalt på `utvidet-oms-feilmelding-endringstid` (Nav-31931): `sisteFeilmelding`, `sistEndretTid`, avkorting til 2 000 tegn og oppdatert skjema. Ikke committet eller publisert. | `prosessering-postgres/src/main/resources/schema.sql`, `Task`, `markFeilet` |
| Kjente gap i biblioteket | 5.1 er merget via lib #53, bekreftet i lokal `main`: stegets connection er tilgjengelig for vertskode. Retry gjelder fortsatt hele motoren (3 forsøk med `forsøk × 100 ms`, altså `STOPPET` etter under ett sekund). Et steg kan ikke sette `MANUELL`. | `README.md`, «Kjente gap» |
| `etterlatte-behandling-kafka` | Har ingen database og kan ikke kjøre motoren. `NySoeknadRiver` gjør mottaket synkront: sak, PDF (ey-pdfgen), dokarkiv, oppgave via REST, og publiserer `@dokarkivRetur` og `soeknadFordelt=false`. | `brukerdialog/soeknad/NySoeknadRiver.kt` |
| Kvittering til innsendt-soeknad | `JournalpostSkrevet` krever `@dokarkivRetur` og `@lagret_soeknad_id`, leser `soeknadFordelt` og avviser bare `@event_name=trenger_behandling`. Søknader i status `SENDT` publiseres på nytt hvert 10. minutt i 45 minutter. | pe `apps/innsendt-soeknad/.../JournalpostSkrevet.kt`, `PubliserTilstandJobb.kt` |
| Rapid-produsent i behandling | Finnes (`ApplicationContext.rapid`). | `config/ApplicationContext.kt` |
| Transaksjoner i behandling | Trådlokal `Kontekst` med `DatabaseContext(ds)`. `inTransaction` åpner sin egen connection og tillater ikke nøsting. Jobber setter `Kontekst.set(Context(Self(..), DatabaseContext(ds), sakTilgangDao, null))`. | `Contekst.kt`, `common/DatabaseContext.kt` |
| efterlatte-verktoy | Kjører i dev i `proxy`-modus mot behandling med `apiVariant: "gjenny-logg"`. Tellingene er opptalt fra et vindu på 500 rader. | `bff/src/prosessering/apper.ts` |

## Målbilde

```
utvidet-omstillingsstoenad-ui → node-server → innsendt-soeknad
   └─ rapid: soeknad_innsendt (type UTVIDET_OMSTILLINGSSTOENAD)
        └─ NySoeknadRiver (behandling-kafka)
             ├─ ugyldig fnr → som i dag (journalfør på ukjent)
             ├─ toggle «prosessering-utvidet-oms-mottak» av → som i dag (B4, fallback)
             └─ toggle på → POST /api/soeknad/mottak (behandling, kunSystembruker)
                                └─ inTransaction {                         ← outbox
                                     mottatt_soeknad INSERT (soeknad_id PK)
                                     taskProdusent.opprett(activeTx, SoeknadKnyttTilSak)
                                   }
behandling (prosessering-motor), payload = { soeknadId } i alle steg:
  T1 SoeknadKnyttTilSak      finnEllerOpprettSakMedGrunnlag → mottatt_soeknad.sak_id
  T2 SoeknadJournalfoer      ey-pdfgen + dokarkiv (eksternReferanseId, 409 = finnes) → journalpost
  T3 SoeknadOpprettOppgave   TILLEGGSINFORMASJON (idempotent på referanse=journalpostId)  [→ revurdering ved Å8]
  T4 SoeknadKvitter          rapid: @lagret_soeknad_id + @dokarkivRetur + soeknadFordelt=false + sakId
                                └─ JournalpostSkrevet (innsendt-soeknad) → status ARKIVERT
efterlatte-verktoy: viser, filtrerer, rekjører og avbryter T1–T4 med sisteFeilmelding og metadata
```

Hvert steg skriver DB-endringene sine på stegets egen transaksjon, så de committer sammen med `FULLFØRT` og `opprettNesteTask`. Eksterne kall (PDL, pdfgen, dokarkiv og Kafka) kan skje mer enn én gang og må derfor være idempotente.

## Arbeidspakker

Nummerert som fase 5 i veikartet.

### 5.0 Dokumentasjon (`pe`, `sb`, `lib`, `vt`)

Denne fila, fase 5 i veikartet, B8–B11 og Å10–Å12, kilder i agenten og pekere i de andre repoene. Ferdig når PR-ene er merget.

### 5.1 L1: Stegets connection tilgjengelig for vertskode (`lib`)

Lukker gap 3 i bibliotekets «Kjente gap».

- `prosessering-postgres/.../JdbcTransaksjon.kt`: `internal val connection` blir `val connection`. Behold KDoc-regelen om at verten aldri committer, ruller tilbake eller lukker connectionen.
- Legg til en hjelper i `postgres`: `fun Transaksjon.jdbcConnection(): Connection = (this as? JdbcTransaksjon)?.connection ?: error(...)`.
- Test i `KjedeOgStegTransaksjonTest`: Et steg utenfor pakken skriver en forretningsrad på `kontekst.transaksjon.jdbcConnection()`. Kaster steget, ruller både raden og `FULLFØRT` tilbake. Lykkes det, committer begge.
- Oppdater README («Kjente gap», «Transaksjoner og kjeder») og `03-outbox-api.md`.

### 5.2 L2: Siste feilmelding og siste endring (`lib`)

Favro: [Nav-31931](https://favro.com/organization/98c34fb974ce445eac854de0/a64c6aad9b0d61ef6c0290bd?card=Nav-31931).
Implementert lokalt på `utvidet-oms-feilmelding-endringstid`, uten commit eller PR.

Gjør at en `STOPPET` task forklarer seg selv i verktøyet.

- `schema.sql`: `siste_feilmelding TEXT` og `sist_endret_tid TIMESTAMPTZ NOT NULL DEFAULT now()`.
- `Task`: `sisteFeilmelding: String?` og `sistEndretTid: Instant`.
- `TaskRepository.markFeilet(..., feilmelding: String?)`. Motoren sender `"${e::class.simpleName}: ${e.message}"`, avkortet til 2 000 tegn. Stack trace hører hjemme i loggen. Manglende registrert steg gir også en forklarende feilmelding.
- `PostgresTaskRepository`: Alle UPDATE-er setter `sist_endret_tid = now()`. `markerFullført` og rekjøring nullstiller ikke feilmeldingen, fordi den beskriver siste feil og statusen viser at tasken er ferdig.
- Unntaksmeldinger kan inneholde fnr. Dokumenter at vertene ikke skal legge personopplysninger i unntaksmeldinger. Verktøyet maskerer ikke dette feltet.
- Test i `FeilOgRetryTest`. Vertene trenger en migrering, så skriv det i release-notatet.
- Ved oppgradering må verten legge til begge kolonnene før ny bibliotekversjon tas i bruk. Eksisterende rader får migreringstidspunktet som `sist_endret_tid`. Egne admin-oppdateringer må sette endringstiden og beholde siste feilmelding. Migreringen og API-endringene er beskrevet i bibliotekets README.

### 5.3 L3: Retry per task-type (`lib`)

Lukker gap 1. Bør være på plass før kjeden kjører mot ekte dokarkiv i dev.

- `TaskStep` får `val retry: RetryPolicy? get() = null`, der `null` betyr motorstandard. `data class RetryPolicy(val maxAntallFeil: Int, val backoff: (Int) -> Duration)`.
- `ProcessingEngine.haandterFeil` slår opp policy per steg.
- Gjenny bruker for eksempel 6 forsøk med eksponentiell backoff (30 s, 1 m, 2 m, 4 m, 8 m) for T2 og T4. T1 og T3 bruker standard.
- Test: To typer med ulik policy i samme motor.

### 5.4 L4: `MANUELL` fra et steg (`lib`, valgfri)

Lukker gap 2. Tas bare hvis Å12 lander på at T1 skal stoppe for manuell oppfølging.

- `class StoppForManuellOppfoelging(melding: String) : RuntimeException`. Motoren går rett til `STOPPET/MANUELL` uten nye forsøk og lagrer meldingen som `siste_feilmelding`.

### 5.5 Release av biblioteket (`lib`)

Publiser til GitHub Packages og bump i `sb`.

### 5.6 G1: Bump og migrering (`sb`)

- Ny `prosessering-version` i `gradle/libs.versions.toml`.
- Ny migrering med neste ledige nummer (siste er V358):

  ```sql
  ALTER TABLE public.prosessering_task
      ADD COLUMN IF NOT EXISTS siste_feilmelding TEXT,
      ADD COLUMN IF NOT EXISTS sist_endret_tid TIMESTAMPTZ NOT NULL DEFAULT now();
  ALTER TABLE public.prosessering_task
      ADD CONSTRAINT uq_prosessering_task_type_payload UNIQUE (type, payload);
  ```

- Kjør `SELECT type, payload, count(*) FROM prosessering_task GROUP BY 1, 2 HAVING count(*) > 1` i dev og prod før merge. `SoeknadSkyggeDao` dedupliserer skyggetaskene, og `FeilbarDemo` har tilfeldig `demoId`, så vi forventer ingen treff. Finnes det duplikater, rydd dem i en egen migrering først.

### 5.7 G2: Kontekst for steg (`sb`)

Ny fil `prosessering/StegKontekst.kt` i behandling:

```kotlin
/** DatabaseKontekst bundet til stegets transaksjon. Motoren eier commit og rollback. */
class StegDatabaseKontekst(private val connection: Connection) : DatabaseKontekst {
    override fun activeTx(): Connection = connection
    override fun harIntransaction(): Boolean = true
    override fun <T> inTransaction(block: () -> T): T = block()
}

fun <P : Any, R> TaskKontekst<P>.medBehandlingKontekst(sakTilgangDao: SakTilgangDao, block: () -> R): R {
    Kontekst.set(Context(Self("prosessering:${task.type}"), StegDatabaseKontekst(transaksjon.jdbcConnection()), sakTilgangDao, null))
    try { return block() } finally { Kontekst.remove() }
}
```

- `Kontekst.remove()` må ligge i `finally`. Motoren kjører på `Dispatchers.IO`, og en `Kontekst` som blir liggende igjen lekker til neste task.
- Sjekk at tjenestene stegene bruker (`SakService`, `OppgaveService`) ikke åpner sin egen `DatabaseContext`. Søk etter `DatabaseContext(` utenfor `config/` og jobbene.
- Ta med outbox-hjelperen fra PoC-branchen i samme fil: `taskProdusent.opprett(JdbcTransaksjon(databaseContext().activeTx()), ...)`.
- Test: Et steg skriver via en eksisterende DAO med `inTransaction` og kaster. Både raden og `FULLFØRT` ruller tilbake.

### 5.8 G3: Admin-API-et gir feltene verktøyet mangler (`sb`)

- `ProsesseringAdminDao.tilTask()` mapper `sisteFeilmelding`, `sistEndretTid` og `metadata`. `metadata` finnes allerede som kolonne, men mappes ikke.
- `GET /api/prosessering/task/status-oversikt` med alle fem statuser, også de med `0`. En `STOPPET` søknad skal ikke forsvinne utenfor vinduet på 500 rader.

### 5.9 G4: Tabellen `mottatt_soeknad` (`sb`)

```sql
CREATE TABLE mottatt_soeknad (
    soeknad_id          BIGINT PRIMARY KEY,      -- @lagret_soeknad_id fra innsendt-soeknad
    soeknad_type        TEXT NOT NULL,           -- SoeknadType
    fnr                 TEXT NOT NULL,
    soeknad             JSONB NOT NULL,          -- InnsendtSoeknad (skjema_info)
    template            TEXT NOT NULL,           -- PDF-mal fra eventet
    hendelse_gyldig_til TIMESTAMPTZ,
    sak_id              BIGINT,                  -- settes av T1
    journalpost         JSONB,                   -- OpprettJournalpostResponse, settes av T2
    mottatt_tid         TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

- `MottattSoeknadDao` med `lagreHvisNy(): Boolean` (`ON CONFLICT DO NOTHING`), `hent(soeknadId)`, `settSak` og `settJournalpost`.
- Ingen `GRANT ... TO PUBLIC`. Tabellen har fnr og søknadsinnhold.
- Sletteregel: se Å10.

### 5.10 G5: Mottaksendepunktet (`sb`)

`POST /api/soeknad/mottak` i behandling, `kunSystembruker`. Kroppen er `{ soeknadId, fnrSoeker, soeknadType, template, hendelseGyldigTil, soeknad }`.

- Svar `400` hvis `soeknadType` ikke er `UTVIDET_OMSTILLINGSSTOENAD` (B10).
- Lagre søknaden og opprett T1 i samme transaksjon:

  ```kotlin
  inTransaction {
      if (mottattSoeknadDao.lagreHvisNy(...)) {
          taskProdusent.opprettPaaAktivBehandlingstransaksjon(
              type = SoeknadKnyttTilSak,
              payload = SoeknadPayload(soeknadId),
              metadata = mapOf("soeknadId" to "$soeknadId", "soeknadType" to type.name),
          )
          // 201 Created
      } else {
          // 200 OK: innsendt-soeknad publiserer på nytt hvert 10. minutt, så duplikater er normalt
      }
  }
  ```

- Tester: Rollback gir verken søknad eller task. To like kall gir én søknad og én task.

### 5.11 G6: Journalføring i behandling (`sb`, `felles`)

- Flytt `JournalfoerSoeknadService`, `DokarkivKlient` og `PdfGeneratorKlient` fra `behandling-kafka/brukerdialog/soeknad/{journalfoering,pdf}` til et nytt lib, `libs/etterlatte-soeknad-journalfoering`, som begge appene bruker.
- `etterlatte-behandling/.nais/dev.yaml`: `PDFGEN_URL`, `DOKARKIV_URL`, `DOKARKIV_SCOPE`, `outbound.rules: ey-pdfgen` og `outbound.external: dokarkiv-q2.dev-fss-pub.nais.io`.
- `ey-pdfgen` i felles må få `etterlatte-behandling` i `inbound.rules`. dokarkiv må godta behandlingens Azure-klient (Å11). Dette kan ta lengst tid, så start tidlig.
- `DokarkivKlient` håndterer allerede `409 Conflict` på `eksternReferanseId`. Det er dette som gjør T2 idempotent.

### 5.12 G7: Task-stegene (`sb`)

Ny pakke `prosessering/soeknad/` i behandling. `data class SoeknadPayload(val soeknadId: Long)` og fire `TaskType` som serialiseres med `objectMapper`, som `SoeknadMottakSkygge`. Alle steg kjører i `medBehandlingKontekst { … }` og gjør det trege eksterne kallet før DB-skrivet.

- **T1 `SoeknadKnyttTilSak`:** Hvis `sak_id` mangler, kall `sakService.finnEllerOpprettSakMedGrunnlag(fnr, OMSTILLINGSSTOENAD)` og `settSak`. Opprett T2 med metadata og `sakId`. Sjekk sideeffektene i `finnEllerOpprettSakMedGrunnlag` (PDL, skjerming, enhet, Kafka) og om de tåler å kjøre mer enn én gang.
- **T2 `SoeknadJournalfoer`:** Hvis `journalpost` mangler, kall `journalfoerSoeknadService.opprettJournalpost(soeknadId, sak, soeknad)` og `settJournalpost`. Kast med en tydelig melding hvis svaret er `null`, så tasken prøves på nytt. Opprett T3 med `journalpostId`.
- **T3 `SoeknadOpprettOppgave`:** `when (soeknadType)`. For `UTVIDET_OMSTILLINGSSTOENAD`: Hvis `oppgaveService.hentOppgaverForReferanse(journalpostId)` er tom, kall `opprettOppgave(referanse = journalpostId, sakId, kilde = BRUKERDIALOG, type = TILLEGGSINFORMASJON, merknad = "Søknad om utvidet omstillingsstønad mottatt. Søknaden må behandles manuelt.")`. Opprett T4. Når Å8 er avklart, kommer revurderingen som en ny task-type, så gamle tasks fortsatt kan kjøres.
- **T4 `SoeknadKvitter`:** Publiser på rapid med `key = "$soeknadId"`, `@event_name = "soeknad_journalfoert"`, `@lagret_soeknad_id`, `@dokarkivRetur`, `soeknadFordelt = false`, `sakId`, `@hendelse_gyldig_til` og `@correlation_id`. Et eget event-navn gjør at ingen søknadsriver plukker meldingen. `JournalpostSkrevet` tåler duplikater. Sjekk med grep i `sb` og `pe` at ingen andre rivers krever `@dokarkivRetur` uten event-filter.
- Registrer stegene i `installProsessering` sammen med skygge og demo.
- Tester: Én enhetstest per steg som viser at to kjøringer gir én effekt. Én DB-test for hele kjeden med stub for dokarkiv og pdfgen og en fake `KafkaProdusent`.

### 5.13 G8: Ruting i `NySoeknadRiver` (`sb`)

- Ny toggle `prosessering-utvidet-oms-mottak` i samme stil som `ProsesseringSkyggeToggle`. Standard er av.
- Etter fnr-sjekken: Er typen `UTVIDET_OMSTILLINGSSTOENAD` og togglen på, kall `behandlingKlient.mottaSoeknad(request)` og returner uten å publisere. T4 sender kvitteringen. Ved feil logger vi og returnerer, så innsendt-soeknad prøver igjen om 10 minutter.
- Med togglen av går B4-løpet som i dag.
- `BehandlingClient.mottaSoeknad` kaller `/api/soeknad/mottak` med client credentials, som `opprettSoeknadSkyggeTask`.
- `NySoeknadRiverTest`: Med togglen på kalles mottaket, og riveren verken journalfører, oppretter oppgave eller publiserer.

### 5.14 V1: Feltene vises i verktøyet (`vt`)

- `bff/src/prosessering/gjennyKilde.ts` sender `sisteFeilmelding`, `sistEndretTid` og `metadata` videre når de finnes. I dag fyller den inn `null` og tom map.
- Når G3 leverer `status-oversikt`: ny `apiVariant` (for eksempel `gjenny-tellinger`) med `noyaktigeTall: true`, og `etterlatte-behandling` flyttes dit i `apper.ts`.
- Mock: `typer` for `etterlatte-behandling` får `SoeknadKnyttTilSak`, `SoeknadJournalfoer`, `SoeknadOpprettOppgave` og `SoeknadKvitter`, og én `STOPPET` task med en realistisk feilmelding.
- Sjekk med `npm run typecheck` og `npm run build`.

### 5.15 V2: Driftsrutine for søknadsmottaket (`vt`)

Beskriv kjeden T1–T4 i verktøyets dokumentasjon: hva `STOPPET` betyr per steg, og hva operatøren gjør.

- Rekjør er alltid trygt, fordi stegene er idempotente.
- Bruk avbryt og avvik når søknaden håndteres manuelt.
- Avbryt aldri T4 uten å kvittere manuelt. Ellers blir søknaden stående som `SENDT` i innsendt-soeknad.

### 5.16 Ende-til-ende i dev (alle)

1. Deploy biblioteket, Gjenny (G1–G8) og verktøyet (V1).
2. Slå på `prosessering-utvidet-oms-mottak` i Unleash for dev.
3. Send inn en utvidet OMS-søknad fra `utvidet-omstillingsstoenad-ui` eller testdata.
4. Uten PDF-malen (1.4) skal T2 ende i `STOPPET` med en tydelig feilmelding i verktøyet. Ingen oppgave og ingen kvittering.
5. Lever 1.4 i felles og trykk «Rekjør» på T2. T2, T3 og T4 skal gå til `FULLFØRT`. Oppgaven skal finnes i Gjenny, og søknaden skal ha status `ARKIVERT` i innsendt-soeknad.
6. Send samme event på nytt, eller vent på republiseringen etter 10 minutter. Det skal fortsatt være én `mottatt_soeknad`, én kjede, én journalpost og én oppgave.

**Utgangskriterium:** En søknad som feiler i dev, rettes og fullføres fra verktøyet uten SQL.

## Avhengigheter

```
5.1 L1 ┐
5.2 L2 ┼→ 5.5 release → 5.6 G1 → 5.7 G2 ─┬→ 5.10 G5 → 5.12 G7 → 5.13 G8 → 5.16
5.3 L3 ┘                  │               └────────────→ 5.12 G7
                          └→ 5.8 G3 → 5.14 V1 → 5.15 V2 → 5.16
5.9 G4 → 5.10 G5
5.11 G6 (lib, nais og tilgang, start tidlig) → 5.12 G7
1.4 PDF-mal (felles) → 5.16
5.4 L4 (valgfri, Å12)
```

5.9 og 5.11 kan gjøres parallelt med biblioteksarbeidet.

## Risiko

| Risiko | Tiltak |
|---|---|
| `Kontekst` lekker mellom tasks på IO-poolen | `try/finally { Kontekst.remove() }` og en test |
| En tjeneste åpner egen `DatabaseContext` eller connection i steget, og skrivet blir ikke atomisk | Gå gjennom kallveiene i T1 og T3 (5.7) |
| Steget holder en connection under trege kall til pdfgen og dokarkiv | `maxSamtidighet` er 8. Sjekk Hikari-poolen i behandling. Gjør eksterne kall før DB-skrivet. |
| UNIQUE-migreringen feiler på duplikater | Kjør SQL-sjekken i dev og prod før merge (5.6) |
| Global retry gir `STOPPET` etter under ett sekund når dokarkiv er nede en kort stund | L3. Uten L3 rekjører operatøren manuelt, som er greit i dev. |
| fnr i `siste_feilmelding` | Unntaksmeldinger i stegene skal bare inneholde `soeknadId`, `sakId` og `journalpostId` |
| Dobbel journalføring eller kvittering | `eksternReferanseId` og 409 i dokarkiv. `JournalpostSkrevet` oppdaterer bare status. |
| Republiseringen stopper etter 45 minutter mens T2 står `STOPPET` | Ufarlig. Søknaden ligger i `mottatt_soeknad`, og status `SENDT` i innsendt-soeknad er riktig signal til T4 er kjørt. |
| Skyggekjøringen kjører samtidig | `SoeknadSkyggeRiver` er uavhengig. Vurder å fjerne skyggen for utvidet OMS når G8 er på. |

## Utenfor omfang

- Verktøyets fase 4: tilgangslogging av payload-visning, secure-log-splitt, bekreftelse på skrivehandlinger i prod, ROS og prod-manifest med `nav.no`-tenant.
- Prod-nais for behandling (pdfgen og dokarkiv i prod) og toggle i prod.
- Revurdering i T3 (Å8).
- BP og OMS gjennom samme kjede, og å fjerne det gamle løpet i `NySoeknadRiver`.
- Vedlikeholdsjobber i biblioteket (ledervalg, opprydding av `FULLFØRT`, daglig retry av `STOPPET`) og metrikker.

## Slik bruker du planen i en ny økt

1. Start `copilot` fra `pensjon-etterlatte` og velg agenten `utvidet-oms` med `/agent`.
2. Legg til repoene med `/add-dir ../efterlatte-prosessering`, `/add-dir ../pensjon-etterlatte-saksbehandling` og `/add-dir ../efterlatte-verktoy`.
3. Be for eksempel om «Les .github/utvidet-oms/prosessering.md og ta 5.1». Ta én arbeidspakke per økt og per PR.
4. Når en pakke er ferdig, oppdaterer agenten status i fase 5 i veikartet og legger til en linje i loggen.
