import { mapVerge } from './mapVerge'
import { IChild } from '../../types/person'
import { User } from '../../context/user/user'
import { JaNeiVetIkke } from './FellesOpplysninger'

const t = (key: string, _: any) => key
const user: User = {
    fornavn: 'Stor',
    etternavn: 'Snerk',
    foedselsnummer: '12345678',
}

describe('mapVerge', () => {
    it('should map guardian from child information', () => {
        const childWithGuardian: IChild = {
            childHasGuardianship: {
                answer: JaNeiVetIkke.JA,
                firstName: 'Liten',
                lastName: 'Maskin',
                fnr: '87654321',
            },
        }

        const guardian = mapVerge(t, childWithGuardian, user)

        expect(guardian?.spoersmaal).toBe('childHasGuardian')
        expect(guardian?.svar.verdi).toBe(JaNeiVetIkke.JA)
        expect(guardian?.opplysning?.fornavn?.svar).toBe(childWithGuardian.childHasGuardianship!.firstName)
        expect(guardian?.opplysning?.etternavn?.svar).toBe(childWithGuardian.childHasGuardianship!.lastName)
        expect(guardian?.opplysning?.foedselsnummer?.svar).toBe(childWithGuardian.childHasGuardianship!.fnr)
    })

    it('should map guardian question child information', () => {
        const childWithoutGuardian: IChild = {
            childHasGuardianship: {
                answer: JaNeiVetIkke.NEI,
                firstName: 'Liten',
                lastName: 'Maskin',
                fnr: '87654321',
            },
        }

        const guardian = mapVerge(t, childWithoutGuardian, user)

        expect(guardian?.spoersmaal).toBe('childHasGuardian')
        expect(guardian?.svar.verdi).toBe(JaNeiVetIkke.NEI)
        expect(guardian?.opplysning).toBeFalsy()
    })

    it('should map guardian from logged in user', () => {
        const child: IChild = {
            loggedInUserIsGuardian: JaNeiVetIkke.JA,
        }

        const guardian = mapVerge(t, child, user)

        expect(guardian?.spoersmaal).toBe('loggedInUserIsGuardian')
        expect(guardian?.svar.verdi).toBe(JaNeiVetIkke.JA)
        expect(guardian?.opplysning?.fornavn?.svar).toBe(user.fornavn)
        expect(guardian?.opplysning?.etternavn?.svar).toBe(user.etternavn)
        expect(guardian?.opplysning?.foedselsnummer?.svar).toBe(user.foedselsnummer)
    })

    it('should map guardian question when logged in user is a guardian', () => {
        const child: IChild = {
            loggedInUserIsGuardian: JaNeiVetIkke.NEI,
        }

        const guardian = mapVerge(t, child, user)

        expect(guardian?.spoersmaal).toBe('loggedInUserIsGuardian')
        expect(guardian?.svar.verdi).toBe(JaNeiVetIkke.NEI)
        expect(guardian?.opplysning).toBeFalsy()
    })

    it('should return undefined when no guardian question has been asked', () => {
        const child: IChild = {}

        const guardian = mapVerge(t, child, user)

        expect(guardian).toBeFalsy()
    })
})
