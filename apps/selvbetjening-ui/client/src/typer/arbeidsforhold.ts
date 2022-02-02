import { IValg } from "./Spoersmaal";

export enum StillingType {
    fast = "stillingType.fast",
    midlertidig = "stillingType.midlertidig",
    sesongarbeid = "stillingType.sesongarbeid",
}

export interface IArbeidsforhold {
    arbeidsgiver?: string;
    stilling?: string; // Bort?
    ansettelsesforhold?: StillingType; // låse valg til type?
    stillingsprosent?: number;
    forventerEndretInntekt?: {
        svar?: IValg;
        beskrivelse?: string;
    };
}

export interface ISelvstendigNaeringsdrivende {
    beskrivelse?: string;
    orgnr?: string;
    forventerEndretInntekt?: {
        svar?: IValg;
        beskrivelse?: string;
    };
}

export enum IngenJobb {
    hjemmearbeidende = "dinSituasjon.ingenJobb.hjemmearbeidende",
    omsorgBarn = "dinSituasjon.ingenJobb.omsorgBarn",
    omsorgNaerstaaende = "dinSituasjon.ingenJobb.omsorgNaerstaaende",
    frivilligArbeid = "dinSituasjon.ingenJobb.frivilligArbeid",
    annet = "dinSituasjon.ingenJobb.annet",
}
