import { JobbStatus, Utdanning as GammelUtdanning } from '../../typer/situasjon'
import {
    Arbeidsmengde,
    IngenJobb,
    SagtOppEllerRedusert,
    StillingType as GammelStillingType,
} from '../../typer/arbeidsforhold'
import {
    ArbeidsmengdeType,
    ForholdTilAvdoedeType,
    HoeyesteUtdanning,
    IngenJobbType,
    JobbStatusType,
    OppholdUtlandType,
    SagtOppEllerRedusertType,
    SivilstatusType,
    SoekbareYtelserAndreType,
    SoekbareYtelserNAVType,
    StillingType,
    StudieformType,
    Ytelser,
    EndringAvInntektGrunnType,
    PensjonsYtelseType,
    InntektEllerUtbetalingType, PensjonEllerTrygdType,
} from '../dto/FellesOpplysninger'
import {
    ForholdTilAvdoede as RelasjonAvdoed,
    OppholdUtlandType as GammelOppholdUtlandType,
    Sivilstatus,
} from '../../typer/person'
import { Ytelser as GamleYtelser } from '../../typer/ytelser'
import {
    EndringAvInntektGrunn,
    InntektEllerUtbetaling, PensjonEllerTrygd,
    PensjonsYtelse,
    SoekbareYtelserAndre,
    SoekbareYtelserNAV,
} from '../../typer/inntekt'
import { Studieform } from '../../typer/utdanning'

export const konverterStillingType = (type: GammelStillingType): StillingType => {
    switch (type) {
        case GammelStillingType.fast:
            return StillingType.FAST
        case GammelStillingType.midlertidig:
            return StillingType.MIDLERTIDIG
        case GammelStillingType.tilkallingsvikar:
            return StillingType.TILKALLINGSVIKAR
        default:
            throw Error(`Ukjent type stilling: ${type}`)
    }
}

export const konverterTilHoyesteUtdanning = (type: String | GammelUtdanning): HoeyesteUtdanning => {
    switch (type) {
        case GammelUtdanning.grunnskole:
            return HoeyesteUtdanning.GRUNNSKOLE
        case GammelUtdanning.videregående:
            return HoeyesteUtdanning.VIDEREGAAENDE
        case GammelUtdanning.fagbrev:
            return HoeyesteUtdanning.FAGBREV
        case GammelUtdanning.bachelorgrad:
            return HoeyesteUtdanning.UNIVERSITET_OPPTIL_4_AAR
        case GammelUtdanning.mastergrad:
            return HoeyesteUtdanning.UNIVERSITET_OVER_4_AAR
        case GammelUtdanning.ingen:
            return HoeyesteUtdanning.INGEN
        case GammelUtdanning.annen:
            return HoeyesteUtdanning.ANNEN
        default:
            throw Error(`Ukjent type utdanning: ${type}`)
    }
}

export const konverterSivilstatus = (type: Sivilstatus): SivilstatusType => {
    switch (type) {
        case Sivilstatus.enke:
            return SivilstatusType.ENKE
        case Sivilstatus.enslig:
            return SivilstatusType.ENSLIG
        case Sivilstatus.ekteskap:
            return SivilstatusType.EKTESKAP
        case Sivilstatus.samboerskap:
            return SivilstatusType.SAMBOERSKAP
        default:
            throw Error(`Ukjent type sivilstatus: ${type}`)
    }
}

export const konverterJobbStatus = (type: JobbStatus): JobbStatusType => {
    switch (type) {
        case JobbStatus.arbeidstaker:
            return JobbStatusType.ARBEIDSTAKER
        case JobbStatus.selvstendigENK:
            return JobbStatusType.SELVSTENDIG_ENK
        case JobbStatus.selvstendigAS:
            return JobbStatusType.SELVSTENDIG_AS
        case JobbStatus.etablerer:
            return JobbStatusType.ETABLERER
        case JobbStatus.tilbud:
            return JobbStatusType.TILBUD
        case JobbStatus.arbeidssoeker:
            return JobbStatusType.ARBEIDSSOEKER
        case JobbStatus.underUtdanning:
            return JobbStatusType.UNDER_UTDANNING
        case JobbStatus.ingen:
            return JobbStatusType.INGEN
        default:
            throw Error(`Ukjent type sivilstatus: ${type}`)
    }
}

export const konverterYtelser = (type: GamleYtelser): Ytelser => {
    switch (type) {
        case GamleYtelser.dagpenger:
            return Ytelser.DAGPENGER
        case GamleYtelser.sykepenger:
            return Ytelser.SYKEPENGER
        case GamleYtelser.pleiepenger:
            return Ytelser.PLEIEPENGER
        case GamleYtelser.svangerskapspenger:
            return Ytelser.SVANGERSKAPSPENGER
        case GamleYtelser.foreldrepenger:
            return Ytelser.FORELDREPENGER
        case GamleYtelser.arbeidsavklaringspenger:
            return Ytelser.ARBEIDSAVKLARINGSPENGER
        case GamleYtelser.kvalifiseringsstoenad:
            return Ytelser.KVALIFISERINGSSTOENAD
        case GamleYtelser.kommunal:
            return Ytelser.KOMMUNAL_OMSORGSSTONAD
        case GamleYtelser.fosterhjem:
            return Ytelser.FOSTERHJEMSGODTGJOERING
        case GamleYtelser.omsorgspenger:
            return Ytelser.OMSORGSPENGER
        case GamleYtelser.opplaeringspenger:
            return Ytelser.OPPLAERINGSPENGER
        default:
            throw Error(`Ukjent type ytelses: ${type}`)
    }
}

export const konverterRelasjonAvdoed = (type: RelasjonAvdoed | string): ForholdTilAvdoedeType => {
    switch (type) {
        case RelasjonAvdoed.gift:
            return ForholdTilAvdoedeType.GIFT
        case RelasjonAvdoed.skilt:
            return ForholdTilAvdoedeType.SKILT
        case RelasjonAvdoed.samboer:
            return ForholdTilAvdoedeType.SAMBOER
        case RelasjonAvdoed.separert:
            return ForholdTilAvdoedeType.SEPARERT
        case RelasjonAvdoed.tidligereSamboer:
            return ForholdTilAvdoedeType.TIDLIGERE_SAMBOER
        default:
            throw Error(`Ukjent type relasjon til avdoed: ${type}`)
    }
}

export const konverterOpphold = (type: GammelOppholdUtlandType): OppholdUtlandType => {
    switch (type) {
        case GammelOppholdUtlandType.arbeidet:
            return OppholdUtlandType.ARBEIDET
        case GammelOppholdUtlandType.bodd:
            return OppholdUtlandType.BODD
        default:
            throw Error(`Ukjent type opphold utland: ${type}`)
    }
}

export const konverterIngenJobb = (type: IngenJobb): IngenJobbType => {
    switch (type) {
        case IngenJobb.omsorgNaerstaaende:
            return IngenJobbType.OMSORG_NAERSTAAENDE
        case IngenJobb.omsorgBarn:
            return IngenJobbType.OMSORG_BARN
        case IngenJobb.syk:
            return IngenJobbType.SYK
        case IngenJobb.annet:
            return IngenJobbType.ANNET
        case IngenJobb.frivilligArbeid:
            return IngenJobbType.FRIVILLIG_ARBEID
        case IngenJobb.hjemmearbeidende:
            return IngenJobbType.HJEMMEARBEIDEND
    }
}

export const konverterEndringAvInntektGrunn = (type: EndringAvInntektGrunn): EndringAvInntektGrunnType => {
    switch (type) {
        case EndringAvInntektGrunn.oektStillingsprosent:
            return EndringAvInntektGrunnType.OEKT_STILLINGSPROSENT
        case EndringAvInntektGrunn.redusertStillingsprosent:
            return EndringAvInntektGrunnType.REDUSERT_STILLINGSPROSENT
        case EndringAvInntektGrunn.permisjonUtenLoenn:
            return EndringAvInntektGrunnType.PERMISJON_UTEN_LOENN
        case EndringAvInntektGrunn.loennsoekning:
            return EndringAvInntektGrunnType.LOENNSOEKNING
        case EndringAvInntektGrunn.arbeidsledig:
            return EndringAvInntektGrunnType.ARBEIDSLEDIG
        case EndringAvInntektGrunn.sesongarbeid:
            return EndringAvInntektGrunnType.SESONGARBEID
        case EndringAvInntektGrunn.bytteAvJobb:
            return EndringAvInntektGrunnType.BYTTE_AV_JOBB
        case EndringAvInntektGrunn.annenGrunn:
            return EndringAvInntektGrunnType.ANNEN_GRUNN
    }
}

export const konverterPensjonsYtelse = (type: PensjonsYtelse): PensjonsYtelseType => {
    switch (type) {
        case PensjonsYtelse.avtalefestetPensjonOffentlig:
            return PensjonsYtelseType.AVTALEFESTET_PENSJON_OFFENTLIG
        case PensjonsYtelse.avtalefestetPensjonPrivat:
            return PensjonsYtelseType.AVTALEFESTET_PENSJON_PRIVAT
        case PensjonsYtelse.saeralderpensjon:
            return PensjonsYtelseType.SAERALDERSPENSJON
        case PensjonsYtelse.ufoerepensjon:
            return PensjonsYtelseType.UFOEREPENSJON
        case PensjonsYtelse.alderspensjon:
            return PensjonsYtelseType.ALDERSPENSJON
    }
}

export const konverterPensjonEllerTrygd = (type: PensjonEllerTrygd): PensjonEllerTrygdType => {
    switch (type) {
        case PensjonEllerTrygd.tjenestepensjonsordning:
            return PensjonEllerTrygdType.TJENESTEPENSJONSORDNING
        case PensjonEllerTrygd.ufoeretrygdFraNAV:
            return PensjonEllerTrygdType.UFOEREPENSJON_FRA_NAV
        case PensjonEllerTrygd.alderspensjonFraNAV:
            return PensjonEllerTrygdType.ALDERSPENSJON_FRA_NAV
    }
}

export const konverterInntektEllerUtbetaling = (type: InntektEllerUtbetaling): InntektEllerUtbetalingType => {
    switch (type) {
        case InntektEllerUtbetaling.dagspenger:
            return InntektEllerUtbetalingType.DAGSPENGER
        case InntektEllerUtbetaling.sykepenger:
            return InntektEllerUtbetalingType.SYKEPENGER
        case InntektEllerUtbetaling.pleiepenger:
            return InntektEllerUtbetalingType.PLEIEPENGER
        case InntektEllerUtbetaling.svangerskapspenger:
            return InntektEllerUtbetalingType.SVANGERSKAPSPENGER
        case InntektEllerUtbetaling.foreldrepenger:
            return InntektEllerUtbetalingType.FORELDREPENGER
        case InntektEllerUtbetaling.arbeidsavklaringspenger:
            return InntektEllerUtbetalingType.ARBEIDSAVKLARINGSPENGER
        case InntektEllerUtbetaling.kvalifiseringsstoenad:
            return InntektEllerUtbetalingType.KVALIFISERINGSSTOENAD
        case InntektEllerUtbetaling.kommunalOmsorgsstoenad:
            return InntektEllerUtbetalingType.KOMMUNAL_OMSORGSSTOENAD
        case InntektEllerUtbetaling.fosterhjemsgodtgjoering:
            return InntektEllerUtbetalingType.FOSTERHJEMSGODTGJOERING
        case InntektEllerUtbetaling.omsorgspenger:
            return InntektEllerUtbetalingType.OMSORGSPENGER
        case InntektEllerUtbetaling.opplaeringspenger:
            return InntektEllerUtbetalingType.OPPLAERINGSPENGER
        case InntektEllerUtbetaling.alderspensjon:
            return InntektEllerUtbetalingType.ALDERSPENSJON
        case InntektEllerUtbetaling.annen:
            return InntektEllerUtbetalingType.ANNEN
    }
}

export const konverterSoekteYtelserAndre = (type: SoekbareYtelserAndre): SoekbareYtelserAndreType => {
    switch (type) {
        case SoekbareYtelserAndre.avtalefestetPensjonOffentlig:
            return SoekbareYtelserAndreType.AVTALEFESTET_PENSJON_OFFENTLIG
        case SoekbareYtelserAndre.avtalefestetPensjonPrivat:
            return SoekbareYtelserAndreType.AVTALEFESTET_PENSJON_PRIVAT
        case SoekbareYtelserAndre.saeralderpensjon:
            return SoekbareYtelserAndreType.SAERALDERSPENSJON
        case SoekbareYtelserAndre.ufoerepensjon:
            return SoekbareYtelserAndreType.UFOEREPENSJON
        case SoekbareYtelserAndre.alderspensjon:
            return SoekbareYtelserAndreType.ALDERSPENSJON
    }
}

export const konverterSoekteYtelserNAV = (type: SoekbareYtelserNAV): SoekbareYtelserNAVType => {
    switch (type) {
        case SoekbareYtelserNAV.dagspenger:
            return SoekbareYtelserNAVType.DAGSPENGER
        case SoekbareYtelserNAV.sykepenger:
            return SoekbareYtelserNAVType.SYKEPENGER
        case SoekbareYtelserNAV.pleiepenger:
            return SoekbareYtelserNAVType.PLEIEPENGER
        case SoekbareYtelserNAV.svangerskapspenger:
            return SoekbareYtelserNAVType.SVANGERSKAPSPENGER
        case SoekbareYtelserNAV.foreldrepenger:
            return SoekbareYtelserNAVType.FORELDREPENGER
        case SoekbareYtelserNAV.arbeidsavklaringspenger:
            return SoekbareYtelserNAVType.ARBEIDSAVKLARINGSPENGER
        case SoekbareYtelserNAV.kvalifiseringsstoenad:
            return SoekbareYtelserNAVType.KVALIFISERINGSSTOENAD
        case SoekbareYtelserNAV.kommunalOmsorgsstoenad:
            return SoekbareYtelserNAVType.KOMMUNAL_OMSORGSSTOENAD
        case SoekbareYtelserNAV.fosterhjemsgodtgjoering:
            return SoekbareYtelserNAVType.FOSTERHJEMSGODTGJOERING
        case SoekbareYtelserNAV.omsorgspenger:
            return SoekbareYtelserNAVType.OMSORGSPENGER
        case SoekbareYtelserNAV.opplaeringspenger:
            return SoekbareYtelserNAVType.OPPLAERINGSPENGER
        case SoekbareYtelserNAV.ufoerepensjon:
            return SoekbareYtelserNAVType.UFOEREPENSJON
        case SoekbareYtelserNAV.alderspensjon:
            return SoekbareYtelserNAVType.ALDERSPENSJON
    }
}
export const konverterArbeidsmengde = (type: Arbeidsmengde): ArbeidsmengdeType => {
    switch (type) {
        case Arbeidsmengde.prosent:
            return ArbeidsmengdeType.PROSENT
        case Arbeidsmengde.timer:
            return ArbeidsmengdeType.TIMER
    }
}

export const konverterSagtOppEllerRedusert = (type: SagtOppEllerRedusert): SagtOppEllerRedusertType => {
    switch (type) {
        case SagtOppEllerRedusert.oppsagt:
            return SagtOppEllerRedusertType.OPPSAGT
        case SagtOppEllerRedusert.redusert:
            return SagtOppEllerRedusertType.REDUSERT
        case SagtOppEllerRedusert.nei:
            return SagtOppEllerRedusertType.NEI
    }
}

export const konverterStudieform = (type: Studieform): StudieformType => {
    switch (type) {
        case Studieform.heltid:
            return StudieformType.HELTID
        case Studieform.deltid:
            return StudieformType.DELTID
    }
}
