import {IAvdoed, IBarn, ISoeker} from "../../typer/person";
import {IArbeidsforhold, ITidligereArbeidsforhold} from "../../typer/arbeidsforhold";
import {IAndreYtelser, ISituasjon} from "../../typer/ytelser";

export interface ISoeknad {
    harSamtykket: boolean;
    // 1 Hva søker du?
    situasjon: ISituasjon;
    // 2 Opplysninger om søkeren
    opplysningerOmSoekeren: ISoeker;
    // 3 Opplysninger om den avdøde
    opplysningerOmDenAvdoede: IAvdoed;
    // 4 Opplysninger om barn
    opplysningerOmBarn: IBarn[];
    // 5 Opplysninger om tidligere arbeidsforhold
    tidligereArbeidsforhold: ITidligereArbeidsforhold[];
    // 6 Søkers nåværende arbeids- og inntektsforhold
    naavaerendeArbeidsforhold: IArbeidsforhold;
    // 7 Opplysninger om andre ytelser
    andreYtelser: IAndreYtelser;
}

export enum ActionTypes {
    MOCK_SOEKNAD = "MOCK_SOEKNAD",
    TILBAKESTILL = "TILBAKESTILL",
    OPPDATER_SAMTYKKE = "OPPDATER_SAMTYKKE",
    OPPDATER_SITUASJON = "OPPDATER_SITUASJON",
    OPPDATER_SOEKER = "OPPDATER_SOEKER",
    OPPDATER_AVDOED = "OPPDATER_AVDOED",
    LEGG_TIL_BARN = "LEGG_TIL_BARN",
    FJERN_BARN = "FJERN_BARN",
    LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD = "LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD",
    FJERN_TIDLIGERE_ARBEIDSFORHOLD = "FJERN_TIDLIGERE_ARBEIDSFORHOLD",
    OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD = "OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD",
    OPPDATER_ANDRE_YTELSER = "OPPDATER_ANDRE_YTELSER",
}

export interface ISoeknadAction {
    type: ActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
