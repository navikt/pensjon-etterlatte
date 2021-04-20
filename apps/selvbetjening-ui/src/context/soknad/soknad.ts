import { IAvdoed, IBarn, ISoeker } from "../../typer/person";
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

export interface ITidligereArbeidsforhold {
    beskrivelse: string;
    varighet: string;
    fraDato: Date | null;
    tilDato: Date | null;
}

export interface IStoenadType {
    etterlatte: boolean;
    gjenlevendetillegg: boolean;
    barnepensjon: boolean;
    barnetilsyn: boolean;
    skolepenger: boolean;
    fraDato: Date | null;
}

export interface IArbeidsforhold {
    yrke: string;
    stilling: string;
    startDato: Date | null;
    sluttDato: Date | null;
    ansettelsesforhold: string; // låse valg til type?
    heltidDeltid: string;
    stillingsprosent: number | null;
    arbeidsgiver: {
        navn: string;
        adresse: string;
    };
    inntekt: {
        bruttoArbeidsinntektPrMd: string;
        personinntektFraNaeringPrAr: string;
    };
}

export interface ISoeknad {
    // 1 Hva søker du?
    stoenadType: IStoenadType | null;
    // 2 Opplysninger om søkeren
    opplysningerOmSoekeren: ISoeker | null;
    // 3 Opplysninger om den avdøde
    opplysningerOmDenAvdoede: IAvdoed | null;
    // 4 Opplysninger om barn
    opplysningerOmBarn: IBarn[];
    // 5 Opplysninger om tidligere arbeidsforhold
    tidligereArbeidsforhold: ITidligereArbeidsforhold[];
    // 6 Søkers nåværende arbeids- og inntektsforhold
    naavaerendeArbeidsforhold: IArbeidsforhold | null;
    // 7 Opplysninger om andre ytelser
    andreYtelser: IAndreYtelser | null;
}

export enum ActionTypes {
    TILBAKESTILL,
    HENT_INNLOGGET_BRUKER,
    BEKREFT_BOADRESSE,
    OPPHOLD_NORGE,
    OPPDATER_VALGTE_STOENADER,
    OPPDATER_AVDOED,
    SETT_TELEFON,
    SETT_EPOST,
    LEGG_TIL_BARN,
    LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD,
    FJERN_TIDLIGERE_ARBEIDSFORHOLD,
    OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD,
    OPPDATER_ANDRE_YTELSER,
}

export interface ISoeknadAction {
    type: ActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
