# Veikart – utvidet omstillingsstønad

Felles oversikt over hva som skal gjøres for søknaden om utvidet (forlenget) omstillingsstønad, og hva som er gjort. Arbeidet går på tvers av tre repoer. Fase 5 (mottak via prosessering) berører i tillegg `efterlatte-prosessering` og `efterlatte-verktoy`.

Agenten, dokumentasjonen og statusskriptet ligger i `pensjon-etterlatte`. Etter B12 eier innsendt-soeknad mottakskjeden, så fase 5 blir også dokumentert her. En eventuell senere flytting ved arbeid på behandlingsløpet (B7) vurderes separat. Gjennys domenekontekst og agenten `gjenny-ekspert` blir i saksbehandling.

| Fil | Brukes til |
|-----|-----------|
| `veikart.md` (denne) | Hva skal gjøres, i hvilken rekkefølge, og hvor står vi |
| [`beslutninger.md`](beslutninger.md) | Hvorfor ting er løst som de er, og hva som ikke er avklart ennå |
| [`spesifikasjon.md`](spesifikasjon.md) | Hvordan søknaden skal oppføre seg: felt, tekster, validering og kontrakt |
| [`prosessering.md`](prosessering.md) | Teknisk plan for fase 5: mottaket i innsendt-soeknad som tasks, Gjenny-grenseflate og drift fra efterlatte-verktoy |
| [`../agents/utvidet-oms.md`](../agents/utvidet-oms.md) | Agent som jobber ut fra disse filene og holder dem oppdatert |

**Status ligger i Favro.** Veikartet lenker til kortene og viser milepæler. Status per kort skal ikke vedlikeholdes to steder.

Statusoversikt over branchene: `.github/scripts/utvidet-oms-status.sh [--fetch]`

### Komme i gang
- **I pensjon-etterlatte:** Start `copilot` og velg agenten `utvidet-oms` med `/agent`.
- **Arbeid i felles eller saksbehandling:** Start agenten fra `pensjon-etterlatte`, og kjør `/add-dir ../pensjon-etterlatte-felles` eller `/add-dir ../pensjon-etterlatte-saksbehandling` etter behov.
- **Fase 5 (prosessering):** Legg i tillegg til `/add-dir ../efterlatte-prosessering` og `/add-dir ../efterlatte-verktoy`, og be agenten lese `prosessering.md`.
- Si for eksempel «Hvor står vi?» eller «Ta neste arbeidspakke».

---

## Mål

Brukere som allerede har omstillingsstønad skal kunne søke om å forlenge stønaden i inntil 2 år når de tar utdanning eller deltar i arbeidsrettet tiltak. Søknaden skal fungere som de andre søknadene våre, men bare inneholde det den trenger.

## Flyt på tvers av repoene

```
utvidet-omstillingsstoenad-ui (pe)
  └─ etterlatte-node-server (pe) ─ BFF
       └─ innsendt-soeknad (pe) ─ lagrer kladd/søknad, publiserer soeknad_innsendt
            └─ Kafka-rapid
                 └─ NySoeknadRiver (sb, etterlatte-behandling-kafka)
                      ├─ finner/oppretter OMS-sak
                      ├─ journalfører (PDF fra ey-pdfgen i felles)
                      └─ oppretter oppgave (midlertidig, se B4)
Kontrakt: UtvidetOmstillingsstoenad i pensjon-etterlatte-felles/common
```

Diagrammet over viser dagens mottak. Etter B12 skal innsendt-soeknad eie den nye task-kjeden: hent journalføringskontekst fra Gjenny, journalfør, og overlever den journalførte søknaden til Gjenny. Gjenny avgjør sak og videre behandling, foreløpig en manuell oppgave som i B4. Innsendt-soeknad fullfører mottaket lokalt uten Kafka-kvittering tilbake til seg selv. BP og vanlig OMS følger fortsatt dagens løp. Se [`prosessering.md`](prosessering.md).

`pe` = pensjon-etterlatte, `sb` = pensjon-etterlatte-saksbehandling, `felles` = pensjon-etterlatte-felles, `lib` = efterlatte-prosessering, `vt` = efterlatte-verktoy

## Aktive brancher

| Repo | Branch | PR | Innhold |
|------|--------|----|---------|
| pe | `oppdater-veikt-og-eksponer-ansatt` | – | Legger til ansatt-ingress i dev for utvidet OMS. Lokale endringer, uten commit eller PR. Favro-kort er ikke oppgitt. |
| pe | `utvidet-soknad-struktur-ny-app` | – | Skjelett og grunnmur (3.1) for `apps/utvidet-omstillingsstoenad-ui`. Grunnmuren ligger som lokale endringer, ikke committet. |
| pe | `utvidet-oms-personopplysninger` | – | Steg 2 Personopplysninger (3.3), implementert lokalt. |
| pe | `utvidet-oms-utdannelse` | – | NAV-31514: Steg 4 Utdanning og tiltak (3.5), implementert lokalt. Branchen inneholder også grunnmuren, Personopplysninger og Situasjonen din i dag. PR-status for tidligere frontendarbeid er ikke kontrollert. |
| lib | `utvidet-oms-feilmelding-endringstid` | ikke kontrollert | Nav-31931, 5.2: siste feilmelding og endringstid på tasks. Committet og pushet 2026-11-10, inkludert merge med `main` (`14d4e3f`). Om PR-en er opprettet eller merget, er ikke bekreftet. Se 5.2. |
| lib | `utvidet-oms-retry-per-type` | ikke kontrollert | 5.3: retry per task-type. Committet og pushet til `origin/utvidet-oms-retry-per-type` (`a7dd092`). Release og merge er ikke kontrollert. |
| pe | `utvidet-oms-retry-per-type` | – | Oppdaterer veikart og prosesseringsplan for 5.0, 5.2, 5.3 og 5.11, samt status for PDF-malen. Lokale endringer, uten commit eller PR. |
| sb | `utvidet-oms-felles-journalfoering` | [#9049](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/9049) | Erstattes av B12. Utvikleren vil lukke PR-en; den var fortsatt åpen ved ny kontroll 2026-11-27. Delt bibliotek og klienter i behandling er ikke grunnlaget for ny plan. Tidligere dev-deployment må vurderes separat. PDF-endringene i #9045 beholdes. |
| felles | `utvidet-oms-journalfoering-tilgang` | [#642](https://github.com/navikt/pensjon-etterlatte-felles/pull/642) | Erstattes av B12. Utvikleren vil lukke PR-en; den var fortsatt åpen ved ny kontroll 2026-11-27. Ny PR skal gi innsendt-soeknad nødvendig dev-tilgang, ikke behandling. |
| pe | `utvidet-oms-mottak-prosessering` | – | Fase 5 i innsendt-soeknad (5.6–5.9, 5.11–5.13, dev-manifest) og denne dokumentasjonen. Lokale endringer, uten commit. |
| sb | `utvidet-oms-mottak-innsendt-soeknad` | – | 5.10: kontrakt i saksbehandling-common, ruter i etterlatte-api og behandling, V364. Lokale endringer, uten commit. |
| felles | `utvidet-oms-pdfgenrs-innsendt-soeknad` | – | 5.11: innsendt-soeknad i dev-inbound for ey-pdfgenrs. Lokal endring, uten commit. |
| vt | `innsendt-soeknad-prosessering` | – | 5.14: innsendt-soeknad i `apper.ts`, dev-nettverk og dokumentasjon. Lokale endringer, uten commit. |

Merget: felles `utvidet-omstillingsstoenad-kontrakt` ([#620](https://github.com/navikt/pensjon-etterlatte-felles/pull/620)) gir `common` `2026.10.09-12.12.efc9bddf6546`. Mottaket er merget i pe ([#2531](https://github.com/navikt/pensjon-etterlatte/pull/2531)) og sb ([#8971](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8971)), og steg 5 Inntekt i [#2558](https://github.com/navikt/pensjon-etterlatte/pull/2558). Planen for fase 5 er merget i pe ([#2596](https://github.com/navikt/pensjon-etterlatte/pull/2596)), lib ([#52](https://github.com/navikt/efterlatte-prosessering/pull/52)), vt ([#20](https://github.com/navikt/efterlatte-verktoy/pull/20)) og sb ([#9039](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/9039), bare en peker). Innsendingen er merget i pe ([#2584](https://github.com/navikt/pensjon-etterlatte/pull/2584)). Planoppdateringen for 5.2 er merget i pe ([#2598](https://github.com/navikt/pensjon-etterlatte/pull/2598)), og repotilgangen i statusskriptet i [#2597](https://github.com/navikt/pensjon-etterlatte/pull/2597).

Oppdater tabellen når en branch merges eller en ny startes.

---

## Faser og arbeidspakker

Status: ✅ ferdig · 🚧 pågår · ⏳ ikke startet · ⛔ blokkert (se beslutninger)

### Fase 0 – Oppsett

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 0.1 | Veikart, beslutninger, spesifikasjon, agent og statusskript | sb | – | ✅ [#8974](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8974) |
| 0.2 | Flytte agent, dokumentasjon og statusskript til søknadsrepoet (B7) | pe, sb | | ✅ [#2549](https://github.com/navikt/pensjon-etterlatte/pull/2549), [#8978](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8978) |

### Fase 1 – Kontrakt og PDF

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 1.1 | Kontrakt v1 (`UtvidetOmstillingsstoenad`, `GjenlevendeUtvidetOMS`, `SoeknadType`) | felles | NAV-31301 | ✅ [#620](https://github.com/navikt/pensjon-etterlatte-felles/pull/620) |
| 1.2 | Avklare avvik mellom Figma og kontrakt (Å1, Å2, Å5). Justere kontrakt og eksempler ved behov, og publisere en ny versjon. | felles | | ⏳ |
| 1.3 | Bumpe `common` til `2026.10.09-12.12.efc9bddf6546` i pe og sb | pe, sb | NAV-31200 | ✅ merget med 2.1 og 2.3 |
| 1.4 | PDF-mal `utvidet_omstillingsstoenad_v1` (mal og testdata) | felles | | ✅ [#640](https://github.com/navikt/pensjon-etterlatte-felles/pull/640). Prod-manifest for ey-pdfgenrs er merget i [#641](https://github.com/navikt/pensjon-etterlatte-felles/pull/641). Gjenny bruker pdfgenrs for utvidet OMS uten toggle, merget i sb [#9045](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/9045). |

### Fase 2 – Backend

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 2.1 | innsendt-soeknad tar imot den nye søknadstypen (adressebeskyttelse og fixtures) | pe | NAV-31200 | ✅ [#2531](https://github.com/navikt/pensjon-etterlatte/pull/2531) |
| 2.2 | Mock i node-server for `har-loepende-sak`, person og kladd | pe | | ⏳ |
| 2.3 | Mottak i Gjenny: journalføring og oppgave | sb | NAV-31200 | ✅ [#8971](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8971). Journalføringen krever 1.4. Erstattes av fase 5. |
| 2.4 | Behandlingsløp i Gjenny (revurdering?) | sb | | ⛔ Å8 |

### Fase 3 – Søknaden (`apps/utvidet-omstillingsstoenad-ui`)

Én PR per arbeidspakke. Hver pakke har i18n (nb/nn/en), validering og vitest-tester. Spesifikasjonen er fasit for felt, tekster og regler.

| # | Arbeidspakke | Favro | Status |
|---|--------------|-------|--------|
| 3.0 | Skjelett for appen: forside, kvittering, kladd, i18n, nais dev og workflow | NAV-31459 | ✅ [#2540](https://github.com/navikt/pensjon-etterlatte/pull/2540) |
| 3.0a | Ansatt-ingress i dev | | ✅ lagt til lokalt på `oppdater-veikt-og-eksponer-ansatt`. Deploy gjenstår. |
| 3.1 | Grunnmur: stegdefinisjon og ruter, fremdrift, Forrige/Neste/Avbryt, react-hook-form per steg, lagring ved stegbytte, frontendmodell og mapping til kontrakten (testet mot eksempel-JSON fra felles) | | 🚧 implementert lokalt på eksisterende frontendbranch, klart for review. Favro-kort og PR mangler. |
| 3.2 | Steg 1 Introside: sjekk av sak, to varianter, samtykke | NAV-31199 | ✅ [#2550](https://github.com/navikt/pensjon-etterlatte/pull/2550) (oppdatert mot Figma). Nynorsk og engelsk tekst er foreløpig KI-generert og ikke språkvasket. |
| 3.3 | Steg 2 Personopplysninger | | 🚧 implementert lokalt på `utvidet-oms-personopplysninger`; PR mangler. |
| 3.4 | Steg 3 Situasjonen din i dag | | Implementasjonen og testene finnes på `utvidet-oms-utdannelse`. PR-status er ikke kontrollert. |
| 3.5 | Steg 4 Utdanning og tiltak | NAV-31514 | ✅ implementert lokalt på `utvidet-oms-utdannelse`, med validering, kladd, nb/nn/en, kontraktmapping og axe-tester. Ikke committet, ingen PR opprettet. |
| 3.6 | Steg 5 Inntekt | NAV-31515 | ✅ [#2558](https://github.com/navikt/pensjon-etterlatte/pull/2558), med validering, nb/nn/en, enhetstester og responsive Cypress-tester med axe. Ny ingress, feilmeldinger og tegntellertekster på nynorsk og engelsk er foreløpig KI-generert og ikke språkvasket. ReadMore-tekstene er hentet fra OMS. |
| 3.7 | Steg 6 Dokumentasjon (tom side inntil videre) | | ⏳ Å4 |
| 3.8 | Steg 7 Oppsummering og innsending | NAV-31517, NAV-31904 | ✅ Oppsummeringen er merget i [#2573](https://github.com/navikt/pensjon-etterlatte/pull/2573), og innsendingen i [#2584](https://github.com/navikt/pensjon-etterlatte/pull/2584), med lasting, feilhåndtering og navigasjon til kvittering. |
| 3.9 | Steg 8 Kvittering etter Figma | | ⏳ |
| 3.10 | Cypress-flyt og axe gjennom hele søknaden | | ⏳ |

### Fase 4 – Ende-til-ende og prod

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 4.1 | Ende-til-ende-test i dev: søknad → journalpost → oppgave i Gjenny | alle | | ⏳ Med togglen for fase 5 på er dette 5.16. |
| 4.2 | Prodklargjøring: feature toggle, prod-nais, inngang fra nav.no | pe | | ⛔ Å9 |

### Fase 5 – Mottak via prosessering

Innsendt-soeknad kjører mottakskjeden med prosessering i sin egen database (B12). Gjenny eier avgjørelsene om sak, oppgave og behandling. Kjeden styres fra `efterlatte-verktoy`. Gjelder først utvidet OMS i dev.

B12 erstatter plasseringen fra B8–B11 og planen bak sb #9049/felles #642. Numrene 5.0–5.16 beholdes, men 5.6–5.16 er revidert. Tidligere gjennomført arbeid i behandling betyr ikke at den nye flyten er implementert. Detaljer, avhengigheter, testkrav og rollback står i [`prosessering.md`](prosessering.md).

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 5.0 | Plan, veikart, beslutninger og pekere i alle fire repoer | pe, sb, lib, vt | | 🚧 B12 og ny plan er oppdatert lokalt 2026-11-27, ikke committet. Opprinnelig plan er merget via pe #2596, lib #52, vt #20 og sb #9039. |
| 5.1 | L1: Stegets JDBC-connection tilgjengelig for vertskode | lib | | ✅ [#53](https://github.com/navikt/efterlatte-prosessering/pull/53), bekreftet i lokal `main`. |
| 5.2 | L2: `siste_feilmelding` og `sist_endret_tid` i biblioteket | lib | [Nav-31931](https://favro.com/organization/98c34fb974ce445eac854de0/a64c6aad9b0d61ef6c0290bd?card=Nav-31931) | ✅ Med i publisert `1.20261127092401_73059d1` fra lib-`main`, kontrollert mot artefaktene 2026-11-27. PR-nummer er ikke kontrollert (lib-remote gir 403). |
| 5.3 | L3: Retry per task-type | lib | mangler | ✅ `RetryPolicy`/`TaskStep.retry` er med i `1.20261127092401_73059d1`. PR-nummer er ikke kontrollert. |
| 5.4 | L4: Steg kan stoppe med `MANUELL` (valgfri) | lib | | ⏳ Å12 |
| 5.5 | Release av biblioteket | lib | | ✅ `1.20261127092401_73059d1` (publisert 2026-11-27 fra `main`). Ingen ny release trengs. |
| 5.6 | P1: Bibliotek, task-skjema og motor i innsendt-soeknad | pe | | 🚧 Implementert lokalt (V10–V12, motor med samtidighet 2). Ikke deployet. CI-tilgang til lib-pakkene er ikke kontrollert. |
| 5.7 | P2: Atomisk ferdigstilling, første task og varig valg av mottaksflyt | pe | | 🚧 Implementert lokalt med tester for rollback, samtidig start og uforanderlig flytvalg. |
| 5.8 | P3: Admin-API med OBO, rolle, tellinger, feil og operatørlogg | pe | | 🚧 Implementert lokalt med tester for rolle, maskintoken, tellinger, paginering og versjonskonflikt. Ekte OBO er ikke prøvd. |
| 5.9 | P4: Lokal fremdrift, journalpostreferanser og sikker sletting | pe | | 🚧 `soeknad_mottak` og sletteskjerming implementert lokalt. Opprydding etter fullføring venter på Å10. |
| 5.10 | G1: Journalføringskontekst og idempotent overlevering via Gjennys API | sb, ev. felles | | 🚧 Implementert lokalt i etterlatte-api og behandling (V364), med tester for retry, parallelle kall, motstridende innhold og rollback. Ikke deployet. |
| 5.11 | P5: Journalføring i innsendt-soeknad og dev-tilganger | pe, felles | [Nav-32022](https://favro.com/organization/98c34fb974ce445eac854de0/a64c6aad9b0d61ef6c0290bd?card=Nav-32022) | 🚧 Klienter og dev-manifest lokalt i pe; ey-pdfgenrs-inbound lokalt i felles. ⛔ Dokarkiv må pre-autorisere innsendt-soeknad (Å11). |
| 5.12 | P6: T1 hent kontekst, T2 journalfør, T3 overlever og fullfør lokalt | pe | | 🚧 Implementert lokalt som fire tasks (T4 publiserer kompatibilitetsevent og arkiverer). Testet mot mocket Gjenny, dokarkiv og ey-pdfgenrs. |
| 5.13 | P7: Ruting per søknad, gammel Kafka-flyt og eventkompatibilitet | pe, ev. felles | | 🚧 Implementert lokalt. Kompatibilitetseventet bevarer dagens varsel. ⛔ Å9 må bekrefte at varslingen skal videreføres før aktivering. |
| 5.14 | V1: Innsendt-soeknad som egen app i dashboardet | vt, pe | | 🚧 Registrert lokalt (`kontrakt`, mock, dev-nettverk). Ikke deployet eller prøvd mot ekte app. |
| 5.15 | V2: Driftsrutine, feiloppfølging og observerbarhet | vt, pe, sb | | ⏳ Feilmeldinger skiller system, men metrikker og driftsrutine mangler. |
| 5.16 | Ende-til-ende i dev, inkludert retry, tapt svar og toggle av under kjøring | alle | | ⏳ Krever deployment, dokarkiv-tilgang og Å9. |

### Avhengigheter

```
1.4 → 2.3 (journalføring feiler uten PDF-mal)
1.2 → ny common-versjon → bump i pe og sb (bare hvis kontrakten endres)
3.1 → 3.2 … 3.9 → 3.10
2.2 → 3.2
1.2 → 3.8 (mapping må treffe endelig kontrakt)
2.1 + 2.3 + 3.8 → 4.1
5.1 + 5.2 + 5.3 → 5.5 → 5.6
5.6 → 5.7 → 5.9
5.9 + 5.10 + 5.11 → 5.12 → 5.13
5.6 → 5.8 → 5.14
5.12 + 5.13 + 5.14 → 5.15 → 5.16
1.4 → 5.16 (T2 feiler uten PDF-mal)
```

---

## Logg

Kort logg over milepæler. Nyeste øverst. Én linje per hendelse, med lenke til PR der det finnes.

- **2026-11-27**: Fase 5 implementert lokalt etter B12, uten commit, push eller deployment. Lib `1.20261127092401_73059d1` er bekreftet publisert fra `main` med 5.1–5.3 (5.5). pe: task-skjema, motor, atomisk ferdigstilling med varig `mottaksflyt`, `soeknad_mottak`, T1–T4, journalføring mot dokarkiv og ey-pdfgenrs, kompatibilitetsevent for varsling, skjerming av gamle rivers og slettejobber, admin-API og dev-manifest. sb: kontekst- og overleveringsendepunkt i etterlatte-api (rolle `soeknadsmottak`) og behandling (V364). felles: ey-pdfgenrs-inbound. vt: app-registrering. Tester: innsendt-soeknad 138 (19 nye), behandling 9 nye, etterlatte-api grønn, vt typecheck/bygg/23 tester. Lokal `checkLicense` i pe feiler på moduler som også finnes i uendrede prosjekter. Sb #9049 og felles #642 er fortsatt åpne og ikke endret.
- **2026-11-27**: B12 legger mottakskjeden i innsendt-soeknad, med journalføring der og idempotent faglig håndtering i Gjenny. Fase 5 og pekere er revidert lokalt. Utvikleren vil lukke sb #9049 og felles #642, som fortsatt var åpne ved kontroll. Ingen applikasjonskode, PR-status eller deployment er endret i denne oppdateringen. Eldre logglinjer beskriver den erstattede planen.
- **2026-11-13**: Legger til `https://etterlatte.ansatt.dev.nav.no/utvidet-omstillingsstonad/soknad` i dev-manifestet. Intern ingress og ID-porten er uendret, og ekstern ingress er fortsatt deaktivert. Ingen commit eller PR.
- **2026-11-13**: Nav-32022, 5.11: sb `4fc07d911` og felles `ee186e90` er pushet og deployet til dev. Utvikleren melder at prøvesøknaden kl. 10.38 ser ut til å ha gått bra gjennom dagens mottak. Dette bekrefter ikke dokarkiv-tilgangen fra behandling (Å11). PDF-støtten er allerede merget i sb #9045 og felles #640; prod-manifestet i felles #641. PR-tekster for 5.11 er klargjort, men PR-ene er ikke opprettet. Merge vil trigge prod-deploy av Gjenny-appene og PDF-generatorene, uten å aktivere task-kjeden.
- **2026-11-13**: 5.11 implementert lokalt i sb og felles: `etterlatte-soeknad-journalfoering` deles av behandling og Kafka-appen, med lazy klienter og service i behandling. Dev-konfigurasjonen gir nettverkstilgang til dokarkiv, ey-pdfgen og ey-pdfgenrs. Eksisterende mottak og ny PDF-støtte er beholdt. Bibliotekbygg, kompilering av behandling og 16 regresjonstester i Kafka-appen samt 4 dokarkiv-tester er bestått. 5.3 er bekreftet committet og pushet, og PDF-malene finnes på lokal branch. Release-/PR-status kan ikke kontrolleres fordi GitHub-tilgangen er blokkert. Ingen commit, push eller PR for 5.11; dokarkiv-tilgang og deployment gjenstår (Å11).
- **2026-11-12**: 5.3 implementert lokalt i lib på `utvidet-oms-retry-per-type`, som bygger på 5.2: `RetryPolicy(maxAntallFeil, backoff)`, `TaskStep.retry` med motorens standard som fallback, og en test med to task-typer og ett steg uten policy i samme motor. En tidsavhengig 5.2-test (JVM-klokke mot Postgres-klokke) er rettet. `mvn verify` er grønn tre ganger på rad med JDK 25 og Testcontainers (59 tester). Statusen er kontrollert: 5.0 er merget i alle fire repoene, og #2584, #2597 og #2598 er merget i pe. Merge-status for 5.2 i lib er ikke bekreftet, fordi lib-remote gir 403. Ingen commit, push eller PR. Favro-kort for 5.3 mangler.
- **2026-11-11**: Merger main inn i `send-inn-soeknad` ([#2584](https://github.com/navikt/pensjon-etterlatte/pull/2584), NAV-31904). Beholder innsendingen og de nyere planavklaringene fra main. Oppdaterer 3.8 og aktiv branch med riktig kort og PR.
- **2026-11-10**: Nav-31931, 5.2 implementert lokalt i lib: siste feilmelding (maks 2 000 tegn fra motoren), endringstid ved alle task-oppdateringer og migreringsveiledning for vertsappene. `mvn verify` bestått i alle fire moduler med JDK 25 og Postgres i Testcontainers (52 tester). Lokal Maven 3.10 krevde eksplisitt minimal settings-fil for å unngå en oppstartsfeil. 5.1 er bekreftet merget via lib [#53](https://github.com/navikt/efterlatte-prosessering/pull/53) i lokal `main`; GitHub-oppslaget feilet på repotilgang. Ingen ny commit, push eller PR.
- **2026-11-10**: 5.1 implementert lokalt i lib på `utvidet-oms-stegtransaksjon`: offentlig `JdbcTransaksjon.connection`, `Transaksjon.jdbcConnection()` og oppdaterte docs. Tester fra en annen pakke viser commit og rollback av forretningsdata og kjeding gjennom motoren. Fem målrettede tester bestått med JDK 25 og Postgres i Testcontainers. Tilgang til alle fire repoene fungerer fra økten i `IdeaProjects`. Ingen commit, push eller PR.
- **2026-11-10**: Bekreftet at planen er merget i pe ([#2596](https://github.com/navikt/pensjon-etterlatte/pull/2596)). 5.1 er ikke startet fordi økten mangler tilgang til `efterlatte-prosessering`. Statusskriptet skiller nå Git-tilgangsfeil fra manglende branch. Endringen ligger lokalt på `utvidet-oms-status-repotilgang`, uten commit eller PR.
- **2026-11-10**: Plan for fase 5, mottak via `efterlatte-prosessering` styrt fra `efterlatte-verktoy` ([`prosessering.md`](prosessering.md), B8–B11, Å10–Å12). Statusene for 0.2, 1.3, 2.1, 2.3, 3.0, 3.2, 3.6 og 3.8 er rettet etter merget PR-er.
- **2026-11-03**: Steg 7 (3.8): «Send søknad» koblet til eksisterende kontraktmapping og API. Hindrer doble klikk under innsending, beholder svar ved feil og åpner kvitteringen før søknadsstate nullstilles. Knappetekst og feilmelding på nb/nn/en, med tester for innsending, feil, navigasjon og axe. Videreføres på `send-inn-soeknad` i [#2584](https://github.com/navikt/pensjon-etterlatte/pull/2584).
- **2026-10-27**: NAV-31515, gjennomgang av [#2558](https://github.com/navikt/pensjon-etterlatte/pull/2558): tegntellere på nb/nn/en, navigasjon fra steglisten og én felles rutedefinisjon for appen og rutetestene. Alle skjemasteg bruker stor, sentrert overskrift som i Figma. Inntektssteget bruker Aksel-komponenter og feltbredder som i eksisterende skjemaer, uten egen CSS. Felles sidestørrelse, topptekst og navigasjonsavstander er uendret. Cypress sjekker responsiv oppførsel uten faste pikselmål eller automatiske skjermbilder.
- **2026-10-26**: NAV-31515, steg 5 Inntekt (3.6), med nb/nn/en, beløpsvalidering, ReadMore og fjerning av skjulte svar. [#2558](https://github.com/navikt/pensjon-etterlatte/pull/2558).
- **2026-10-26**: Steg 4 Utdanning og tiltak (3.5, NAV-31514) implementert lokalt på `utvidet-oms-utdannelse`. Betingede felt fjernes fra kladd og kontrakt, datoer valideres før ISO-mapping, og advarsler blokkerer ikke. Aktivitetsplan vises bare ved tiltak etter stegspesifikasjonen; Å1 er fortsatt åpent. Ingen commit eller PR.
- **2026-10-22**: Steg 2 Personopplysninger (3.3) implementert lokalt på `utvidet-oms-personopplysninger`, med responsiv visning av brukeropplysninger og lenke til Folkeregisteret. PR mangler.
- **2026-10-22**: Førstesiden (3.2) er på plass på branch og oppdatert mot Figma (ingress, informasjonsseksjoner, samtykke og startknapp). Nynorsk og engelsk tekst er foreløpig KI-generert og ikke språkvasket.
- **2026-10-21**: Flytter agent, veikart, beslutninger, spesifikasjon og statusskript fra saksbehandling til `pensjon-etterlatte` mens vi bygger søknaden (B7). Oppdaterer lenker og legger igjen en peker i Gjenny. PR-er klargjøres.
- **2026-10-20** – Grunnmur (3.1) implementert lokalt på `utvidet-soknad-struktur-ny-app`: seks stegruter, RHF, fremdrift, navigasjon, kladd og kontraktmapping. Stegene er foreløpig plassholdere uten innsending. Testet mot alle tre eksempel-JSON-ene fra felles. Ingen commit eller PR ennå. Å1, Å2 og Å5 er ikke lukket.
- **2026-10-20** – Veikart, beslutninger, spesifikasjon og agenten `utvidet-oms` opprettet i saksbehandling.
- **2026-10** – PR-er åpnet for mottak: pe [#2531](https://github.com/navikt/pensjon-etterlatte/pull/2531) og sb [#8971](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8971). Skjelett for ny app på branch i pe.
- **2026-10-09** – Kontrakt v1 merget i felles ([#620](https://github.com/navikt/pensjon-etterlatte-felles/pull/620)).
