# Veikart – utvidet omstillingsstønad

Felles oversikt over hva som skal gjøres for søknaden om utvidet (forlenget) omstillingsstønad, og hva som er gjort. Arbeidet går på tvers av tre repoer. Fase 5 (mottak via prosessering) berører i tillegg `efterlatte-prosessering` og `efterlatte-verktoy`.

Agenten, dokumentasjonen og statusskriptet ligger i `pensjon-etterlatte` mens vi bygger søknaden. Når vi går over til behandlingsløpet i Gjenny, flyttes de samlet tilbake til `pensjon-etterlatte-saksbehandling` (B7). Gjennys domenekontekst og agenten `gjenny-ekspert` blir i saksbehandling.

| Fil | Brukes til |
|-----|-----------|
| `veikart.md` (denne) | Hva skal gjøres, i hvilken rekkefølge, og hvor står vi |
| [`beslutninger.md`](beslutninger.md) | Hvorfor ting er løst som de er, og hva som ikke er avklart ennå |
| [`spesifikasjon.md`](spesifikasjon.md) | Hvordan søknaden skal oppføre seg: felt, tekster, validering og kontrakt |
| [`prosessering.md`](prosessering.md) | Teknisk plan for fase 5: mottaket i Gjenny som tasks i `efterlatte-prosessering`, styrt fra `efterlatte-verktoy` |
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

Målbildet i fase 5 er at `NySoeknadRiver` bare sender søknaden videre til `etterlatte-behandling`. Der lagres den og går gjennom fire tasks: knytt til sak, journalfør, opprett oppgave og kvitter til innsendt-soeknad. Se [`prosessering.md`](prosessering.md).

`pe` = pensjon-etterlatte, `sb` = pensjon-etterlatte-saksbehandling, `felles` = pensjon-etterlatte-felles, `lib` = efterlatte-prosessering, `vt` = efterlatte-verktoy

## Aktive brancher

| Repo | Branch | PR | Innhold |
|------|--------|----|---------|
| pe | `utvidet-soknad-struktur-ny-app` | – | Skjelett og grunnmur (3.1) for `apps/utvidet-omstillingsstoenad-ui`. Grunnmuren ligger som lokale endringer, ikke committet. |
| pe | `utvidet-oms-personopplysninger` | – | Steg 2 Personopplysninger (3.3), implementert lokalt. |
| pe | `utvidet-oms-utdannelse` | – | NAV-31514: Steg 4 Utdanning og tiltak (3.5), implementert lokalt. Branchen inneholder også grunnmuren, Personopplysninger og Situasjonen din i dag. PR-status for tidligere frontendarbeid er ikke kontrollert. |
| sb, lib, vt | `utvidet-oms-prosessering-plan` | – | Plan for fase 5 og oppdaterte veikart (5.0). Planbranchene finnes lokalt i alle tre repoene. Merge-status er ikke kontrollert. |
| lib | `utvidet-oms-feilmelding-endringstid` | – | Nav-31931, 5.2: siste feilmelding og endringstid på tasks. Implementert lokalt, uten commit eller PR. |
| pe | `utvidet-oms-feilmelding-endringstid` | – | Oppdaterer veikart og prosesseringsplan for 5.1 og 5.2. Lokale dokumentasjonsendringer, uten commit eller PR. |
| pe | `utvidet-oms-status-repotilgang` | – | Skiller Git-tilgangsfeil fra manglende branch i statusskriptet. Lokale endringer, uten commit. |

Merget: felles `utvidet-omstillingsstoenad-kontrakt` ([#620](https://github.com/navikt/pensjon-etterlatte-felles/pull/620)) gir `common` `2026.10.09-12.12.efc9bddf6546`. Mottaket er merget i pe ([#2531](https://github.com/navikt/pensjon-etterlatte/pull/2531)) og sb ([#8971](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/8971)), og steg 5 Inntekt i [#2558](https://github.com/navikt/pensjon-etterlatte/pull/2558). Planen for fase 5 er merget i pe ([#2596](https://github.com/navikt/pensjon-etterlatte/pull/2596)).

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
| 1.4 | PDF-mal `utvidet_omstillingsstoenad_v1` i ey-pdfgen (mal og testdata) | felles | | ⏳ Malen finnes ikke i felles per 2026-11-10, så journalføringen feiler i dev. |

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
| 3.1 | Grunnmur: stegdefinisjon og ruter, fremdrift, Forrige/Neste/Avbryt, react-hook-form per steg, lagring ved stegbytte, frontendmodell og mapping til kontrakten (testet mot eksempel-JSON fra felles) | | 🚧 implementert lokalt på eksisterende frontendbranch, klart for review. Favro-kort og PR mangler. |
| 3.2 | Steg 1 Introside: sjekk av sak, to varianter, samtykke | NAV-31199 | ✅ [#2550](https://github.com/navikt/pensjon-etterlatte/pull/2550) (oppdatert mot Figma). Nynorsk og engelsk tekst er foreløpig KI-generert og ikke språkvasket. |
| 3.3 | Steg 2 Personopplysninger | | 🚧 implementert lokalt på `utvidet-oms-personopplysninger`; PR mangler. |
| 3.4 | Steg 3 Situasjonen din i dag | | Implementasjonen og testene finnes på `utvidet-oms-utdannelse`. PR-status er ikke kontrollert. |
| 3.5 | Steg 4 Utdanning og tiltak | NAV-31514 | ✅ implementert lokalt på `utvidet-oms-utdannelse`, med validering, kladd, nb/nn/en, kontraktmapping og axe-tester. Ikke committet, ingen PR opprettet. |
| 3.6 | Steg 5 Inntekt | NAV-31515 | ✅ [#2558](https://github.com/navikt/pensjon-etterlatte/pull/2558), med validering, nb/nn/en, enhetstester og responsive Cypress-tester med axe. Ny ingress, feilmeldinger og tegntellertekster på nynorsk og engelsk er foreløpig KI-generert og ikke språkvasket. ReadMore-tekstene er hentet fra OMS. |
| 3.7 | Steg 6 Dokumentasjon (tom side inntil videre) | | ⏳ Å4 |
| 3.8 | Steg 7 Oppsummering og innsending | NAV-31517 | 🚧 Oppsummeringen er merget i [#2573](https://github.com/navikt/pensjon-etterlatte/pull/2573). Innsendingen ([#2583](https://github.com/navikt/pensjon-etterlatte/pull/2583)) ble lukket uten merge. |
| 3.9 | Steg 8 Kvittering etter Figma | | ⏳ |
| 3.10 | Cypress-flyt og axe gjennom hele søknaden | | ⏳ |

### Fase 4 – Ende-til-ende og prod

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 4.1 | Ende-til-ende-test i dev: søknad → journalpost → oppgave i Gjenny | alle | | ⏳ Med togglen for fase 5 på er dette 5.16. |
| 4.2 | Prodklargjøring: feature toggle, prod-nais, inngang fra nav.no | pe | | ⛔ Å9 |

### Fase 5 – Mottak via prosessering

Mottaket i Gjenny flyttes fra den synkrone `NySoeknadRiver` til en kjede av tasks i `etterlatte-behandling` (B8–B11). Kjeden styres fra `efterlatte-verktoy`. Gjelder dev. Detaljer, kodeskisser og risiko står i [`prosessering.md`](prosessering.md).

| # | Arbeidspakke | Repo | Favro | Status |
|---|--------------|------|-------|--------|
| 5.0 | Plan, veikart, beslutninger og pekere i alle fire repoer | pe, sb, lib, vt | | 🚧 Merget i pe ([#2596](https://github.com/navikt/pensjon-etterlatte/pull/2596)). Lokal tilgang til sb, lib og vt er bekreftet. Planbranchene finnes, men merge-status er ikke kontrollert. |
| 5.1 | L1: Stegets JDBC-connection tilgjengelig for vertskode | lib | | ✅ [#53](https://github.com/navikt/efterlatte-prosessering/pull/53), bekreftet i lokal `main`. |
| 5.2 | L2: `siste_feilmelding` og `sist_endret_tid` i biblioteket | lib | [Nav-31931](https://favro.com/organization/98c34fb974ce445eac854de0/a64c6aad9b0d61ef6c0290bd?card=Nav-31931) | 🚧 Implementert lokalt på `utvidet-oms-feilmelding-endringstid`. Ingen commit eller PR. |
| 5.3 | L3: Retry per task-type | lib | | ⏳ |
| 5.4 | L4: Steg kan stoppe med `MANUELL` (valgfri) | lib | | ⏳ Å12 |
| 5.5 | Release av biblioteket | lib | | ⏳ |
| 5.6 | G1: Bump og migrering (nye kolonner og `UNIQUE(type, payload)`) | sb | | ⏳ |
| 5.7 | G2: `StegKontekst`: steg skriver via eksisterende tjenester på stegets transaksjon | sb | | ⏳ |
| 5.8 | G3: Admin-API-et gir feilmelding, metadata og `status-oversikt` | sb | | ⏳ |
| 5.9 | G4: Tabellen `mottatt_soeknad` og DAO | sb | | ⏳ Å10 |
| 5.10 | G5: `POST /api/soeknad/mottak` med outbox | sb | | ⏳ |
| 5.11 | G6: Journalføring i et felles lib, nais og tilgang til pdfgen og dokarkiv | sb, felles | | ⏳ Å11 |
| 5.12 | G7: Task-kjeden T1–T4 | sb | | ⏳ |
| 5.13 | G8: Toggle og ruting i `NySoeknadRiver` | sb | | ⏳ |
| 5.14 | V1: Verktøyet viser nye felt og ekte tellinger | vt | | ⏳ |
| 5.15 | V2: Driftsrutine for søknadsmottaket | vt | | ⏳ |
| 5.16 | Ende-til-ende i dev: feil på T2, rekjør fra verktøyet, fullført kjede | alle | | ⏳ krever 1.4 |

### Avhengigheter

```
1.4 → 2.3 (journalføring feiler uten PDF-mal)
1.2 → ny common-versjon → bump i pe og sb (bare hvis kontrakten endres)
3.1 → 3.2 … 3.9 → 3.10
2.2 → 3.2
1.2 → 3.8 (mapping må treffe endelig kontrakt)
2.1 + 2.3 + 3.8 → 4.1
5.1 + 5.2 + 5.3 → 5.5 → 5.6 → 5.7 → 5.10 → 5.12 → 5.13 → 5.16
5.6 → 5.8 → 5.14 → 5.15 → 5.16
5.9 → 5.10, 5.11 → 5.12
1.4 → 5.16 (T2 feiler uten PDF-mal)
```

---

## Logg

Kort logg over milepæler. Nyeste øverst. Én linje per hendelse, med lenke til PR der det finnes.

- **2026-11-10**: Nav-31931, 5.2 implementert lokalt i lib: siste feilmelding (maks 2 000 tegn fra motoren), endringstid ved alle task-oppdateringer og migreringsveiledning for vertsappene. `mvn verify` bestått i alle fire moduler med JDK 25 og Postgres i Testcontainers (52 tester). Lokal Maven 3.10 krevde eksplisitt minimal settings-fil for å unngå en oppstartsfeil. 5.1 er bekreftet merget via lib [#53](https://github.com/navikt/efterlatte-prosessering/pull/53) i lokal `main`; GitHub-oppslaget feilet på repotilgang. Ingen ny commit, push eller PR.
- **2026-11-10**: 5.1 implementert lokalt i lib på `utvidet-oms-stegtransaksjon`: offentlig `JdbcTransaksjon.connection`, `Transaksjon.jdbcConnection()` og oppdaterte docs. Tester fra en annen pakke viser commit og rollback av forretningsdata og kjeding gjennom motoren. Fem målrettede tester bestått med JDK 25 og Postgres i Testcontainers. Tilgang til alle fire repoene fungerer fra økten i `IdeaProjects`. Ingen commit, push eller PR.
- **2026-11-10**: Bekreftet at planen er merget i pe ([#2596](https://github.com/navikt/pensjon-etterlatte/pull/2596)). 5.1 er ikke startet fordi økten mangler tilgang til `efterlatte-prosessering`. Statusskriptet skiller nå Git-tilgangsfeil fra manglende branch. Endringen ligger lokalt på `utvidet-oms-status-repotilgang`, uten commit eller PR.
- **2026-11-10**: Plan for fase 5, mottak via `efterlatte-prosessering` styrt fra `efterlatte-verktoy` ([`prosessering.md`](prosessering.md), B8–B11, Å10–Å12). Statusene for 0.2, 1.3, 2.1, 2.3, 3.0, 3.2, 3.6 og 3.8 er rettet etter merget PR-er.
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
