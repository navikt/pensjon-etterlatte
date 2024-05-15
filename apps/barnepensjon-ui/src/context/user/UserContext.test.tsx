import { act } from '@testing-library/react-hooks'
import { renderHook } from '@testing-library/react'
import { ActionTypes, User } from './user'
import { UserProvider, useUserContext } from './UserContext'
import React from 'react'
import { FCProps } from '../../types/FCProps'

const setup = () => {
    const wrapper: React.FC<FCProps> = ({ children }) => <UserProvider>{children}</UserProvider>

    return renderHook(() => useUserContext(), { wrapper })
}

describe('Bruker-reducer fungerer som forventet', () => {
    test('Henting av bruker', () => {
        const { result } = setup()

        const user: User = {
            fornavn: 'SEDAT',
            etternavn: 'RIPSBÆRBUSK',
            foedselsnummer: '26117512737',
            foedselsaar: 1975,
            foedselsdato: new Date(1975, 10, 26),
            adresse: 'Fyrstikkaléen 1',
            husnummer: '1',
            husbokstav: undefined,
            postnummer: '0758',
            poststed: 'Oslo',
            statsborgerskap: 'Norsk',
            sivilstatus: 'Ugift',
            kanSoeke: true,
            alder: 65,
        }

        act(() => {
            result.current.dispatch({ type: ActionTypes.SET_USER, payload: user })
        })

        expect(result.current.state).toStrictEqual(user)
    })

    test('Tilbakestill søknad', () => {
        const { result } = setup()

        act(() => {
            result.current.dispatch({ type: ActionTypes.RESET })
        })

        expect(result.current.state).toStrictEqual({})
    })
})
