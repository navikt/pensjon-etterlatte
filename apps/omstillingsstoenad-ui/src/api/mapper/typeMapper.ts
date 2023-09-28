import { JobbStatus, Utdanning as GammelUtdanning } from '../../typer/situasjon'
import { IngenJobb, StillingType as GammelStillingType } from '../../typer/arbeidsforhold'
import {
    EndringAvInntektGrunnType,
    ForholdTilAvdoedeType,
    HoeyesteUtdanning,
    IngenJobbType,
    InntektType,
    JobbStatusType,
    OppholdUtlandType,
    SivilstatusType,
    SoekbareYtelserAndreType, SoekbareYtelserNAVType,
    StillingType,
    Ytelser,
} from '../dto/FellesOpplysninger'
import {
    ForholdTilAvdoede as RelasjonAvdoed,
    OppholdUtlandType as GammelOppholdUtlandType,
    SamboerInntekt as GammelSamboerInntekt,
    Sivilstatus,
} from '../../typer/person'
import { Ytelser as GamleYtelser } from '../../typer/ytelser'
import { EndringAvInntektGrunn, SoekbareYtelserAndre, SoekbareYtelserNAV } from '../../typer/inntekt'

export const konverterStillingType = (type: GammelStillingType): StillingType => {
    switch (type) {
        case GammelStillingType.fast:
            return StillingType.FAST
        case GammelStillingType.midlertidig:
            return StillingType.MIDLERTIDIG
        case GammelStillingType.sesongarbeid:
            return StillingType.SESONGARBEID
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

export const konverterSamboerInntekt = (type: GammelSamboerInntekt): InntektType => {
    switch (type) {
        case GammelSamboerInntekt.pensjon:
            return InntektType.PENSJON
        case GammelSamboerInntekt.kapitalinntekt:
            return InntektType.KAPITALINNTEKT
        case GammelSamboerInntekt.arbeidsinntekt:
            return InntektType.ARBEIDSINNTEKT
        case GammelSamboerInntekt.andreYtelser:
            return InntektType.ANDRE_YTELSER
        default:
            throw Error(`Ukjent type inntekt: ${type}`)
    }
}

export const konverterSivilstatus = (type: Sivilstatus): SivilstatusType => {
    switch (type) {
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
