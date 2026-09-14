---
name: explain-diff-html
description: Bruk når brukeren ønsker en kortfattet og interaktiv forklaring av logikken i kode fra en branch, PR eller diff. Lager forklaringen som HTML.
    tools:execute/runInTerminal, edit/createDirectory, edit/createFile
---

# Forklar kode

Lag en kortfattet og interaktiv forklaring av den aktuelle koden.

Hovedmålet er å forklare hvordan koden virker, hvorfor den er bygget opp slik, og hvordan data og kontroll flyter
gjennom løsningen. En diff, branch eller PR brukes som utgangspunkt for å finne den relevante koden, men forklaringen
skal ikke først og fremst være en oppramsing av hva som er endret siden forrige versjon.

Forklaringen skal ha disse delene:

- **Kort fortalt:** Gi leseren en enkel mental modell av hva koden gjør og hvilket problem den løser. Forklar essensen
  uten å gå inn i alle detaljene. Bruk konkrete eksempler med enkle eksempeldata.
- **Slik virker koden:** Forklar den overordnede flyten gjennom løsningen. Vis hva som starter prosessen, hvilke viktige
  steg som utføres, hvordan data endres underveis, og hva resultatet blir. Bruk diagrammer når de gjør flyten lettere å
  forstå.
- **Gjennomgang av koden:** Gå gjennom de viktigste delene av implementasjonen. Grupper koden etter ansvar eller rolle,
  ikke nødvendigvis etter fil eller rekkefølgen i diffen. Forklar særlig betingelser, transformasjoner, kall mellom
  komponenter og viktige designvalg.
- **Endringen i sammenheng:** Forklar kort hva som er nytt eller annerledes dersom utgangspunktet er en diff, branch
  eller PR. Knytt endringene til kodeflyten og forklar hvilken praktisk betydning de har. Unngå en detaljert
  fil-for-fil-oppramsing.
- **Test forståelsen din:** Lag fem flervalgsoppgaver som tester om leseren har forstått logikken i koden. Oppgavene
  skal være middels vanskelige og kreve faktisk forståelse, men ikke være lureoppgaver. Når leseren velger et svar, skal
  det vises om svaret er riktig, sammen med en kort forklaring.

## Format

- Lag én selvstendig HTML-fil som inneholder nødvendig HTML, CSS og JavaScript.
- Hele forklaringen skal være én sammenhengende side med overskrifter og innholdsfortegnelse. Ikke bruk faner til
  hovedstrukturen.
- Siden skal ha enkel responsiv utforming og fungere godt både på datamaskin og mobil.
- Lagre filen på et globalt sted utenfor kode-repositoriet.
- Filnavnet skal begynne med dagens dato i formatet `YYYY-MM-DD-`, slik at filene sorteres kronologisk og ikke havner i
  versjonskontroll.
- Design i light-mode

Eksempel:

`/tmp/2026-01-12-kodeforklaring-<slug>.html`

## Språk og formidling

- Skriv på naturlig og lettlest norsk.
- Skriv klart, presist og engasjerende, med en rolig og pedagogisk flyt.
- Forklar fagbegreper når de først introduseres.
- Bruk overganger mellom delene slik at forklaringen oppleves som en sammenhengende tekst.
- Prioriter hvorfor og hvordan fremfor bare hva.
- Bruk små, realistiske eksempeldata for å gjøre abstrakt logikk konkret.
- Bruk uthevede faktabokser for sentrale begreper, viktige forutsetninger og relevante grensetilfeller.

## Diagrammer

Velg et lite antall diagramtyper som kan gjenbrukes gjennom forklaringen. Aktuelle diagrammer kan være:

- En forenklet fremstilling av brukergrensesnittet.
- Et flytdiagram som viser rekkefølgen i behandlingen.
- Et systemdiagram som viser kommunikasjon mellom komponenter.
- En fremstilling av hvordan eksempeldata ser ut før, under og etter behandlingen.

Ta med konkrete eksempeldata i diagrammene når det er nyttig.

Ikke bruk ASCII-diagrammer. Lag diagrammene med enkel HTML og CSS. Bruk vanlige HTML-lister når innholdet egentlig er en
liste.

## Kodeblokker

- Bruk alltid `<pre>` til kodeblokker.
- Hvis en egendefinert `<div>` brukes i stedet, må CSS-en inneholde `white-space: pre-wrap`.
- Før filen lagres, kontroller at alle kodeblokker beholder linjeskift ved hjelp av `white-space: pre` eller
  `white-space: pre-wrap`.

