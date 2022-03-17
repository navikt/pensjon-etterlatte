import { TFunction } from '../../hooks/useTranslation'
import { Barnepensjon, SoeknadType } from './InnsendtSoeknad'
import { IApplication } from '../../context/application/application'
import { Barn, Innsender, Person, PersonType, Verge } from './Person'
import { User } from '../../context/user/user'
import { BetingetOpplysning, EnumSvar, JaNeiVetIkke, Opplysning, Utenlandsadresse } from './FellesOpplysninger'
import { IChild } from '../../types/person'
import { Language } from '../../context/language/language'
import { hentForeldre, mapForeldreMedUtvidetInfo } from './foreldreMapper'

export const mapTilBarnepensjonSoeknadListe = (t: TFunction, application: IApplication, user: User): Barnepensjon[] => {
    const children: IChild[] = application.aboutChildren!!.children!!

    return children
        .filter((child) => !!child.appliesForChildrensPension)
        .map((child) => mapTilBarnepensjonSoeknad(t, child, application, user))
}

const mapTilBarnepensjonSoeknad = (
    t: TFunction,
    child: IChild,
    application: IApplication,
    user: User
): Barnepensjon => {
    const innsender: Innsender = mapInnsender(t, user)

    const harSamtykket: Opplysning<boolean> = mapSamtykke(t, application, user)

    const foreldre: Person[] = mapForeldreMedUtvidetInfo(t, child, application, user)

    const soesken: Barn[] = mapSoesken(t, child, application, user)

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: Language.BOKMAAL, // TODO: Lagre språk i søknad

        innsender,
        harSamtykket,

        // TODO: Fikse utbetaling når oppsett er avklart
        utbetalingsInformasjon: undefined,

        // TODO: Legge til "Din situasjon" på barnet.
        // situasjon: undefined,

        soeker: mapBarn(t, child, application, user),
        foreldre,
        soesken,
    }
}

const mapBarn = (t: TFunction, child: IChild, application: IApplication, user: User): Barn => {
    const staysAbroad: JaNeiVetIkke = child.staysAbroad!!.answer!!

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> = {
        spoersmaal: t('doesTheChildLiveAbroad', { ns: 'aboutChildren' }),
        svar: {
            innhold: t(staysAbroad, { ns: 'radiobuttons' }),
            verdi: staysAbroad,
        },
    }

    if (staysAbroad === JaNeiVetIkke.JA) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t('stayAbroadCountry', { ns: 'aboutChildren' }),
                svar: {
                    innhold: child.staysAbroad!!.country!!,
                },
            },
            adresse: {
                spoersmaal: t('addressAbroad', { ns: 'aboutChildren' }),
                svar: {
                    innhold: child.staysAbroad!!.address!!,
                },
            },
        }
    }

    const verge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined = mapVerge(t, child)

    return {
        type: PersonType.BARN,
        fornavn: {
            spoersmaal: t('firstName', { ns: 'common' }),
            svar: child.firstName!!,
        },
        etternavn: {
            spoersmaal: t('lastName', { ns: 'common' }),
            svar: child.lastName!!,
        },
        foedselsnummer: {
            spoersmaal: t('fnrDnr', { ns: 'common' }),
            svar: child.fnrDnr!!,
        },
        statsborgerskap: {
            spoersmaal: t('citizenship', { ns: 'common' }),
            svar: child.citizenship!!,
        },
        utenlandsAdresse,
        foreldre: hentForeldre(t, child, application, user),
        verge,
    }
}

const mapSoesken = (t: TFunction, child: IChild, application: IApplication, user: User): Barn[] => {
    const allChildren: IChild[] = application.aboutChildren!!.children!!

    // TODO: Sjekke at dette fungerer som forventet
    return allChildren
        .filter((c: IChild) => c.fnrDnr !== child.fnrDnr)
        .map((c: IChild) => mapBarn(t, c, application, user))
}

const mapSamtykke = (t: TFunction, application: IApplication, user: User): Opplysning<boolean> => ({
    spoersmaal: t('consentToNav', { ns: 'frontPage', fornavn: user.fornavn!!, etternavn: user.etternavn!! }),
    svar: !!application.applicant?.consent,
})

const mapInnsender = (t: TFunction, user: User): Innsender => ({
    type: PersonType.INNSENDER,
    fornavn: {
        spoersmaal: t('firstName', { ns: 'common' }),
        svar: user.fornavn!!,
    },
    etternavn: {
        spoersmaal: t('lastName', { ns: 'common' }),
        svar: user.etternavn!!,
    },
    foedselsnummer: {
        spoersmaal: t('fnrDnr', { ns: 'common' }),
        svar: user.foedselsnummer!!,
    },
})

const mapVerge = (t: TFunction, child: IChild): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined => {
    if (!child.childHasGuardianship?.answer) return undefined

    let opplysningOmVerge: Verge | undefined

    if (child.childHasGuardianship!!.answer === JaNeiVetIkke.JA) {
        opplysningOmVerge = {
            type: PersonType.VERGE,
            fornavn: child.childHasGuardianship!!.firstName
                ? {
                      spoersmaal: t('firstName', { ns: 'common' }),
                      svar: child.childHasGuardianship!!.firstName,
                  }
                : undefined,
            etternavn: child.childHasGuardianship!!.lastName
                ? {
                      spoersmaal: t('lastName', { ns: 'common' }),
                      svar: child.childHasGuardianship!!.lastName,
                  }
                : undefined,
            foedselsnummer: child.childHasGuardianship!!.fnr
                ? {
                      spoersmaal: t('fnr', { ns: 'common' }),
                      svar: child.childHasGuardianship!!.fnr,
                  }
                : undefined,
        }
    }

    return {
        spoersmaal: t('childHasGuardian', { ns: 'aboutChildren' }),
        svar: {
            innhold: t(child.childHasGuardianship!!.answer!!, { ns: 'radiobuttons' }),
            verdi: child.childHasGuardianship!!.answer!!,
        },
        opplysning: opplysningOmVerge,
    }
}
