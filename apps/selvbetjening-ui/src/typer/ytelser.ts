import IValg from "./IValg";

export enum Ytelse {
    etterlatte = "etterlatte",
    gjenlevendetillegg = "gjenlevendetillegg",
    barnepensjon = "barnepensjon",
    // barnetilsyn = "barnetilsyn",
    // skolepenger = "skolepenger",
}

export interface IStoenadType {
    valgteYtelser?: {
        hovedytelse?: Ytelse;
        barnepensjon?: IValg;
    };
    fraDato?: Date;
}

export interface IAndreYtelser {
    mottarAndreYtelser?: IValg;
    kravOmAnnenStonad?: {
        svar?: IValg;
        beskrivelseAvStoenad?: string;
    };
    mottarPensjonUtland?: {
        svar?: IValg;
        hvaSlagsPensjon?: string;
        fraHvilketLand?: string;
        bruttobeloepPrAar?: string;
        landetsValuta?: string;
    };
}
