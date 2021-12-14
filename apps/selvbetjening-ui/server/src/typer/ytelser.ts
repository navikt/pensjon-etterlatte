import { IValg } from "./Spoersmaal";

export interface IAndreYtelser {
    kravOmAnnenStonad?: {
        svar?: IValg;
        beskrivelse?: string;
    };
    annenPensjon?: {
        svar?: IValg;
        beskrivelse: string;
    };
    mottarPensjonUtland?: {
        svar?: IValg;
        hvaSlagsPensjon?: string;
        fraHvilketLand?: string;
        bruttobeloepPrAar?: string;
        landetsValuta?: string;
    };
}
