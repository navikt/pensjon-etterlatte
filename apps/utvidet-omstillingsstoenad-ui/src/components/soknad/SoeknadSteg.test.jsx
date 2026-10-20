import { TextField } from '@navikt/ds-react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axe from 'axe-core'
import { useFormContext, useWatch } from 'react-hook-form'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lagreKladd, slettSoeknad } from '../../api/api'
import { SoknadProvider, useSoknadContext } from '../../context/soknad/SoknadContext'
import { SoeknadSteg } from './SoeknadSteg'

vi.mock('../../api/api', () => ({ lagreKladd: vi.fn(), slettSoeknad: vi.fn() }))
vi.mock('../../hooks/useAnalytics', () => ({
    LogEvents: { KLIKK: 'klikk' },
    useAnalytics: () => ({ logEvent: vi.fn() }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key, i18n: { language: 'nb' } }) }))

const Felt = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    return (
        <TextField
            id="person.navn"
            label="Navn"
            error={errors.person?.navn?.message}
            {...register('person.navn', { required: 'Du må fylle ut navn' })}
        />
    )
}

const BetingetFelt = () => {
    const { register, control, setValue } = useFormContext()
    const vis = useWatch({ control, name: 'vis' })
    return (
        <>
            <button type="button" onClick={() => setValue('vis', false)}>
                Skjul felt
            </button>
            {vis && <input aria-label="Betinget felt" {...register('detalj')} />}
        </>
    )
}

const Status = () => {
    const { state } = useSoknadContext()
    return <output data-testid="status">{JSON.stringify({ path: useLocation().pathname, state })}</output>
}

const setup = (defaultValues = {}, oppdater = (state) => state, barn = <Felt />) =>
    render(
        <MemoryRouter initialEntries={['/skjema/steg/personopplysninger']}>
            <SoknadProvider>
                <Routes>
                    <Route
                        path="/skjema/steg/personopplysninger"
                        element={
                            <SoeknadSteg
                                tittel="Personopplysninger"
                                defaultValues={defaultValues}
                                oppdaterSoeknad={(state, data) =>
                                    oppdater({ ...state, aktivtSteg: 'personopplysninger' }, data)
                                }
                                neste="situasjonen-din"
                                forrige="/"
                            >
                                {barn}
                            </SoeknadSteg>
                        }
                    />
                    <Route path="*" element={<p>Neste side</p>} />
                </Routes>
                <Status />
            </SoknadProvider>
        </MemoryRouter>
    )

const status = () => JSON.parse(screen.getByTestId('status').textContent)

beforeEach(() => {
    vi.clearAllMocks()
    lagreKladd.mockImplementation(async (state) => ({ ...state, sistLagretDato: new Date() }))
    HTMLDialogElement.prototype.showModal = function () {
        this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
        this.removeAttribute('open')
    }
})
afterEach(cleanup)

describe('Skjemasteg', () => {
    it('Validerer før lagring, fokuserer feillisten og lenker til feltet', async () => {
        setup()
        fireEvent.click(screen.getByText('knapp.neste'))
        const feil = await screen.findByRole('link', { name: 'Du må fylle ut navn' })
        expect(feil.getAttribute('href')).toBe('#person.navn')
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'skjema.feil' })))
        expect(lagreKladd).not.toHaveBeenCalled()
        expect(status().path).toBe('/skjema/steg/personopplysninger')
    })

    it('Venter på lagring før navigasjon og husker neste steg', async () => {
        let fullfoer
        lagreKladd.mockImplementation(
            (state) =>
                new Promise((resolve) => {
                    fullfoer = () => resolve({ ...state, sistLagretDato: new Date() })
                })
        )
        setup({ person: { navn: 'Test' } })
        fireEvent.click(screen.getByText('knapp.neste'))
        await waitFor(() => expect(lagreKladd).toHaveBeenCalledTimes(1))
        expect(status().path).toBe('/skjema/steg/personopplysninger')
        expect(lagreKladd.mock.calls[0][0].aktivtSteg).toBe('situasjonen-din')
        fullfoer()
        await waitFor(() => expect(status().path).toBe('/skjema/steg/situasjonen-din'))
    })

    it('Beholder svar ved lagringsfeil og lar brukeren prøve igjen', async () => {
        lagreKladd.mockRejectedValueOnce(new Error('nettverksfeil'))
        setup({ person: { navn: 'Test' } })
        fireEvent.click(screen.getByText('knapp.neste'))
        await screen.findByText('skjema.lagringFeilet')
        expect(screen.getByLabelText('Navn').value).toBe('Test')
        expect(status().path).toBe('/skjema/steg/personopplysninger')
        fireEvent.click(screen.getByText('knapp.neste'))
        await waitFor(() => expect(status().path).toBe('/skjema/steg/situasjonen-din'))
    })

    it('Forrige steg lagrer uten å kreve at alle felt er besvart', async () => {
        setup()
        fireEvent.click(screen.getByText('knapp.tilbake'))
        await waitFor(() => expect(status().path).toBe('/'))
        expect(lagreKladd).toHaveBeenCalledTimes(1)
    })

    it('Lagrer også ved Enter i skjemaet', async () => {
        setup({ person: { navn: 'Test' } })
        fireEvent.submit(screen.getByLabelText('Navn').closest('form'))
        await waitFor(() => expect(status().path).toBe('/skjema/steg/situasjonen-din'))
    })

    it('Fjerner betingede felt fra skjemadata når feltet skjules', async () => {
        const oppdater = vi.fn((state) => state)
        setup({ vis: true, detalj: 'Gammelt svar' }, oppdater, <BetingetFelt />)
        expect(screen.getByLabelText('Betinget felt').value).toBe('Gammelt svar')
        fireEvent.click(screen.getByText('Skjul felt'))
        fireEvent.click(screen.getByText('knapp.neste'))
        await waitFor(() => expect(oppdater).toHaveBeenCalled())
        expect(oppdater.mock.calls[0][1]).toEqual({ vis: false })
    })

    it('Slettefeil vises i modalen uten å nullstille søknaden', async () => {
        slettSoeknad.mockRejectedValueOnce(new Error('nettverksfeil'))
        setup({ person: { navn: 'Test' } })
        fireEvent.click(screen.getByText('knapp.avbryt'))
        fireEvent.click(await screen.findByText('avbrytModal.svarSlett'))
        expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'skjema.avslutningFeilet')
        expect(slettSoeknad).toHaveBeenCalledTimes(1)
        expect(status().path).toBe('/skjema/steg/personopplysninger')
        expect(screen.getByLabelText('Navn').value).toBe('Test')
    })

    it('Fortsett senere krever vellykket lagring før avslutning', async () => {
        lagreKladd.mockRejectedValueOnce(new Error('nettverksfeil'))
        setup()
        fireEvent.click(screen.getByText('knapp.avbryt'))
        fireEvent.click(await screen.findByText('avbrytModal.svarJa'))
        expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'skjema.avslutningFeilet')
        expect(lagreKladd).toHaveBeenCalledTimes(1)
        expect(status().path).toBe('/skjema/steg/personopplysninger')
    })

    it('Har ingen automatiske tilgjengelighetsfeil i skjemasteget', async () => {
        const { container } = setup()
        const result = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(result.violations).toEqual([])
    })
})
