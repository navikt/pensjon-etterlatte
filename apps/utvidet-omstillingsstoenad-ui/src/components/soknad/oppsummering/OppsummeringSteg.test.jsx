import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axe from 'axe-core'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lagreKladd, sendSoeknad } from '../../../api/api'
import { SoknadProvider, useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes, tomSoeknad } from '../../../context/soknad/soknad'
import i18n from '../../../i18n'
import en from '../../../locales/en'
import nb from '../../../locales/nb'
import nn from '../../../locales/nn'
import SoknadDialog from '../SoknadDialog'
import SoknadKvittering from '../SoknadKvittering'
import { OppsummeringSteg } from './OppsummeringSteg'

const mocks = vi.hoisted(() => ({
    bruker: { fornavn: 'KALD', etternavn: 'FOLK', foedselsnummer: '24876696580' },
    logEvent: vi.fn(),
}))
vi.mock('../../../api/api', () => ({ lagreKladd: vi.fn(), sendSoeknad: vi.fn() }))
vi.mock('../../../context/bruker/BrukerContext', () => ({
    useBrukerContext: () => ({ state: mocks.bruker, dispatch: vi.fn() }),
}))
vi.mock('../../../hooks/useAnalytics', () => ({
    LogEvents: { SEND_SOKNAD: 'send soknad' },
    useAnalytics: () => ({ logEvent: mocks.logEvent }),
}))
vi.mock('../../../hooks/useLanguage', () => ({ useLanguage: vi.fn() }))

const kladd = {
    ...tomSoeknad,
    harSamtykket: true,
    spraak: 'nb',
    aktivtSteg: 'oppsummering',
    skjema: {
        situasjonenDinIDag: { nySivilstand: 'INGEN_AV_DELENE' },
        utdanningOgTiltak: { aktivitet: 'INGEN' },
        inntekt: {
            arbeidsinntekt: '250 000',
            naeringsinntekt: '0',
            inntektFraUtland: '0',
            andreInntekter: { valg: 'NEI' },
            noeSomKanPaavirkeInntekten: { valg: 'NEI' },
        },
    },
}

const Klargjort = ({ soeknad, children }) => {
    const { dispatch } = useSoknadContext()
    const [klar, settKlar] = useState(false)
    useEffect(() => {
        dispatch({ type: ActionTypes.OPPDATER_KLADD, payload: soeknad })
        settKlar(true)
    }, [dispatch, soeknad])
    return klar ? children : null
}

const Status = () => {
    const { state } = useSoknadContext()
    return <output data-testid="status">{JSON.stringify({ path: useLocation().pathname, state })}</output>
}

const setup = (soeknad = kladd) =>
    render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter initialEntries={['/skjema/steg/oppsummering']}>
                <SoknadProvider>
                    <Klargjort soeknad={soeknad}>
                        <Routes>
                            <Route path="/skjema/steg" element={<SoknadDialog />}>
                                <Route path="oppsummering" element={<OppsummeringSteg />} />
                                <Route path="dokumentasjon" element={<p>Dokumentasjon</p>} />
                            </Route>
                            <Route path="/skjema/sendt" element={<SoknadKvittering />} />
                        </Routes>
                        <Status />
                    </Klargjort>
                </SoknadProvider>
            </MemoryRouter>
        </I18nextProvider>
    )

const status = () => JSON.parse(screen.getByTestId('status').textContent)
const kvittering = () => screen.findByRole('heading', { name: i18n.t('soeknadKvittering.tittel') })

beforeEach(async () => {
    vi.clearAllMocks()
    await i18n.changeLanguage('nb')
    sendSoeknad.mockResolvedValue(200)
    lagreKladd.mockImplementation(async (soeknad) => soeknad)
})
afterEach(cleanup)

describe('Innsending fra oppsummering', () => {
    it.each([
        ['nb', nb],
        ['nn', nn],
        ['en', en],
    ])('sender én søknad med kontraktformat og tekster på %s før kvittering', async (spraak, tekster) => {
        await i18n.changeLanguage(spraak)
        setup({ ...kladd, spraak })
        fireEvent.click(screen.getByRole('button', { name: tekster['knapp.sendSoeknad'] }))

        await kvittering()
        expect(sendSoeknad).toHaveBeenCalledTimes(1)
        const request = sendSoeknad.mock.calls[0][0]
        expect(Object.keys(request)).toEqual(['soeknader'])
        expect(request.soeknader).toHaveLength(1)
        expect(request.soeknader[0]).toMatchObject({
            type: 'UTVIDET_OMSTILLINGSSTOENAD',
            spraak,
            soeker: { fornavn: { svar: 'KALD' }, foedselsnummer: { svar: '24876696580' } },
            inntekt: {
                arbeidsinntekt: {
                    spoersmaal: tekster['kontrakt.arbeidsinntekt'],
                    svar: { innhold: '250000' },
                },
            },
        })
        expect(request.soeknader[0]).not.toHaveProperty('skjema')
        await waitFor(() => expect(status().state).toEqual(tomSoeknad))
        expect(mocks.logEvent).toHaveBeenCalledWith('send soknad', { type: 'UTVIDET_OMSTILLINGSSTOENAD' })
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it('venter på svaret og hindrer dobbel innsending, tilbake og avbryt mens den sender', async () => {
        let fullfoer
        sendSoeknad.mockImplementation(
            () =>
                new Promise((resolve) => {
                    fullfoer = resolve
                })
        )
        setup()
        const knapp = screen.getByRole('button', { name: 'Send søknad' })
        fireEvent.click(knapp)
        fireEvent.click(knapp)
        fireEvent.submit(knapp.closest('form'))
        expect(sendSoeknad).toHaveBeenCalledTimes(1)
        expect(status().path).toBe('/skjema/steg/oppsummering')
        expect(status().state.harSamtykket).toBe(true)
        expect(screen.getByRole('button', { name: nb['knapp.tilbake'] }).disabled).toBe(true)
        expect(screen.getByRole('button', { name: nb['knapp.avbryt'] }).disabled).toBe(true)
        fullfoer(200)
        await kvittering()
    })

    it('beholder søknaden ved feil, fokuserer feilmeldingen og tillater nytt forsøk', async () => {
        sendSoeknad.mockRejectedValueOnce(new Error('nettverksfeil'))
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Send søknad' }))
        const feil = await screen.findByRole('link', { name: nb['oppsummering.feilVedSending'] })
        expect(feil.getAttribute('href')).toBe('#navigasjon-send')
        await waitFor(() =>
            expect(document.activeElement).toBe(screen.getByRole('heading', { name: nb['skjema.feil'] }))
        )
        expect(status().path).toBe('/skjema/steg/oppsummering')
        expect(status().state).toEqual(kladd)
        expect(mocks.logEvent).not.toHaveBeenCalled()
        fireEvent.click(screen.getByRole('button', { name: 'Send søknad' }))
        await kvittering()
        expect(sendSoeknad).toHaveBeenCalledTimes(2)
    })

    it('viser feil uten API-kall når kladden ikke kan mappes til kontrakten', async () => {
        setup({ ...kladd, skjema: {} })
        fireEvent.click(screen.getByRole('button', { name: 'Send søknad' }))
        await screen.findByText(nb['oppsummering.feilVedSending'])
        expect(sendSoeknad).not.toHaveBeenCalled()
        expect(status().state.skjema).toEqual({})
        expect(status().path).toBe('/skjema/steg/oppsummering')
    })

    it('lagrer kladden når brukeren går tilbake uten å sende', async () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: nb['knapp.tilbake'] }))
        await waitFor(() => expect(status().path).toBe('/skjema/steg/dokumentasjon'))
        expect(lagreKladd).toHaveBeenCalledWith({ ...kladd, aktivtSteg: 'dokumentasjon' })
        expect(sendSoeknad).not.toHaveBeenCalled()
    })

    it('har ingen automatiske tilgjengelighetsfeil med send-knapp og sendingsfeil', async () => {
        sendSoeknad.mockRejectedValueOnce(new Error('nettverksfeil'))
        const { container } = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Send søknad' }))
        await screen.findByText(nb['oppsummering.feilVedSending'])
        const result = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(result.violations).toEqual([])
    })
})
