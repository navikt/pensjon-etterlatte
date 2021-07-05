export enum IValg {
    JA = "Ja",
    NEI = "Nei",
    VET_IKKE = "Vet ikke",
}

export interface Spoersmaal{
    svar?: IValg;
    beskrivelse?: string;
}
