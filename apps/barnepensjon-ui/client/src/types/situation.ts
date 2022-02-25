import { IArbeidsforhold, IngenJobb, ISelvstendigNaeringsdrivende } from './workingConditions'
// import { IAndreYtelser } from './ytelser'
import { JaNeiVetIkke } from '../api/dto/FellesOpplysninger'

export interface IUtdanning {
    naavaerendeUtdanning?: {
        navn?: string
        startDato?: Date
        sluttDato?: Date
    }
    soeknadOmSkolepenger?: JaNeiVetIkke.JA | undefined
    soeknadOmTilleggsstoenadUtdanning?: JaNeiVetIkke.JA | undefined
    hoyesteFullfoerteUtdanning?: string
    annenUtdanning?: string
}

export enum Utdanning {
    grunnskole = 'utdanning.grunnskole',
    videregående = 'utdanning.videregående',
    fagbrev = 'utdanning.fagbrev',
    bachelorgrad = 'utdanning.bachelorgrad',
    mastergrad = 'utdanning.mastergrad',
    ingen = 'utdanning.ingen',
    annen = 'utdanning.annen',
}

export enum JobbStatus {
    arbeidstaker = 'jobbStatus.arbeidstaker',
    selvstendig = 'jobbStatus.selvstendig',
    underUtdanning = 'jobbStatus.underUtdanning',
    arbeidssoeker = 'jobbStatus.arbeidssoker',
    ingen = 'jobbStatus.ingen',
}

export interface ISituasjon {
    jobbStatus?: JobbStatus[]
    ingenJobbBeskrivelse?: IngenJobb
    utdanning?: IUtdanning
    selvstendig?: ISelvstendigNaeringsdrivende[]
    arbeidsforhold?: IArbeidsforhold[]
    andreYtelser?: any
    erValidert?: boolean
}
