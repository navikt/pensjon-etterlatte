import {IAvdoed, IBarn, ISoeker} from "../../typer/person";
import {IArbeidsforhold, ITidligereArbeidsforhold} from "../../typer/arbeidsforhold";
import {IAndreYtelser, ISituasjon} from "../../typer/ytelser";

export interface ISoeknad {
    harSamtykket: boolean;
    // 1 Hva søker du?
    situasjon: ISituasjon | null;
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
    MOCK_SOEKNAD,
    TILBAKESTILL,
    OPPDATER_SAMTYKKE,
    OPPDATER_SITUASJON,
    OPPDATER_SOEKER,
    OPPDATER_AVDOED,
    LEGG_TIL_BARN,
    FJERN_BARN,
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
