import { TFunction } from '../../hooks/useTranslation'
import { IChild } from '../../types/person'
import { User } from '../../context/user/user'
import { BetingetOpplysning, EnumSvar, JaNeiVetIkke } from './FellesOpplysninger'
import { PersonType, Verge } from './Person'

export const mapVerge = (
    t: TFunction,
    child: IChild,
    user: User
): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined => {
    if (!!child.childHasGuardianship?.answer) {
        return {
            spoersmaal: t('childHasGuardian', { ns: 'aboutChildren' }),
            svar: {
                innhold: t(child.childHasGuardianship!!.answer!!, { ns: 'radiobuttons' }),
                verdi: child.childHasGuardianship!!.answer!!,
            },
            opplysning: mapFromChildDetails(t, child),
        }
    } else if (!!child.loggedInUserIsGuardian) {
        return {
            spoersmaal: t('loggedInUserIsGuardian', { ns: 'aboutChildren' }),
            svar: {
                innhold: t(child.loggedInUserIsGuardian!!, { ns: 'radiobuttons' }),
                verdi: child.loggedInUserIsGuardian!!,
            },
            opplysning: mapFromLoggedInUser(t, child, user),
        }
    } else return undefined
}

const mapFromChildDetails = (t: TFunction, child: IChild): Verge | undefined => {
    return child.childHasGuardianship?.answer === JaNeiVetIkke.JA
        ? {
              type: PersonType.VERGE,
              fornavn: child.childHasGuardianship!!.firstName
                  ? {
                        spoersmaal: t('guardianFirstName', { ns: 'aboutChildren' }),
                        svar: child.childHasGuardianship!!.firstName,
                    }
                  : undefined,
              etternavn: child.childHasGuardianship!!.lastName
                  ? {
                        spoersmaal: t('guardianLastName', { ns: 'aboutChildren' }),
                        svar: child.childHasGuardianship!!.lastName,
                    }
                  : undefined,
              foedselsnummer: child.childHasGuardianship!!.fnr
                  ? {
                        spoersmaal: t('guardianFnr', { ns: 'aboutChildren' }),
                        svar: child.childHasGuardianship!!.fnr,
                    }
                  : undefined,
          }
        : undefined
}

const mapFromLoggedInUser = (t: TFunction, child: IChild, user: User): Verge | undefined => {
    return child.loggedInUserIsGuardian === JaNeiVetIkke.JA
        ? {
              type: PersonType.VERGE,
              fornavn: {
                  spoersmaal: t('firstName', { ns: 'common' }),
                  svar: user.fornavn!!,
              },
              etternavn: {
                  spoersmaal: t('lastName', { ns: 'common' }),
                  svar: user.etternavn!!,
              },
              foedselsnummer: {
                  spoersmaal: t('fnr', { ns: 'common' }),
                  svar: user.foedselsnummer!!,
              },
          }
        : undefined
}
