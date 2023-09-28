import {
    IArbeidsforhold,
    ISelvstendigNaeringsdrivende,
    IEtablererVirksomhet,
    ITilbudOmJobb,
    IArbeidssoeker, IAnnenSituasjon,
} from './arbeidsforhold'
import { IAndreYtelser } from './ytelser'
import { IValg } from './Spoersmaal'
import { Studieform } from './utdanning'

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
    selvstendigENK = 'jobbStatus.selvstendig.enk',
    selvstendigAS = 'jobbStatus.selvstendig.as',
    etablerer = 'jobbStatus.etablerer',
    tilbud = 'jobbStatus.tilbud',
    arbeidssoeker = 'jobbStatus.arbeidssoker',
    underUtdanning = 'jobbStatus.underUtdanning',
    ingen = 'jobbStatus.ingen',
}

export interface ISituasjon {
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
