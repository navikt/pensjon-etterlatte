import { i18n, TFunction } from "i18next";
import { StegPath } from "../typer/steg";

export interface Innhold {
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
export default class ObjectTreeReader {
    private dtf: Intl.DateTimeFormat;
    private readonly t: TFunction;

    constructor(t: TFunction, i18n: i18n) {
        this.t = t;
        this.dtf = Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    traverse<T>(object: T, baseKey?: string): Innhold[] {
        return Object.entries(object)
            .filter(value => !!value[1])
            .flatMap(value => {
                const val = value[1]

                const key = this.getKey(value[0], baseKey)

                if (!!val && typeof val === "object" && !(val instanceof Date))
                    return this.traverse(val, key)
                else {
                    return {
                        spoersmaal: this.t(key),
                        svar: this.stringify(val)
                    }
                }
            })
    }

    private getKey = (key: string, baseKey?: string) => {
        const newKey = !!baseKey ? baseKey.concat(".").concat(key) : key

        return newKey.replace(/(.\d+)/g, "");
    }

    private isDateString = (value: any): boolean => {
        if (typeof value === "string") return !!value.match(/\d{4}-\d{2}-\d{2}.*/)?.length
        else return false
    }

    private isTranslationKey = (value: any): boolean => {
        if (typeof value === "string") return !!value.match(/[a-z]+\.[a-z]+(\.[a-z]+)?/)?.length
        else return false
    }

    private stringify = (val: any): string => {
        if (this.isDateString(val) || val instanceof Date)
            return this.dtf.format(new Date(val))
        else if (this.isTranslationKey(val))
            return this.t(val)
        else
            return val?.toString()
    }
}
