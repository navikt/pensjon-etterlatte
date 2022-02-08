import { act, renderHook } from '@testing-library/react-hooks'
import { ActionTypes } from './bruker'
import { BrukerProvider, useBrukerContext } from './BrukerContext'

const setup = () => {
    const wrapper = ({ children }) => <BrukerProvider>{children}</BrukerProvider>

    return renderHook(() => useBrukerContext(), { wrapper })
}

describe('Bruker-reducer fungerer som forventet', () => {
    test('Henting av bruker', () => {
        const { result } = setup()

        const person = {
            fornavn: 'SEDAT',
            etternavn: 'RIPSBÆRBUSK',
            foedselsnummer: '26117512737',
            foedselsaar: 1975,
            foedselsdato: new Date(1975, 10, 26),
            adresse: 'Fyrstikkaléen 1',
            husnummer: 1,
            husbokstav: null,
            postnummer: '0758',
            poststed: 'Oslo',
            statsborgerskap: 'Norsk',
            sivilstatus: 'Ugift',
        }

        const bruker = {
            ...person,
            kanSoeke: true,
            alder: 65,
        }

        act(() => {
            result.current.dispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: bruker })
        })

        expect(result.current.state).toStrictEqual(bruker)
    })

    test('Tilbakestill søknad', () => {
        const { result } = setup()

        act(() => {
            result.current.dispatch({ type: ActionTypes.TILBAKESTILL })
        })

        expect(result.current.state).toStrictEqual({})
    })
})
