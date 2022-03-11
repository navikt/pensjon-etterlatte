import { TFunction } from '../../hooks/useTranslation'
import { Barnepensjon, SoeknadType } from './InnsendtSoeknad'
import { IApplication } from '../../context/application/application'
import { Barn, Innsender, PersonType, Verge } from './Person'
import { User } from '../../context/user/user'
import { BetingetOpplysning, EnumSvar, JaNeiVetIkke, Utenlandsadresse } from './FellesOpplysninger'
import { IChild } from '../../types/person'
import { Language } from '../../context/language/language'

export const mapTilBarnepensjonSoeknadListe = (
    t: TFunction,
    application: IApplication,
    bruker: User
): Barnepensjon[] => {
    return application
        .aboutChildren!!.child!!.filter((barnet) => barnet.childrensPension?.applies === JaNeiVetIkke.JA)
        .map((barnet) => mapTilBarnepensjonSoeknad(t, barnet, application, bruker))
}

const mapTilBarnepensjonSoeknad = (
    t: TFunction,
    child: IChild,
    application: IApplication,
    user: User
): Barnepensjon => {
    const innsender: Innsender = {
        type: PersonType.INNSENDER,
        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: user.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: user.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: user.foedselsnummer!!,
        },
    }

    const siblings: Barn[] = application
        .aboutChildren!!.child!!.filter((child: IChild) => child.fnr !== user.foedselsnummer)
        .map((child) => mapBarn(t, child, application, user))

    /*
     * TODO:
     *  Må legge til "Din situasjon" på barnet.
     */
    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: Language.BOKMAAL, // TODO: Lagre språk i søknad

        innsender,
        harSamtykket: {
            spoersmaal: '',
            svar: !!application.applicant?.consent,
        },
        utbetalingsInformasjon: undefined, // hentUtbetalingsInformasjonBarn(t, child, application),

        soeker: mapBarn(t, child, application, user),
        foreldre: [], // hentForeldreMedUtvidetInfo(t, child, application, user),
        soesken: siblings,
    }
}

const mapBarn = (t: TFunction, child: IChild, soeknad: IApplication, bruker: User): Barn => {
    const staysAbroad: JaNeiVetIkke = child.staysAbroad!!.answer!!

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> = {
        spoersmaal: t('omBarn.bosattUtland.svar'),
        svar: {
            innhold: t(staysAbroad),
            verdi: staysAbroad,
        },
    }

    if (staysAbroad === JaNeiVetIkke.JA) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t('omBarn.bosattUtland.land'),
                svar: {
                    innhold: child.staysAbroad!!.country!!,
                },
            },
            adresse: {
                spoersmaal: t('omBarn.bosattUtland.adresse'),
                svar: {
                    innhold: child.staysAbroad!!.address!!,
                },
            },
        }
    }

    let verge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined
    if (!!child.childHasGuardianship?.answer) {
        const opplysningOmVerge: Verge | undefined =
            child.childHasGuardianship?.answer === JaNeiVetIkke.JA
                ? {
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
                : undefined

        verge = {
            spoersmaal: t('omBarn.harBarnetVerge.svar'),
            svar: {
                innhold: t(child.childHasGuardianship!!.answer, { ns: 'radiobuttons' }),
                verdi: child.childHasGuardianship!!.answer,
            },
            opplysning: opplysningOmVerge,
        }
    }

    return {
        type: PersonType.BARN,
        fornavn: {
            spoersmaal: t('omBarn.fornavn'),
            svar: child.firstName!!,
        },
        etternavn: {
            spoersmaal: t('omBarn.etternavn'),
            svar: child.lastName!!,
        },
        foedselsnummer: {
            spoersmaal: t('omBarn.foedselsnummer'),
            svar: child.fnr!!,
        },
        statsborgerskap: {
            spoersmaal: t('omBarn.statsborgerskap'),
            svar: child.citizenship!!,
        },
        utenlandsAdresse,
        foreldre: [], //hentForeldre(t, barn, soeknad, bruker),
        verge,
        dagligOmsorg: undefined, // hentDagligOmsorg(t, barn),
    }
}
