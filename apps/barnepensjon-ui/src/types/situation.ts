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

export enum EducationType {
    BELOW50 = 'BELOW50',
    OVER50 = 'OVER50',
}

export enum ApplicationReasonType {
    EDUCATION = 'EDUCATION',
    APPRENTICE = 'APPRENTICE',
    INTERNSHIP = 'INTERNSHIP',
}

export interface ISituationChild {
    doYouHaveIncome?: JaNeiVetIkke
    timeUsedForEducation?: EducationType
    whyDoYouApply?: ApplicationReasonType[]
    erValidert?: boolean
}
