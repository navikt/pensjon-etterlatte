export enum IValg {
    JA = "Ja",
    NEI = "Nei",
}

export interface FritekstSpoersmaal {
    spoersmaal: string;
    svar: string | null;
}

export interface JaNeiSpoersmaal {
    svar: IValg | null;
    beskrivelse?: string;
}

export interface AvansertJaNei {
    spoersmaal: string;
    svar: IValg | null;
    utdypning?: FritekstSpoersmaal[];
}
