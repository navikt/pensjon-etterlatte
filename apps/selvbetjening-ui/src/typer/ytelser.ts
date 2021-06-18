import { IValg } from "./Spoersmaal";

export enum Ytelse {
    etterlatte = "etterlatte",
    gjenlevendetillegg = "gjenlevendetillegg",
}

export interface ISituasjon {
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
        beskrivelse?: string;
    };
    mottarPensjonUtland?: {
        svar?: IValg;
        hvaSlagsPensjon?: string;
        fraHvilketLand?: string;
        bruttobeloepPrAar?: string;
        landetsValuta?: string;
    };
}
