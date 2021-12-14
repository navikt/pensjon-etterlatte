import { JobbStatus, Utdanning as GammelUtdanning } from "../../typer/situasjon";
import {
    ForholdTilAvdoedeType,
    HoeyesteUtdanning,
    InntektType,
    JobbStatusType, OppholdUtlandType,
    SivilstatusType,
    Ytelser
} from "./InnsendtSoeknad";
import {
    ForholdTilAvdoede as RelasjonAvdoed, OppholdUtlandType as GammelOppholdUtlandType,
    SamboerInntekt as GammelSamboerInntekt,
    Sivilstatus
} from "../../typer/person";
import { Ytelser as GamleYtelser } from "../../typer/ytelser";


export const konverterTilHoyesteUtdanning = (type: String | GammelUtdanning): HoeyesteUtdanning => {
    switch (type) {
        case GammelUtdanning.grunnskole:
            return HoeyesteUtdanning.GRUNNSKOLE;
        case GammelUtdanning.videregående:
            return HoeyesteUtdanning.VIDEREGAAENDE;
        case GammelUtdanning.fagbrev:
            return HoeyesteUtdanning.FAGBREV;
        case GammelUtdanning.bachelorgrad:
            return HoeyesteUtdanning.UNIVERSITET_OPPTIL_4_AAR;
        case GammelUtdanning.mastergrad:
            return HoeyesteUtdanning.UNIVERSITET_OVER_4_AAR;
        case GammelUtdanning.ingen:
            return HoeyesteUtdanning.INGEN;
        case GammelUtdanning.annen:
            return HoeyesteUtdanning.ANNEN;
        default:
            throw Error(`Ukjent type utdanning: ${type}`)
    }
};

export const konverterSamboerInntekt = (type: GammelSamboerInntekt): InntektType => {
    switch (type) {
        case GammelSamboerInntekt.pensjon:
            return InntektType.PENSJON;
        case GammelSamboerInntekt.kapitalinntekt:
            return InntektType.KAPITALINNTEKT;
        case GammelSamboerInntekt.arbeidsinntekt:
            return InntektType.ARBEIDSINNTEKT;
        case GammelSamboerInntekt.andreYtelser:
            return InntektType.ANDRE_YTELSER;
        default:
            throw Error(`Ukjent type inntekt: ${type}`)
    }
};

export const konverterSivilstatus = (type: Sivilstatus): SivilstatusType => {
    switch (type) {
        case Sivilstatus.ingen:
            return SivilstatusType.INGEN;
        case Sivilstatus.ekteskap:
            return SivilstatusType.EKTESKAP;
        case Sivilstatus.samboerskap:
            return SivilstatusType.SAMBOERSKAP;
        default:
            throw Error(`Ukjent type sivilstatus: ${type}`)
    }
};

export const konverterJobbStatus = (type: JobbStatus): JobbStatusType => {
    switch (type) {
        case JobbStatus.arbeidstaker:
            return JobbStatusType.ARBEIDSTAKER;
        case JobbStatus.selvstendig:
            return JobbStatusType.SELVSTENDIG;
        case JobbStatus.underUtdanning:
            return JobbStatusType.UNDER_UTDANNING;
        case JobbStatus.ingen:
            return JobbStatusType.INGEN;
        default:
            throw Error(`Ukjent type sivilstatus: ${type}`)
    }
};

export const konverterYtelser = (type: GamleYtelser): Ytelser => {
    switch (type) {
        case GamleYtelser.dagpenger:
            return Ytelser.DAGPENGER;
        case GamleYtelser.sykepenger:
            return Ytelser.SYKEPENGER;
        case GamleYtelser.pleiepenger:
            return Ytelser.PLEIEPENGER;
        case GamleYtelser.svangerskapspenger:
            return Ytelser.SVANGERSKAPSPENGER;
        case GamleYtelser.foreldrepenger:
            return Ytelser.FORELDREPENGER;
        case GamleYtelser.arbeidsavklaringspenger:
            return Ytelser.ARBEIDSAVKLARINGSPENGER;
        case GamleYtelser.kvalifiseringsstoenad:
            return Ytelser.KVALIFISERINGSSTOENAD;
        case GamleYtelser.kommunal:
            return Ytelser.KOMMUNAL_OMSORGSSTONAD;
        case GamleYtelser.fosterhjem:
            return Ytelser.FOSTERHJEMSGODTGJOERING;
        case GamleYtelser.omsorgspenger:
            return Ytelser.OMSORGSPENGER;
        case GamleYtelser.opplaeringspenger:
            return Ytelser.OPPLAERINGSPENGER;
        default:
            throw Error(`Ukjent type ytelses: ${type}`);
    }
};

export const konverterRelasjonAvdoed = (type: RelasjonAvdoed | string): ForholdTilAvdoedeType => {
    switch (type) {
        case RelasjonAvdoed.gift:
            return ForholdTilAvdoedeType.GIFT;
        case RelasjonAvdoed.skilt:
            return ForholdTilAvdoedeType.SKILT;
        case RelasjonAvdoed.samboer:
            return ForholdTilAvdoedeType.SAMBOER;
        case RelasjonAvdoed.separert:
            return ForholdTilAvdoedeType.SEPARERT;
        case RelasjonAvdoed.tidligereSamboer:
            return ForholdTilAvdoedeType.TIDLIGERE_SAMBOER;
        default:
            throw Error(`Ukjent type relasjon til avdoed: ${type}`);
    }
};

export const konverterOpphold = (type: GammelOppholdUtlandType): OppholdUtlandType => {
    switch (type) {
        case GammelOppholdUtlandType.arbeidet:
            return OppholdUtlandType.ARBEIDET;
        case GammelOppholdUtlandType.bodd:
            return OppholdUtlandType.BODD;
        default:
            throw Error(`Ukjent type opphold utland: ${type}`);
    }
};
