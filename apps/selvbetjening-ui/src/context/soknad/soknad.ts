import { IPerson, IKontaktinfo, IBarn } from "../../typer/IPerson";
import { IValg } from "../../typer/ISpoersmaal";

export interface IAndreYtelser {
    mottarAndreYtelser?: IValg;
    kravOmAnnenStonad: {
        svar?: IValg;
        beskrivelseAvStoenad?: string;
    };
    mottarPensjonUtland: {
        svar?: IValg;
        hvaSlagsPensjon?: string;
        fraHvilketLand?: string;
        bruttobeloepPrAar?: string;
        landetsValuta?: string;
    };
}

export interface IArbeidsforholdElement {
    beskrivelse: string;
    varighet: string;
}

export interface IStoenadType {
    etterlatte: boolean;
    gjenlevendetillegg: boolean;
    barnepensjon: boolean;
    barnetilsyn: boolean;
    skolepenger: boolean;
}

export interface ISoeknad {
    fraDato: Date | null;
    stoenadType: IStoenadType;
    soeker: IPerson | null;
    kontaktinfo?: IKontaktinfo;
    avdod: null; // TODO: 3 Opplysninger om den avdøde
    opplysningerOmBarn: IBarn[]; // 4 Opplysninger om barn
    tidligereArbeidsforhold: IArbeidsforholdElement[]; // 5 Opplysninger om tidligere arbeidsforhold
    naavaerendeArbeidsforhold: null; // TODO: 6 Søkers nåværende arbeids- og inntektsforhold
    andreYtelser: IAndreYtelser | null; // 7 Opplysninger om andre ytelser
}

export enum SoeknadActionTypes {
    HENT_INNLOGGET_BRUKER,
    BEKREFT_BOADRESSE,
    OPPHOLD_NORGE,
    SETT_FRA_DATO,
    OPPDATER_VALGTE_STOENADER,
    SETT_TELEFON,
    SETT_EPOST,
    LEGG_TIL_BARN,
    LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD,
    FJERN_TIDLIGERE_ARBEIDSFORHOLD,
    OPPDATER_ANDRE_YTELSER,
}

export interface ISoeknadAction {
    type: SoeknadActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
