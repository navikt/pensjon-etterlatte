import { StillingType as GammelStillingType, IngenJobb } from '../../typer/arbeidsforhold'
import { GrunnTilPaavirkelseAvInntekt, SoekbareYtelserAndre, SoekbareYtelserNAV } from '../../typer/inntekt'
import {
    OppholdUtlandType as GammelOppholdUtlandType,
    ForholdTilAvdoede as RelasjonAvdoed,
    Sivilstatus,
} from '../../typer/person'
import { Utdanning as GammelUtdanning, JobbStatus } from '../../typer/situasjon'
import { Studieform } from '../../typer/utdanning'
import {
    EndringAvInntektGrunnType,
    ForholdTilAvdoedeType,
    HoeyesteUtdanning,
    IngenJobbType,
    JobbStatusType,
    OppholdUtlandType,
    SivilstatusType,
    SoekbareYtelserAndreType,
    SoekbareYtelserNAVType,
    StillingType,
    StudieformType,
} from '../dto/FellesOpplysninger'

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

export const konverterTilHoyesteUtdanning = (type: string | GammelUtdanning): HoeyesteUtdanning => {
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
        case JobbStatus.selvstendig:
            return JobbStatusType.SELVSTENDIG
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

export const konverterGrunnTilPaavirkelseAvInntekt = (
    type: GrunnTilPaavirkelseAvInntekt
): EndringAvInntektGrunnType => {
    switch (type) {
        case GrunnTilPaavirkelseAvInntekt.oektStillingsprosent:
            return EndringAvInntektGrunnType.OEKT_STILLINGSPROSENT
        case GrunnTilPaavirkelseAvInntekt.redusertStillingsprosent:
            return EndringAvInntektGrunnType.REDUSERT_STILLINGSPROSENT
        case GrunnTilPaavirkelseAvInntekt.permisjonUtenLoenn:
            return EndringAvInntektGrunnType.PERMISJON_UTEN_LOENN
        case GrunnTilPaavirkelseAvInntekt.loennsoekning:
            return EndringAvInntektGrunnType.LOENNSOEKNING
        case GrunnTilPaavirkelseAvInntekt.arbeidsledig:
            return EndringAvInntektGrunnType.ARBEIDSLEDIG
        case GrunnTilPaavirkelseAvInntekt.sesongarbeid:
            return EndringAvInntektGrunnType.SESONGARBEID
        case GrunnTilPaavirkelseAvInntekt.bytteAvJobb:
            return EndringAvInntektGrunnType.BYTTE_AV_JOBB
        case GrunnTilPaavirkelseAvInntekt.annenGrunn:
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
        case SoekbareYtelserNAV.ufoeretrygd:
            return SoekbareYtelserNAVType.UFOERETRYGD
        case SoekbareYtelserNAV.alderspensjon:
            return SoekbareYtelserNAVType.ALDERSPENSJON
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
