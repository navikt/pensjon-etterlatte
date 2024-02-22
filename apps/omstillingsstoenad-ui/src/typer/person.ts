import { IValg } from './Spoersmaal'
import { IUtbetalingsInformasjon } from './utbetaling'

export enum Sivilstatus {
    enke = 'nySivilstatus.enke',
    ekteskap = 'nySivilstatus.ekteskap',
    enslig = 'nySivilstatus.enslig',
    samboerskap = 'nySivilstatus.samboerskap',
}

export enum ForholdTilAvdoede {
    gift = 'avdoede.relasjon.gift',
    separert = 'avdoede.relasjon.separert',
    samboer = 'avdoede.relasjon.samboer',
    skilt = 'avdoede.relasjon.skilt',
}

export enum BarnRelasjon {
    fellesbarnMedAvdoede = 'barnRelasjon.fellesbarnMedAvdoede',
    avdoedesSaerkullsbarn = 'barnRelasjon.avdoedesSaerkullsbarn',
    egneSaerkullsbarn = 'barnRelasjon.egneSaerkullsbarn',
}

export enum OppholdUtlandType {
    bodd = 'oppholdUtlandType.bodd',
    arbeidet = 'oppholdUtlandType.arbeidet',
}

export interface ISituasjonenDin {
    nySivilstatus?: INySivilstatus
    omsorgMinstFemti?: IValg
    gravidEllerNyligFoedt?: IValg
    bosattINorge?: IValg
    bosattLand?: string
    oppholderSegIUtlandet?: {
        svar?: IValg
        oppholdsland?: string
        oppholdFra?: Date
        oppholdTil?: Date
    }
    erValidert?: boolean
}

export interface IOmBarn {
    barn?: IBarn[]
    soeknadOmBarnetilsyn?: IValg.JA | undefined
    soeknadOmTilleggsstoenadBarnepass?: IValg.JA | undefined
    erValidert?: boolean
}

export interface IBarn {
    fornavn?: string
    etternavn?: string
    foedselsnummer?: string
    harBarnetVerge?: {
        svar?: IValg
        fornavn?: string
        etternavn?: string
        foedselsnummer?: string
    }
    relasjon?: string
    statsborgerskap?: string
    bosattUtland?: {
        svar?: IValg
        land?: string
        adresse?: string
    }
    dagligOmsorg?: IValg
    barnepensjon?: {
        soeker?: IValg.JA | undefined
        kontonummer?: {
            svar?: IValg
            kontonummer?: string
        }
        forskuddstrekk?: {
            svar?: IValg
            trekkprosent?: string
        }
    }
}

export interface IOppholdUtland {
    land?: string
    fraDato?: Date
    tilDato?: Date
    beskrivelse?: OppholdUtlandType[]
    medlemFolketrygd?: IValg
    mottokPensjon?: {
        beloep?: string
        valuta?: string
    }
}

export interface IAvdoed {
    fornavn?: string
    etternavn?: string
    foedselsnummer?: string
    statsborgerskap?: string
    datoForDoedsfallet?: Date
    boddEllerJobbetUtland?: {
        svar?: IValg
        oppholdUtland?: IOppholdUtland[]
    }
    selvstendigNaeringsdrivende?: {
        svar?: IValg
        beskrivelse?: string
    }
    haddePensjonsgivendeInntekt?: {
        svar?: IValg
        beskrivelse?: string
    }
    doedsfallAarsak?: IValg
    erValidert?: boolean
}

export interface IKontaktinfo {
    telefonnummer?: string
}

export interface INySivilstatus {
    sivilstatus?: Sivilstatus
    samboerskap?: INyttSamboerskap
}

export interface INyttSamboerskap {
    hattBarnEllerVaertGift?: IValg
    samboer?: ISamboer
}

export interface ISamboer {
    fornavn?: string
    etternavn?: string
    foedselsnummer?: string
}

export interface IForholdAvdoede {
    relasjon?: string // 2.9
    datoForInngaattPartnerskap?: Date
    datoForSkilsmisse?: Date
    datoForInngaattSamboerskap?: Date
    datoForSamlivsbrudd?: Date
    fellesBarn?: IValg
    samboereMedFellesBarn?: IValg
    tidligereGift?: IValg
    mottokBidrag?: {
        svar: IValg
        sum?: string
    }
}

export interface ISoeker {
    alternativAdresse?: string
    kontaktinfo?: IKontaktinfo
    utbetalingsInformasjon?: IUtbetalingsInformasjon
    flyktning?: IValg
    erValidert?: boolean
}

export interface ISoekerOgAvdoed {
    forholdTilAvdoede?: IForholdAvdoede
    erValidert?: boolean
}
