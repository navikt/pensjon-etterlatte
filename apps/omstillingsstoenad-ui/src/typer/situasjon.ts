import {
    IArbeidsforhold,
    IEtablererVirksomhet,
    ITilbudOmJobb,
    IArbeidssoeker,
    IAnnenSituasjon,
    ISelvstendigNaeringsdrivende,
} from './arbeidsforhold'
import { IAndreYtelser } from './ytelser'
import { IValg } from './Spoersmaal'
import { Studieform } from './utdanning'
import { HoeyesteUtdanning } from '../api/dto/FellesOpplysninger'

export interface IUtdanning {
    naavaerendeUtdanning?: {
        studiested?: string
        studie?: string
        studieform?: Studieform
        studieprosent?: string
        startDato?: Date
        sluttDato?: Date
        godkjentUtdanning?: IValg
    }
    soeknadOmSkolepenger?: IValg.JA | undefined
    soeknadOmTilleggsstoenadUtdanning?: IValg.JA | undefined
    hoyesteFullfoerteUtdanning?: HoeyesteUtdanning[]
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
    etablerer = 'jobbStatus.etablerer',
    tilbud = 'jobbStatus.tilbud',
    arbeidssoeker = 'jobbStatus.arbeidssoker',
    underUtdanning = 'jobbStatus.underUtdanning',
    ingen = 'jobbStatus.ingen',
}

export interface IMerOmSituasjonenDin {
    jobbStatus?: JobbStatus[]
    annenSituasjon?: IAnnenSituasjon
    utdanning?: IUtdanning
    selvstendig?: ISelvstendigNaeringsdrivende[]
    arbeidsforhold?: IArbeidsforhold[]
    etablererVirksomhet?: IEtablererVirksomhet
    tilbudOmJobb?: ITilbudOmJobb
    arbeidssoeker?: IArbeidssoeker
    andreYtelser?: IAndreYtelser
    erValidert?: boolean
}
