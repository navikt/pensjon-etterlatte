import { IValg } from "./Spoersmaal";

export interface IOmSoeknaden {
    barnepensjon?: IValg;
    datoForDoedsfallet?: Date;
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
