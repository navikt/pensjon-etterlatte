import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { SoknadProvider, useSoknadContext } from './SoknadContext'
import { ActionTypes, tomSoeknad } from './soknad'

const setup = () => {
    const wrapper = ({ children }) => <SoknadProvider>{children}</SoknadProvider>

    return renderHook(() => useSoknadContext(), { wrapper })
}

describe('Reducer fungerer som forventet', () => {
    test('Lagre søknad', () => {
        const { result } = setup()

        const now = new Date()

        act(() => {
            result.current.dispatch({ type: ActionTypes.LAGRE_SOEKNAD, payload: now })
        })

        expect(result.current.state.klarForLagring).toBeFalsy()
        expect(result.current.state.sistLagretDato).toBe(now)
    })

    test('Tilbakestill søknad', () => {
        const { result } = setup()

        act(() => {
            result.current.dispatch({ type: ActionTypes.TILBAKESTILL })
        })

        expect(result.current.state).toBe(tomSoeknad)
    })

    test('Hent søknad', () => {
        const { result } = setup()

        const soeknad = {
            ...tomSoeknad,
            harSamtykket: true,
            sistLagretDato: new Date(),
            omDeg: { erValidert: true },
        }

        act(() => {
            result.current.dispatch({ type: ActionTypes.HENT_SOEKNAD, payload: soeknad })
        })

        expect(result.current.state.klarForLagring).toBeFalsy()
        expect(result.current.state).toStrictEqual({
            ...tomSoeknad,
            harSamtykket: soeknad.harSamtykket,
            sistLagretDato: soeknad.sistLagretDato,
            visFortsettSoeknadModal: true,
        })
    })

    test('Gjenoppretter skjemadata og aktivt steg fra kladden', () => {
        const { result } = setup()
        const soeknad = {
            ...tomSoeknad,
            harSamtykket: true,
            aktivtSteg: 'inntekt',
            skjema: { situasjonenDinIDag: { nySivilstand: 'INGEN_AV_DELENE' } },
        }
        act(() => result.current.dispatch({ type: ActionTypes.HENT_SOEKNAD, payload: soeknad }))
        expect(result.current.state.aktivtSteg).toBe('inntekt')
        expect(result.current.state.skjema).toEqual(soeknad.skjema)
    })

    test('Gamle kladder uten steg og skjemadata starter på personopplysninger', () => {
        const { result } = setup()
        act(() =>
            result.current.dispatch({
                type: ActionTypes.HENT_SOEKNAD,
                payload: { harSamtykket: true, aktivtSteg: 'utgaatt-steg' },
            })
        )
        expect(result.current.state.aktivtSteg).toBe('personopplysninger')
        expect(result.current.state.skjema).toEqual({})
    })
})
