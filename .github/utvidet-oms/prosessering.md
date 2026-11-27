# Mottak av utvidet omstillingsstønad i innsendt-soeknad

Teknisk plan for fase 5 i [veikartet](veikart.md). Etter [B12](beslutninger.md#b12--innsendt-soeknad-eier-mottakskjeden) skal `innsendt-soeknad` kjøre mottaket med `efterlatte-prosessering` i sin egen Postgres. Gjenny avgjør sakstilknytning og videre saksbehandling. `efterlatte-verktoy` viser og styrer tasks via appens API.

Planen erstatter fra 2026-11-27 kjeden i `etterlatte-behandling` fra B8–B11. Arbeidspakkenumrene beholdes, men 5.6–5.16 har revidert innhold. Tidligere arbeid og beslutninger er historikk, ikke bevis på at den nye flyten er implementert.

| Kortnavn | Repo og ansvar |
|---|---|
| `pe` | pensjon-etterlatte: innsendt-soeknad, mottaksdata, tasks og journalføring |
| `sb` | pensjon-etterlatte-saksbehandling: Gjennys API og faglige håndtering |
| `felles` | pensjon-etterlatte-felles: søknadskontrakt, PDF-generator og berørte eventkonsumenter |
| `lib` | efterlatte-prosessering: generell motor, JDBC-transaksjon og retry |
| `vt` | efterlatte-verktoy: driftsflate over appenes API-er |

## Valgt omfang

- Først utvidet OMS i dev. BP og vanlig OMS følger dagens Kafka-løp.
- Innsendt-soeknad beholder søknadsinnholdet og mottaksstatusen. Ingen ny kopi av hele søknaden i behandling.
- Gjenny finner eller oppretter sak og oppretter en `TILLEGGSINFORMASJON`-oppgave som i B4. Å3, Å8 og Å12 er ikke avgjort av arkitekturvalget.
- Valget mellom gammel og ny flyt lagres per søknad. En task-feil eller endret toggle flytter aldri en påbegynt søknad til en annen flyt.
- Task-payload er bare `{ soeknadId }`. Metadata kan ha søknadstype og interne referanser, ikke fnr eller søknadsinnhold.
- Dagens håndtering av ugyldig eller manglende fnr må bevares, inkludert journalføring på ukjent uten automatisk oppgave på en sak.
- Varsling og andre eventkonsumenter må kartlegges før ny flyt aktiveres. Ingen integrasjon skal falle bort bare fordi Kafka-kvitteringen fjernes.

## Bekreftet utgangspunkt

Kode og PR-er er gjennomgått 2026-11-27. Kontroller versjoner, brancher og deployment på nytt før implementering.

| Hva | Status og kilde |
|---|---|
| Dagens mottak | `NySoeknadRiver` i behandling-kafka finner/oppretter sak, journalfører og oppretter oppgave for utvidet OMS. B4 gjelder fortsatt. |
| Innsendt-soeknad | Har Postgres, leader election, rapid og Azure client credentials. `Application.kt`, `ApplicationContext.kt`, `DataSourceBuilder.kt` og `.nais/dev.yaml`. Prosessering er ikke koblet inn i den gjennomgåtte kildekoden. |
| Transaksjoner | `PostgresSoeknadRepository` i `SoeknadDao.kt` bruker separate connections. Ferdigstilling og første task er ikke atomiske uten en endring. |
| Sletting | `PubliserTilstandJobb` sletter `innhold` når `ARKIVERT` eller `BEHANDLINGLAGRET` finnes. Ny flyt må vente med slike statuser til den kan fullføres uten innholdet. |
| Gammel republisering | `SELECT_OLD` i `SoeknadDao.kt` undertrykker ny sending når en `SENDT`-hendelse er yngre enn 45 minutter. Jobben sjekker hvert tiende minutt. Dette er ikke en absolutt grense på 45 minutter for alle nye forsøk. |
| PDF for utvidet OMS | PDF-støtte er merget i sb #9045 og felles #640/#641. Utvidet OMS bruker ey-pdfgenrs uten toggle. |
| Åpne PR-er | Felles [#642](https://github.com/navikt/pensjon-etterlatte-felles/pull/642) og sb [#9049](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/9049) var åpne ved kontroll. Utvikleren vil lukke dem. De er ikke forutsetninger for ny plan. |
| Eksisterende Gjenny-prosessering | Skygge/demo og admin-API i behandling beholdes. Ingen av disse flyttes eller fjernes som del av nytt søknadsmottak. |
| Gjenny-grenseflate | Innsendt-soeknad bruker allerede etterlatte-api for sakssjekk. Dagens `har_sak` returnerer bare en boolsk verdi. Journalføringskontekst og idempotent overlevering krever nye kontrakter. |
| Oppgaver | Dagens separate lesing av referanse og opprettelse er ikke en atomisk idempotensgaranti ved samtidige kall. |
| Notifikasjoner | `felles/apps/etterlatte-notifikasjoner/.../Notifikasjon.kt` krever `@event_name=soeknad_innsendt` og `@dokarkivRetur`. Et nytt event-navn alene er ikke kompatibelt. |
| Bibliotek | `1.20261127092401_73059d1` er publisert fra lib-`main` og inneholder 5.1–5.3 (kontrollert mot artefaktene 2026-11-27). |

## Målbilde og ansvarsgrense

```text
UI → node-server → innsendt-soeknad
  én lokal transaksjon:
    søknadsinnhold + FERDIGSTILT + varig flytvalg + første task

innsendt-soeknad, alle task-payloads = { soeknadId }:
  T1 SoeknadHentJournalfoeringskontekst
     → etterlatte-api → behandling: finn/opprett sak etter dagens regler
     ← liten kontrakt med sakId, saktype/tema og journalføringsenhet
  T2 SoeknadJournalfoer
     → ey-pdfgenrs + dokarkiv
     → lagre journalpostreferanser lokalt
  T3 SoeknadOverleverTilGjenny
     → etterlatte-api → behandling: håndter journalført søknad
       én Gjenny-transaksjon: deduplisering + oppgave + lagret resultat
     ← samme resultat ved retry
     én lokal transaksjon: overleveringsresultat + FULLFØRT + ARKIVERT
       nødvendige integrasjonshendelser må være varig sikret før sletting

efterlatte-verktoy → OBO → innsendt-soeknads admin-API → egne task-tabeller
```

Task-navnene er foreslått. Endelige API-stier og DTO-navn avtales i 5.10. Ingen `SoeknadKvitter` tilbake til innsendt-soeknad, ingen `StegKontekst` i behandling og ingen direkte skriving i en annen apps database.

Eksterne kall kan skje flere ganger. Taskens transaksjon gjør bare lokale skriv atomiske. Den gir ingen distribuert transaksjon over HTTP, dokarkiv eller Kafka.

## Implementasjonsstatus 2026-11-27

Implementert lokalt på brancher, uten commit, push eller deployment: pe `utvidet-oms-mottak-prosessering`, sb `utvidet-oms-mottak-innsendt-soeknad`, felles `utvidet-oms-pdfgenrs-innsendt-soeknad` og vt `innsendt-soeknad-prosessering`. Ingenting er verifisert i dev.

**Bibliotek (5.5):** `1.20261127092401_73059d1` er publisert fra lib-`main` (versjonsprefiks `1.`) og inneholder 5.1–5.3. Kildekoden er kontrollert mot artefaktene i GitHub Packages. Versjonen lagrer i tillegg full stacktrace i `prosessering_task_hendelse` ved feil, så unntaksmeldinger må fortsatt holdes fri for fnr. Lokal lib-branch og lib-remote er ikke oppdatert fordi `git fetch` gir 403.

**Gjenny-kontrakt (5.10), via etterlatte-api med rollen `soeknadsmottak`:**

| Sti i etterlatte-api | Inn | Ut | Behandling |
|---|---|---|---|
| `POST /api/soeknad/mottak/journalfoeringskontekst` | `soeknadType`, `foedselsnummer?` | `ukjentBruker`, `sakId?`, `sakType`, `tema`, `journalfoerendeEnhet` | `POST /api/soeknadsmottak/journalfoeringskontekst`: ugyldig/manglende fnr gir ukjent bruker på 4808, ellers `finnEllerOpprettSakMedGrunnlag` som i dag |
| `POST /api/soeknad/mottak/overlevering` | `mottaksnoekkel`, `soeknadType`, `sakId`, `journalpostId`, `dokumentInfoIder` | `mottaksnoekkel`, `sakId`, `journalpostId`, `oppgaveId` | `POST /api/soeknadsmottak/overlevering`: `soeknad_overlevering` (V364) med PK på nøkkelen, skrevet i samme transaksjon som `TILLEGGSINFORMASJON`-oppgaven (kilde `BRUKERDIALOG`, B4-merknad, referanse journalpostId) |

Behandling godtar bare systembruker med `azp_name` lik `etterlatte-api`. `soeknadType` godtar bare `UTVIDET_OMSTILLINGSSTOENAD`; andre verdier gir 400. Samme nøkkel med annet innhold gir 409. Parallelle like kall gir én oppgave: behandling bruker SERIALIZABLE, og taperen kjøres på nytt med eksisterende `withSerializableRetry`. etterlatte-api videreformidler statuskoden, så innsendt-soeknad ser `GjennyAvvisteForespoersel` (4xx) og `GjennyUtilgjengelig` (5xx) som ulike feil.

**Innsendt-soeknad (5.6–5.9, 5.11–5.13):**

- V10 task-skjema, V11 `soeknad.mottaksflyt` (`KAFKA`/`PROSESSERING`, NULL = gammelt løp) med trigger som hindrer endring, og `soeknad_mottak` med fremdrift uten fnr. gcp-V12 gir `cloudsqliamuser` bare lesetilgang.
- `prosessering-core`/`-postgres` brukes direkte, ikke Ktor-pluginen, fordi pluginen ikke lar oss sette samtidighet. Motor: samtidighet 2, batch 5, poll 2 s. Hikari er uendret (standard 10).
- Ferdigstilling skjer i én transaksjon med `FOR UPDATE` på kladden. Prosesseringsløpet legger `soeknad_mottak` og T1 på samme connection. Toggle: Unleash `pensjon-etterlatte.innsendt-soeknad.utvidet-oms-mottak-prosessering`, standard av.
- Hele mottaket er av når `SOEKNAD_MOTTAK_PROSESSERING` ikke er `aktivert` (prod). Da startes verken motor eller admin-API, og alle søknader går til Kafka.
- Kjeden har fire tasks. T4 `SoeknadFullfoerMottak` er lagt til for å skille Gjenny fra Kafka: den publiserer kompatibilitetseventet og setter `ARKIVERT` sammen med `FULLFØRT`.
- Kompatibilitetseventet er `soeknad_innsendt` med `@dokarkivRetur`, `@lagret_soeknad_id`, `@fnr_soeker`, `soeknadFordelt=false`, `sakId` og markøren `@mottaksflyt=PROSESSERING`. `@skjema_info` har bare `type` og innsenders fnr, som er det etterlatte-notifikasjoner leser. Det bevarer dagens SMS-beskjed (varselId er deterministisk per søknad). `NySoeknadRiver` ignorerer eventet fordi `@dokarkivRetur` finnes. `SoeknadSkyggeRiver` reagerer som på dagens returmelding, men klarer ikke å lese det minimale skjemaet og logger en feil når skyggetogglen er på.
- `JournalpostSkrevet` og `BehandlingOpprettetGjenny` ignorerer søknader i prosesseringsløpet, både på markøren og med databaseoppslag. `SELECT_OLD`, `SELECT_OLD_NO_BEHANDLING` og `SLETT_UTGAATTE_KLADDER` utelater dem.
- Ukjent bruker: T2 journalfører uten bruker og sak og uten `forsoekFerdigstill`, og T3 kaller ikke Gjenny (B4).
- Admin-API: hele vt-kontrakten under `/api/prosessering/task` bak egen Azure-provider. Krever `NAVident` og gruppa i `PROSESSERING_ROLLE_GROUPID`.

**Tester:** pe 138 (14 for mottaket, 5 for admin-API), behandling 9, etterlatte-api 1 ny rutetest, vt typecheck, bygg og 23 tester. Se loggen i veikartet.

**Kjente gap:** `checkLicense` feiler lokalt på 78 ktor-/kotlin-moduler som også finnes i det uendrede selvbetjening-backend. Bibliotekets to moduler er lagt i unntakslista på samme måte som rapids-and-rivers. Om CI passerer er ikke kontrollert. Opprydding av `soeknad_mottak`, tasks og operatørlogg etter fullføring (Å10) er ikke implementert. Metrikker (5.15) er ikke laget.

## Arbeidspakker

### 5.0 Dokumentasjon (`pe`, `sb`, `lib`, `vt`)

Oppdater B12, fase 5, denne planen og direkte pekere i de andre repoene. Behold historikk om B8–B11 og de to PR-ene. Dokumentasjonen for mottaket blir i pe. Implementering og deployment i ny app gjenstår.

### 5.1 L1: Stegets connection tilgjengelig for appkode (`lib`)

Behold den generelle støtten med `JdbcTransaksjon.connection` og `jdbcConnection()`. Tidligere bekreftet merget i lib #53. Innsendt-soeknads DAO-er må kunne bruke denne connectionen uten å åpne, lukke, committe eller rulle tilbake motorens transaksjon. Ikke innfør Gjennys trådlokale `Kontekst` her.

### 5.2 L2: Siste feilmelding og siste endring (`lib`)

Nav-31931. Verifiser merge og release av `sisteFeilmelding`, `sistEndretTid` og oppdatert skjema. Motoren skal lagre siste feil og avkorte meldingen som beskrevet i bibliotekets README. Appen holder fnr og søknadsinnhold utenfor feilmeldinger.

### 5.3 L3: Retry per task-type (`lib`)

Verifiser merge og release av `TaskStep.retry`/`RetryPolicy`. Sett eksplisitt policy for alle nye mottakssteg som gjør HTTP-kall. Utgangspunkt i dev: seks forsøk med 30 s, 1 m, 2 m, 4 m og 8 m mellom feil. Skille mellom ugyldig kontrakt og midlertidig utilgjengelighet skal være synlig, ikke skjules som tomme svar.

### 5.4 L4: `MANUELL` fra et steg (`lib`, valgfri)

Bare nødvendig hvis en senere faglig avklaring krever egen manuell stoppårsak. Ikke gjør mottaksflyttingen avhengig av dette. Dagens oppførsel ved manglende sak beholdes inntil Å12 endres.

### 5.5 Release av biblioteket (`lib`)

Finn en publisert versjon med 5.1–5.3 og verifiser artefaktene i GitHub Packages. Publiser bare hvis nødvendige endringer ikke allerede er releaset. Ingen Gjenny-domeneavhengigheter i biblioteket.

### 5.6 P1: Prosessering og skjema i innsendt-soeknad (`pe`)

Erstatter den tidligere Gjenny-bumpen.

- Legg til `prosessering-ktor` og `prosessering-postgres` med verifisert versjon i repoets versjonskatalog.
- Lag nye Flyway-migreringer fra bibliotekets skjema, inkludert `UNIQUE(type, payload)`, feilmelding, endringstid, metadata og operatørlogg. Ikke endre kjørte migreringer.
- Bruk appens eksisterende database og DataSource. Eget skjema er mulig, med eksplisitte grants. Ikke kopier Gjennys migreringsnumre.
- Sett eksplisitt Hikari-pool og lav `maxSamtidighet` med plass til API og jobbene. Utgangspunkt i dev er pool 5 og motor-samtidighet 2, som må vurderes mot lasten.
- Koble motor/reaper til appens Ktor-livssyklus etter migrering, med kontrollert shutdown.
- Toggle av og manglende dev-spesifikk journalføringskonfigurasjon må ikke hindre dagens prod-oppstart.

### 5.7 P2: Atomisk ferdigstilling og varig flytvalg (`pe`)

Erstatter Gjennys `StegKontekst`.

- Gjør repositoryet connection-bevisst. Søknadsinnhold, ferdigstillingsstatus, type/kilde, flytvalg og T1 skal committe eller rulle tilbake sammen for søknaden.
- Lagre mottaksflyt én gang per søknad, for eksempel `KAFKA` eller `PROSESSERING`. Bare utvidet OMS er aktuell for ny flyt.
- Nye søknader velger ny flyt bare når dev-aktivering er på. Eksisterende innsendte søknader tilhører gammelt løp, med mindre de migreres kontrollert i en separat oppgave.
- Hindre duplikatstart med atomisk kontroll og DB-constraint. Ikke fang en UNIQUE-feil og fortsett å skrive i en allerede feilet Postgres-transaksjon.
- Alle task-skriv bruker stegets connection. Bevar kladd, adressebeskyttelse, Min side-utkast og øvrige søknadstyper.

### 5.8 P3: Admin-API i innsendt-soeknad (`pe`)

Erstatter utvidelsen av Gjennys admin-API som krav for dette mottaket.

- Lever eksisterende `vt`-kontrakt for liste, detalj, typer, eksakte tellinger, logg, rekjør, avbryt, kommentar og avvik.
- Bruk Entra ID/OBO og riktig operatørgruppe. Appen må selv validere tilgang. Innbyggertokens og maskintokens skal ikke gi operatørtilgang.
- Bruk optimistisk versjon, bibliotekets statusmaskin og operatørlogg. Eksponer feilmelding, endringstid og metadata uten fødselsnummer.
- Ingen ny felles `prosessering-api`-modul er en forutsetning. Gjenbruk eksisterende mønstre der de passer.

### 5.9 P4: Lokal fremdrift og sletting (`pe`)

Erstatter `mottatt_soeknad` i behandling.

- Bruk eksisterende `innhold` for søknaden. Legg bare til nødvendig fremdrift: flytvalg, journalføringskontekst, journalpost-/dokumentreferanser og overleveringsresultat.
- Bestem konkret lagringsform ut fra repoets mønstre. Unngå en ny kopi av hele søknaden og unngå at personopplysninger kopieres til task-payload.
- Ikke sett `ARKIVERT` eller `BEHANDLINGLAGRET` for ny flyt før Gjenny har bekreftet mottaket og nødvendige integrasjonshendelser er varig sikret. Journalpost kan finnes mens mottaket fortsatt er uferdig.
- La gammel kvitteringsriver ignorere søknader eid av ny flyt, slik at et kompatibilitetsevent ikke utløser tidlig sletting eller `trenger_behandling`.
- Avklar opprydding av den nye konteksten og referansene i Å10. Ferdige tasks må ikke kunne rekjøres med slettet nødvendig innhold. Avbrudd etter journalføring må gi et tydelig avvik og manuell oppfølging, ikke falsk fullføring.

### 5.10 G1: Gjenny-kontrakter og atomisk overlevering (`sb`, eventuelt `felles`)

Erstatter det planlagte mottaket av hele søknaden i behandling.

- Bruk etterlatte-api som grenseflate fra innsendt-soeknad og behandling som eier av faglogikken. API-et skal ikke eie dedupliseringsdata eller gjøre faglige valg.
- Avtal en liten journalføringskontekstkontrakt. Gjenny avgjør riktig sak og enhet. Innsendt-soeknad skal ikke importere `Sak`, `Enheter` eller saksbehandling-common.
- Avtal overlevering med stabil nøkkel, søknadstype, sakId, journalpostId og nødvendige dokumentreferanser. Ikke ta inn hele søknaden uten et dokumentert behov.
- Behandling lagrer nøkkel og resultat i samme transaksjon som oppgaven. Retry, parallelle kall og tapt HTTP-svar skal gi samme oppgave/resultat. Samme nøkkel med annet innhold avvises tydelig.
- Gjenny oppretter oppgavetype, kilde og merknad som i B4. Det nåværende `opprett-jfr-oppgave` er ikke riktig kontrakt: det lager `JOURNALFOERING` med kilde `EESSI`.
- Bruk Azure client credentials, egne smale rettigheter og eksplisitte nettverksregler mellom appene. Ingen brukerkontekst finnes i bakgrunnssteget.
- Bevar B4 ved ugyldig fnr/journalføring på ukjent. Endringer i reglene for manglende OMS-sak krever avklaring av Å12, ikke et valg i innsendt-soeknad.

<a id="511-g6-journalføring-i-behandling-sb-felles"></a>

### 5.11 P5: Journalføring i innsendt-soeknad (`pe`, `felles`)

Erstatter arbeidet i sb #9049 og felles #642 (Nav-32022). Lenkeankeret til gammel 5.11 beholdes for PR-historikken.

- Bruk eksisterende journalføringskode som referanse for PDF, original JSON, titler, tema, enhet, ukjent bruker og dokumentvarianter. Behold dagens eksterne idempotensnøkkel `etterlatte:<saktype>:<soeknadId>`.
- Legg nødvendig implementasjon i innsendt-soeknad med en liten journalføringskontekst, uten avhengighet til Gjennys `Sak`/`Enheter`. Ikke publiser et generelt journalføringsbibliotek eller kopier hele Gjenny-moduler for å løse flyttingen.
- Utvidet OMS bruker `utvidet_omstillingsstoenad_v1` i ey-pdfgenrs uten toggle. Ikke legg inn automatisk fallback eller tilgang til ey-pdfgen uten behov.
- Gi innsendt-soeknad dev-tilgang til PDF-generatoren og dokarkiv, inkludert godkjent Azure-klient hos dokarkiv. Åpne regler hos begge parter.
- Bevar håndtering av `409 Conflict` og eksisterende journalpost. Eksponer feil til motoren, med sikker feilmelding og bevart årsak. Ikke viderefør en `null`-retur som skjuler årsaken til retry.
- Dagens journalføring i behandling-kafka blir stående for gammelt løp og andre søknadstyper. Ingen journalføringsklienter legges til i behandling.

### 5.12 P6: Task-kjeden (`pe`)

- **T1 `SoeknadHentJournalfoeringskontekst`:** Hent kontekst fra Gjenny etter dagens regler, lagre den lokalt og opprett T2 på samme transaksjon. Behandle ukjent søker som egen eksplisitt gren.
- **T2 `SoeknadJournalfoer`:** Bruk eksisterende lagret journalpost hvis den finnes. Ellers generer PDF/original JSON og kall dokarkiv. Lagre referansene og opprett T3 atomisk.
- **T3 `SoeknadOverleverTilGjenny`:** Overlever til Gjennys idempotente mottak. Lagre resultat og sett `ARKIVERT` atomisk med `FULLFØRT` når alle fullføringskrav er møtt. For ukjent søker følges B4 uten oppgave på en sak.
- Hvert steg sjekker at søknaden tilhører ny flyt. Eksterne kall skjer før lokale skriv der det er mulig, men motoren holder fortsatt en connection gjennom steget.
- Tapt svar etter journalføring eller oppgaveopprettelse skal være trygt å prøve igjen. Ingen Kafka-kvittering til innsendt-soeknad.

### 5.13 P7: Ruting og integrasjonskompatibilitet (`pe`, eventuelt `felles`)

Erstatter togglen og videresendingen i `NySoeknadRiver`.

- `PubliserTilstandJobb`, `SoeknadPubliserer` og eventuelle reparasjonsjobber sender bare Kafka-eide søknader til gammelt løp. Nye tasks drives av motoren, ikke av republiseringsjobben.
- En feil i T1–T3 gir retry/`STOPPET`, aldri ny innsending til `NySoeknadRiver`. Toggle av stanser ny tildeling, men skifter ikke eier for eksisterende mottak.
- Kartlegg alle konsumenter av dagens innsendt-/journalføringsmeldinger, særlig notifikasjoner. Bevar nødvendig oppførsel med en eksplisitt eventkontrakt og varig publisering før innhold slettes. Unngå å starte gammel saksbehandling eller kvitteringshåndtering via kompatibilitetsevents.
- Varslingsbehovet for utvidet OMS er fortsatt Å9. Bekreft dagens oppførsel og dokumenter hva som faktisk skal videreføres før aktivering. Nytt varslingsprodukt og prod-lansering er utenfor fasen.

### 5.14 V1: Innsendt-soeknad i dashboardet (`vt`, `pe`)

- Registrer innsendt-soeknad som egen app i `bff/src/prosessering/apper.ts`, med riktig API-variant, URL, namespace og OBO-scope.
- Legg til dev-nettverkstilgang, mock-profil og de nye task-typene. Behold Gjenny som egen app.
- Vis eksakte tellinger, siste feil, endringstid, metadata og operatørlogg fra det nye API-et.
- Verifiser avslag uten riktig rolle, vellykket OBO-kall og rekjøring mot ekte app i dev.

### 5.15 V2: Drift og observerbarhet (`vt`, `pe`, `sb`)

- Beskriv feil i T1, T2 og T3, tapt HTTP-svar, pod-død og avbrudd etter journalføring. Operatøren skal se hvilket system som har ansvar for neste handling.
- Rekjøring skal være idempotent. Avbryt er ikke det samme som at en søknad er ferdig mottatt. Beskriv manuell overlevering og avvik uten å slette spor.
- Mål antall og alder for uferdige mottak, `STOPPET` per type og venting på Gjenny/dokarkiv. Bruk lavkardinalitetsetiketter uten søknads-id/fnr.
- Avtal terskler og ansvar før prod. Kontroller også connection-pool, kjøringstid og siste fullførte mottak i dev.

### 5.16 Ende-til-ende i dev (alle)

1. Verifiser artefaktversjon, migreringer, dev-tilganger og Gjenny-kontrakter. Deploy med ny ruting av.
2. Bekreft at BP, vanlig OMS og eksisterende utvidet OMS følger gammelt løp.
3. Aktiver nye utvidet OMS-søknader. Bekreft én kjede, én journalpost og én oppgave, og deretter lokal `ARKIVERT` og forventet sletting.
4. Fremprovoser PDF-/dokarkiv-feil. Bekreft retry og `STOPPET` med lesbar feil, uten oppgave eller tidlig sletting. Rett årsaken og rekjør fra dashboardet uten SQL.
5. Simuler tapt svar etter ekstern effekt, parallelle overleveringer og restart. Bekreft samme journalpost og oppgave, ikke nye effekter.
6. Slå av ny ruting mens et mottak venter. Bekreft at det forblir i ny flyt, mens senere søknader bruker gammelt løp.
7. Bekreft avvist operatør uten rolle, korrekt OBO, ukjent søker-grenen og avtalt event-/varslingsoppførsel.

**Utgangskriterium:** En ny søknad kan feile, forklares, rekjøres og fullføres fra dashboardet uten SQL, doble effekter, tapt overlevering eller tidlig sletting.

## Avhengigheter og anbefalt rekkefølge

```text
5.1–5.3 → 5.5 → 5.6
5.6 → 5.7 og 5.8
5.7 → 5.9
5.10 + 5.11 + 5.9 → 5.12 → 5.13
5.8 → 5.14
5.12 + 5.13 + 5.14 → 5.15 → 5.16
```

Start med å verifisere bibliotekets release og avtale/teste Gjenny-kontraktene (5.10). Bibliotekoppsett, journalføring/tilganger og API-arbeid kan deretter gjøres hver for seg. Endelig aktivering venter på hele kjeden, kompatibilitet og operatørtilgang.

## Teststrategi

| Nivå | Krav |
|---|---|
| Repository/DB | Commit og rollback av ferdigstilling + flytvalg + T1. Samtidig start gir én kjede. Stegdata, neste task og `FULLFØRT` følger samme transaksjon. |
| Gjenny/DB | Parallelle like overleveringer og tapt svar gir én oppgave og samme resultat. Motstridende innhold avvises. |
| Klienter/steg | PDF-/dokarkiv-feil, 409, retry-policy, ugyldig fnr, manglende sak etter dagens regler og restart mellom ekstern effekt og lokalt skriv. |
| Regresjon | BP/OMS, kladd, adressebeskyttelse, gammel Kafka-flyt, kvitteringsrivers og integrasjonshendelser. |
| Auth/API | Feil token/rolle avvises, OBO-operatør kan rekjøre, maskin-API har avgrensede rettigheter. |
| Dashboard | Eksisterende typecheck/bygg og målrettede adapter-/kontrakttester, deretter ekte dev-kall. |

Bruk repoenes eksisterende testoppsett og dokumenterte kommandoer. Nye migreringer må være kompatible med gammel applikasjonskode. Ikke installér eller oppgrader annen infrastruktur som del av dette arbeidet.

## Utrulling og rollback

Deploy først bakoverkompatible skjema- og API-endringer, deretter ny appkode med ruting av. Merge kan likevel utløse prod-deploy via eksisterende workflows. Konfigurasjon og oppstart skal derfor virke i prod uten at mottaksflyten aktiveres.

Ved feil slås ny tildeling av. Nye søknader kan følge gammelt løp, mens allerede prosessering-eide søknader beholdes og håndteres i sin egen kjede. Ikke rull tilbake til en binær som publiserer slike søknader til Kafka eller sletter dem før overlevering. En sikker rollback-versjon må forstå det lagrede flytvalget. Ellers beholdes kompatibel appkode og den berørte kjeden pauses kontrollert mens feilen rettes.

Dev-tilganger som eventuelt ble deployet fra de gamle PR-branchene må kartlegges og fjernes kontrollert når de er overflødige. Å lukke en PR ruller ikke tilbake en deployment.

## Utenfor omfang

- Automatisk revurdering og nye fagregler (Å3, Å8 og Å12).
- Flytting av BP/vanlig OMS, meldt inn endring eller eksisterende tasks i behandling.
- Prod-aktivering, prod-tilganger, ROS og dashboardets resterende prod-krav.
- Et generelt delt journalføringsbibliotek, en sentral task-database eller et nytt felles admin-rammeverk.
