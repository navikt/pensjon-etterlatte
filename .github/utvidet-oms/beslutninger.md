# Beslutninger – utvidet omstillingsstønad

Logg over hvorfor ting er løst som de er. Når et åpent spørsmål (Å) er avklart, flyttes det til «Besluttet» med neste B-nummer. Skriv også hvem som avklarte det og når. Numrene gjenbrukes ikke.

Format:

```
### Bn – Kort tittel
- **Beslutning:** hva vi gjør
- **Hvorfor:** begrunnelse
- **Konsekvens:** hva dette påvirker (repo/arbeidspakke)
- **Avklart:** dato, hvem/hvor
```

---

## Besluttet

### B1 – Egen frontend-app for søknaden
- **Beslutning:** Søknaden bygges som en ny app, `apps/utvidet-omstillingsstoenad-ui` i pensjon-etterlatte. Den blir ikke en ny flyt i `omstillingsstoenad-ui`.
- **Hvorfor:** Søknaden er mye mindre enn OMS-søknaden og har andre spørsmål. En egen app gir bare det den trenger og gjør det enklere å endre uten å påvirke OMS-søknaden.
- **Konsekvens:** Noen komponenter (RHF-komponenter, inntekt og oppsummering) må kopieres fra `omstillingsstoenad-ui`, fordi det ikke finnes et delt bibliotek. Kopier bare det som trengs.
- **Avklart:** 2026-10, teamet

### B2 – Søknaden inneholder bare søker
- **Beslutning:** Kontrakten har bare `soeker` (`GjenlevendeUtvidetOMS`) og innsender, ikke avdød eller barn.
- **Hvorfor:** Bruker har allerede en OMS-sak der persongalleriet er etablert.
- **Konsekvens:** Gjenny kan ikke lage persongalleri eller opplysninger fra søknaden. Behandlingen må bygge på eksisterende sak og behandling.
- **Avklart:** 2026-10, kontrakt i felles

### B3 – Advarsler blokkerer ikke innsending
- **Beslutning:** Ny samboer med felles barn eller tidligere ekteskap, giftet på nytt, studier under 50 % og verken utdanning eller tiltak gir en advarsel. Bruker kan likevel gå videre og sende inn.
- **Hvorfor:** Det er saksbehandler som avgjør retten til stønad. Vi skal informere, ikke stoppe.
- **Konsekvens:** Advarsler er ikke valideringsfeil og skal ikke hindre `Neste steg`.
- **Avklart:** 2026-10, Figma-notater

### B4 – Midlertidig mottak i Gjenny: journalføring og oppgave
- **Beslutning:** `NySoeknadRiver` finner eller oppretter en OMS-sak og journalfører med tittelen «Søknad om utvidet omstillingsstønad». Deretter oppretter den en `TILLEGGSINFORMASJON`-oppgave og svarer `soeknadFordelt = false`, slik at det ikke opprettes behandling.
- **Hvorfor:** Behandlingsløpet er ikke avklart (Å8). Vi vil kunne ta imot søknader uten å låse oss til en løsning.
- **Konsekvens:** Saksbehandler følger opp manuelt. Dette erstattes når Å8 er avklart.
- **Avklart:** 2026-10, branch `nav-31200-ta-imot-soknad-utvidet-oms`

### B5 – Veikartet ligger i saksbehandling, status ligger i Favro

Plasseringen er erstattet av B7 fra 2026-10-21. Favro er fortsatt fasit for status.

- **Beslutning:** Veikart, beslutninger, spesifikasjon og agent ligger i `pensjon-etterlatte-saksbehandling/.github/`. Favro er fasit for status, og veikartet lenker til kortene.
- **Hvorfor:** Repoet har allerede agentoppsett og domenekontekst. Status som vedlikeholdes to steder blir fort utdatert.
- **Konsekvens:** I de andre repoene laster man inn agenten med `/add-dir ../pensjon-etterlatte-saksbehandling`. Endringer i veikartet går til main via PR.
- **Avklart:** 2026-10-20

### B6 – Tekster og regler i spesifikasjonen er fasit
- **Beslutning:** `spesifikasjon.md` beskriver felt, tekster, når felt vises, validering og kontraktfelt per steg. Den oppdateres før koden når Figma endres.
- **Hvorfor:** Figma er ikke tilgjengelig for agenten, og skjermbilder sier ikke noe om validering eller kontrakt.
- **Avklart:** 2026-10-20

### B7 – Agent og dokumentasjon følger repoet vi jobber i

B12 presiserer at mottaksarbeidet i fase 5 blir i pensjon-etterlatte. En eventuell senere flytting ved arbeid på selve behandlingsløpet vurderes separat.

- **Beslutning:** Agenten `utvidet-oms`, veikartet, beslutningene, spesifikasjonen og statusskriptet ligger i `pensjon-etterlatte/.github/` mens vi bygger søknaden. Når arbeidet går over til behandlingsløpet i Gjenny, flyttes de samlet tilbake til `pensjon-etterlatte-saksbehandling`.
- **Hvorfor:** Agenten og dokumentasjonen skal ligge i repoet der det aktive arbeidet skjer, ikke kreve at vi starter i saksbehandling for å jobbe med søknaden.
- **Konsekvens:** Dokumentasjonsendringer går til main i `pensjon-etterlatte` via PR. Gjennys domenekontekst og agenten `gjenny-ekspert` blir i saksbehandling. Ved tilbakeflytting oppdateres hjemrepo, stier, lenker og statusskript. Status vedlikeholdes fortsatt i Favro.
- **Avklart:** 2026-10-21, etter ønske fra utvikleren

### B8 – Mottaket går gjennom prosessering i `etterlatte-behandling`

Erstattet av B12 den 2026-11-27. Begrunnelsen nedenfor sammenlignet bare behandling med Kafka-appen. `innsendt-soeknad` har også egen database.

- **Beslutning:** Mottaket av utvidet OMS flyttes fra den synkrone `NySoeknadRiver` til en kjede av tasks i `etterlatte-behandling`: knytt til sak, journalfør, opprett oppgave og kvitter til innsendt-soeknad. Riveren sender bare søknaden videre når togglen `prosessering-utvidet-oms-mottak` er på. Med togglen av går B4-løpet som før.
- **Hvorfor:** Hvert steg blir idempotent, kan rekjøres og vises i `efterlatte-verktoy`, i stedet for å feile skjult i en Kafka-retry. Motoren trenger en database for outbox, og den har bare behandling. `etterlatte-behandling-kafka` har ingen.
- **Konsekvens:** Journalføringen (pdfgen og dokarkiv) må kunne kjøre fra behandling. Fase 5 i veikartet og [`prosessering.md`](prosessering.md). Gjelder dev til prod-fasen er planlagt.
- **Avklart:** 2026-11-10, utvikleren

### B9 – Steg i Gjenny skriver på stegets egen transaksjon

Gjenny-koblingen erstattes av B12 for søknadsmottaket. Prinsippet om samme transaksjon for lokale data og task-status gjelder fortsatt. Biblioteksstøtten fra 5.1 beholdes.

- **Beslutning:** `efterlatte-prosessering` gjør stegets JDBC-connection tilgjengelig for vertskode. Gjenny pakker den i en `DatabaseKontekst` og setter `Kontekst` mens steget kjører, slik at eksisterende tjenester med `inTransaction { … }` skriver på stegets transaksjon.
- **Hvorfor:** Forretningsskriv og `FULLFØRT` committer da sammen, og et retry gir ikke doble rader. Vi slipper å skrive om tjenestene.
- **Konsekvens:** Biblioteksendring først (5.1). `Kontekst` må fjernes i `finally`, ellers lekker den mellom tasks.
- **Avklart:** 2026-11-10, utvikleren

### B10 – Generisk mottak, avgjørelse per søknadstype

Plasseringen av mottaksdata og API erstattes av B12. Avgrensningen til utvidet OMS beholdes. BP og vanlig OMS flyttes ikke nå.

- **Beslutning:** Tabellen `mottatt_soeknad`, endepunktet `/api/soeknad/mottak` og task-typene `Soeknad*` er felles for alle søknadstyper. Bare steget som oppretter oppgave eller behandling (T3) skiller mellom typene. Foreløpig godtar endepunktet bare `UTVIDET_OMSTILLINGSSTOENAD`.
- **Hvorfor:** BP- og OMS-søknader kan flyttes over senere uten en ny kjede.
- **Konsekvens:** Andre søknadstyper gir `400` til de tas inn med vilje.
- **Avklart:** 2026-11-10, utvikleren

### B11 – Task-payload er bare `{ soeknadId }`

Payload-regelen beholdes i B12. Søknadsinnholdet blir i `innsendt-soeknad`, ikke i en ny `mottatt_soeknad` i Gjenny.

- **Beslutning:** Payload inneholder bare søknads-id. fnr og søknadsinnhold ligger i `mottatt_soeknad`. Metadata får `soeknadId`, `soeknadType`, `sakId` og `journalpostId` etter hvert som de blir kjent.
- **Hvorfor:** `UNIQUE(type, payload)` blir idempotensnøkkel per steg og søknad, og verktøyet viser ingen personopplysninger i payload.
- **Konsekvens:** Gjennys `prosessering_task` må få `UNIQUE(type, payload)` (5.6). Unntaksmeldinger i stegene skal ikke inneholde fnr, fordi de lagres som `siste_feilmelding`.
- **Avklart:** 2026-11-10, utvikleren

### B12 – Innsendt-soeknad eier mottakskjeden
- **Beslutning:** `innsendt-soeknad` bruker `efterlatte-prosessering` i sin egen Postgres. Appen lagrer søknaden og første task atomisk, henter journalføringskontekst fra Gjenny, genererer PDF, journalfører og overleverer den journalførte søknaden til Gjenny. Mottaket fullføres lokalt etter bekreftet overlevering. Det trengs ingen Kafka-kvittering tilbake til samme app.
- **Hvorfor:** Søknaden og mottaksstatusen finnes allerede her. Vi unngår en ny kopi av søknadsinnholdet i behandling og en ekstra kvitteringsflyt. Databasekravet i B8 utelukker ikke innsendt-soeknad.
- **Ansvar i Gjenny:** Gjenny avgjør sakstilknytning, eventuell opprettelse av sak, oppgave og behandling. Inntil Å8 er avklart, oppretter Gjenny en `TILLEGGSINFORMASJON`-oppgave som i B4. Innsendt-soeknad skal ikke velge revurderingsårsak eller tolke pågående behandlinger.
- **Garantier:** Valget mellom gammel og ny flyt lagres per søknad. Task-payload er bare `{ soeknadId }`. Lokale data, neste task og `FULLFØRT` bruker samme connection. Gjenny dedupliserer overlevering atomisk på en stabil søknadsnøkkel og returnerer samme resultat ved retry. Eksterne kall har minst-én-gang-semantikk.
- **Konsekvens:** Fase 5 og `prosessering.md` revideres. `mottatt_soeknad`, `StegKontekst`, journalføringsklienter og mottaksruting i behandling fra den gamle planen utgår. Eksisterende prosessering i behandling beholdes for andre formål. Driftsflaten får innsendt-soeknad som egen datakilde via API og OBO, aldri direkte databasekobling.
- **Avgrensning:** Først utvidet OMS i dev. B4 er referanse for atferd. Å3, Å8, Å9 og Å12 er fortsatt åpne. Ingen automatisk overgang til gammelt løp ved feil i en task.
- **PR-er:** Utvikleren vil lukke felles [#642](https://github.com/navikt/pensjon-etterlatte-felles/pull/642) og sb [#9049](https://github.com/navikt/pensjon-etterlatte-saksbehandling/pull/9049). De erstattes av nye endringer for riktig app. Begge var fortsatt åpne ved ny kontroll 2026-11-27. Ingen PR er lukket, endret eller merget av agenten.
- **Status:** Implementert lokalt i alle berørte repoer 2026-11-27, uten commit eller deployment. Detaljer og avvik fra planen står under «Implementasjonsstatus» i [`prosessering.md`](prosessering.md).
- **Avklart:** 2026-11-27, utvikleren i arkitektursamtalen. Det lokale Å13-notatet er innarbeidet her og i den tekniske planen.

---

## Åpne spørsmål

### Å1 – Aktivitetsplan ved utdanning?
Figma-notatet sier at vi bare spør om aktivitetsplan ved arbeidsrettet tiltak. Eksempel-JSON-en `utvidet_omstillingsstoenad.json` i felles har likevel `aktivitetsplan` ved `UTDANNING`. **Forslag:** Bare ved tiltak. Rett eksempelet.

### Å2 – Ja/Nei eller `JaNeiVetIkke` for felles barn/tidligere gift
Figma viser Ja/Nei. Kontrakten gjenbruker `Samboer`, som har `fellesBarnEllertidligereGift: Opplysning<EnumSvar<JaNeiVetIkke>>` og et påkrevd, nullbart felt `inntekt`. **Forslag:** Gjenbruk `Samboer`, send bare `JA`/`NEI` og `inntekt = null`.

### Å3 – Hvilken sak kreves for å søke?
Figma-notatet sier at det må finnes «en sak på omstillingsstønad». Appen kaller nå `har_sak`, som i praksis dekker om bruker har eller har hatt OMS-sak. Endelig regel for hvilke opphørte saker som skal godtas, **avklares med fag**.

### Å4 – Dokumentasjon og vedlegg
Steg 6 er ikke kartlagt. Det er ikke støtte for vedlegg i kontrakten eller i innsendt-soeknad. Oppsummeringen i Figma viser «Studieplan.pdf». **Foreløpig:** tom side.

### Å5 – Utbetalingsinformasjon
Dette er ikke med i Figma. Kontrakten har `utbetalingsInformasjon` som valgfri. **Forslag:** Send `null`, siden bruker allerede har utbetaling.

### Å6 – Avvik i spørsmålstekster mellom steg og oppsummering
Oppsummeringen bruker «Hva stemmer med din situasjon i dag?», mens steg 3 bruker «Har du ny samboer eller giftet deg på nytt?». Oppsummeringen sier også «Hvor studerer du?», mens steget sier «Hvilken skole studerer du ved?». **Forslag:** Bruk samme tekst som i steget. Sjekk med innholdsdesigner.

### Å7 – `soeknadType` ved oppslag av innlogget person
`hentInnloggetPerson` sender `soeknadType=OMSTILLINGSSTOENAD`. Sjekk om innsendt-soeknad trenger `UTVIDET_OMSTILLINGSSTOENAD` her, for eksempel for adressebeskyttelse eller aldersregler.

### Å8 – Behandlingsløp i Gjenny
Teamet heller mot at søknaden skal opprette en revurdering basert på forrige behandling, men det er ikke avklart. Det er også uavklart om dette skal skje automatisk eller via oppgaven (B4), og hvilken revurderingsårsak som skal brukes. Etter B12 ligger avgjørelsen i Gjennys håndtering av den journalførte søknaden. Innsendt-soeknad beholder overleveringssteget.

### Å9 – Lansering
Det mangler avklaring av feature toggle, prod-nais, inngang fra nav.no eller Min side, og varsling (etterlatte-notifikasjoner).

Kartlagt 2026-11-27: I dag sender etterlatte-notifikasjoner en Min side-beskjed med SMS («Vi har mottatt søknaden din om utvidet omstillingsstønad») når `soeknad_innsendt` med `@dokarkivRetur` kommer tilbake fra Gjenny, også ved ukjent bruker. Prosesseringsløpet publiserer et kompatibilitetsevent som gir samme beskjed. **Må avklares før aktivering:** Skal denne beskjeden videreføres for utvidet OMS? Toggle for nye søknader er lagt i Unleash (`pensjon-etterlatte.innsendt-soeknad.utvidet-oms-mottak-prosessering`) og er av.

### Å10 – Lagring og sletting av mottaksdata
B12 fjerner behovet for `mottatt_soeknad` i behandling. Innsendt-soeknad har allerede en jobb som sletter `innhold` etter `ARKIVERT` eller `BEHANDLINGLAGRET`. Ny flyt må ikke sette en slik status før overleveringen til Gjenny er bekreftet og nødvendige integrasjonshendelser er varig sikret. Avklar levetid for journalføringskontekst, journalpostreferanser, tasks, metadata og operatørlogg. Eksisterende slettejobb løser ikke alle nye sletteregler.

Implementert 2026-11-27: `ARKIVERT` settes først i siste task, og innholdet slettes da av dagens jobb. Søknader i prosesseringsløpet unntas fra slettingen av utgåtte kladder, så et stoppet mottak beholder innholdet til det er fulgt opp. `soeknad_mottak` (interne referanser, ikke fnr), tasks og operatørlogg slettes ikke. Operatørloggen kan inneholde stacktracer. **Må avklares:** levetid for disse radene, og hva som skal skje med innholdet når en operatør avbryter et mottak.

### Å11 – Tilgang fra `innsendt-soeknad` til dokarkiv og PDF-generator
Innsendt-soeknad trenger etter B12 nettverkstilgang og egen godkjent Azure-klient mot dokarkiv, samt tilgang til ey-pdfgenrs for utvidet OMS. Dev-tilgangen som tidligere ble deployet for behandling, tester ikke denne klienten. Bekreft tilgangen fra innsendt-soeknad etter deployment. Gi ikke tilgang til gammel PDF-generator uten at den nye flyten faktisk trenger den.

Status 2026-11-27: innsendt-soeknad har outbound mot `dokarkiv-q2.dev-fss-pub.nais.io` og `ey-pdfgenrs` i lokalt dev-manifest, og ey-pdfgenrs har inbound på lokal felles-branch. **Ekstern blokkering:** teamdokumenthandtering må pre-autorisere `dev-gcp:etterlatte:innsendt-soeknad` for dokarkiv. Uten det stopper T2 med `DokarkivFeil: Dokarkiv svarte 401/403`.

### Å12 – Søknad uten eksisterende OMS-sak
Henger sammen med Å3. Skal Gjenny opprette en ny OMS-sak som `NySoeknadRiver` gjør i dag, eller stoppe for manuell oppfølging? B12 avgjør ikke dette. Behold dagens oppførsel inntil fag avklarer noe annet. Biblioteksstøtte for `MANUELL` (5.4) er valgfri.

### Å13 – Plassering av mottakskjeden (avklart)
Avklart som B12 den 2026-11-27. Nummeret beholdes for historikk og gjenbrukes ikke.
