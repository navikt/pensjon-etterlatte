import { StegPath } from "../typer/steg";

export interface Innhold {
    key: string;
    spoersmaal: string;
    svar: string | Date | number;
}

export interface Element {
    tittel?: string;
    innhold: Innhold[];
}

export interface Gruppe {
    tittel: string;
    path: StegPath;
    elementer: Element[];
}

/**
 * Flater ut nøstet objekt og omgjør til liste med spørsmål og svar.
 * Oversetter også spørsmål-nøkkel til spørsmålstekst basert på locale.
 *
 * Eksempelvis:
 *  {
 *      person: {
 *          navn: {
 *              fornavn: "Ola",
 *              etternavn" "Nordmann"
 *          }
 *      }
 *  }
 *
 * Blir til:
 *  [
 *      {spoersmaal: "person.navn.fornavn", svar: "Ola" },
 *      {spoersmaal: "person.navn.etternavn", svar: "Nordmann" }
 *  ]
 */