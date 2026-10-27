import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import axe from 'axe-core'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lagreKladd } from '../../../api/api'
import { SoknadProvider, useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes, tomSoeknad } from '../../../context/soknad/soknad'
import i18n from '../../../i18n'
import en from '../../../locales/en'
import nb from '../../../locales/nb'
import nn from '../../../locales/nn'
import { SoeknadStegRute } from '../SoeknadSteg'
import SoknadDialog from '../SoknadDialog'
import { UtdanningOgTiltakSteg } from './UtdanningOgTiltak'

vi.mock('../../../api/api', () => ({ lagreKladd: vi.fn(), slettSoeknad: vi.fn() }))
vi.mock('../../../hooks/useLanguage', () => ({ useLanguage: vi.fn() }))
vi.mock('../../../hooks/useAnalytics', () => ({
    LogEvents: { KLIKK: 'klikk' },
    useAnalytics: () => ({ logEvent: vi.fn() }),
}))

const utdanning = {
    aktivitet: 'UTDANNING',
    utdanning: {
        studiested: 'OsloMet',
        studie: 'Sykepleie',
        startDato: '2026-08-15',
        sluttDato: '2029-06-15',
        studieform: 'DELTID',
        studieprosent: '60',
    },
}
const tiltak = {
    aktivitet: 'ARBEIDSRETTET_TILTAK',
    arbeidsrettetTiltak: { tiltak: 'Arbeidstrening', omfang: 'DELTID' },
    aktivitetsplan: 'NEI',
}
const annetSkjema = { situasjonenDinIDag: { nySivilstand: 'INGEN_AV_DELENE' }, inntekt: { arbeidsinntekt: '123' } }

const Initialiser = ({ state, children }) => {
    const { dispatch } = useSoknadContext()
    const [klar, settKlar] = useState(false)
    useEffect(() => {
        dispatch({ type: ActionTypes.OPPDATER_KLADD, payload: state })
        settKlar(true)
    }, [state, dispatch])
    return klar ? children : null
}

const Status = () => {
    const { state } = useSoknadContext()
    const navigate = useNavigate()
    return (
        <>
            <output data-testid="status">{JSON.stringify({ path: useLocation().pathname, state })}</output>
            <button type="button" onClick={() => navigate('/skjema/steg/utdanning-og-tiltak')}>
                Til utdanning og tiltak
            </button>
        </>
    )
}

const setup = (aktivitet) => {
    const state = {
        ...tomSoeknad,
        harSamtykket: true,
        spraak: i18n.language,
        aktivtSteg: 'utdanning-og-tiltak',
        skjema: { ...annetSkjema, ...(aktivitet ? { utdanningOgTiltak: aktivitet } : {}) },
    }
    return render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter initialEntries={['/skjema/steg/utdanning-og-tiltak']}>
                <SoknadProvider>
                    <Initialiser state={state}>
                        <Routes>
                            <Route path="/skjema/steg" element={<SoknadDialog />}>
                                <Route path="utdanning-og-tiltak" element={<UtdanningOgTiltakSteg />} />
                                {['situasjonen-din', 'inntekt'].map((path) => (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={
                                            <SoeknadStegRute>
                                                <p>Under arbeid</p>
                                            </SoeknadStegRute>
                                        }
                                    />
                                ))}
                            </Route>
                        </Routes>
                        <Status />
                    </Initialiser>
                </SoknadProvider>
            </MemoryRouter>
        </I18nextProvider>
    )
}

const status = () => JSON.parse(screen.getByTestId('status').textContent)
const neste = () => fireEvent.click(screen.getByRole('button', { name: nb['knapp.neste'] }))
const velg = (svar) => fireEvent.click(screen.getByRole('radio', { name: nb[`kontrakt.${svar}`] }))
const fyll = (felt, value) => fireEvent.change(screen.getByLabelText(nb[`kontrakt.${felt}`]), { target: { value } })
const lagret = () => lagreKladd.mock.calls.at(-1)[0].skjema.utdanningOgTiltak
const ventPaaNeste = () => waitFor(() => expect(status().path).toBe('/skjema/steg/inntekt'))
const tilbake = () => fireEvent.click(screen.getByRole('button', { name: 'Til utdanning og tiltak' }))
const feilLenke = (felt) => screen.findByRole('link', { name: nb[`utdanningOgTiltak.feil.${felt}`] })

beforeEach(async () => {
    vi.clearAllMocks()
    await i18n.changeLanguage('nb')
    lagreKladd.mockImplementation(async (state) => ({ ...state, sistLagretDato: new Date() }))
    HTMLDialogElement.prototype.showModal = function () {
        this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
        this.removeAttribute('open')
    }
})
afterEach(cleanup)

describe('Utdanning og tiltak', () => {
    it('Krever aktivitetsvalg og lenker til feltet i feilsammendraget', async () => {
        setup()
        expect(screen.queryByRole('textbox')).toBeNull()
        expect(screen.queryByText(nb['utdanningOgTiltak.advarsel.tittel'])).toBeNull()
        neste()
        expect((await feilLenke('aktivitet')).getAttribute('href')).toBe('#aktivitet')
        expect(document.getElementById('aktivitet')).not.toBeNull()
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it('Viser utdanningsfeltene og krever alle, men spør ikke om aktivitetsplan', async () => {
        setup()
        velg('UTDANNING')
        expect(screen.queryByRole('radiogroup', { name: nb['kontrakt.aktivitetsplan'] })).toBeNull()
        neste()
        for (const felt of ['studiested', 'studie', 'startDato', 'sluttDato', 'studieform']) {
            const lenke = await feilLenke(felt)
            expect(document.getElementById(lenke.getAttribute('href').slice(1))).not.toBeNull()
        }
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each(['studiested', 'studie'])('Avviser blankt og for langt svar i %s', async (felt) => {
        setup(utdanning)
        fyll(felt, '   ')
        neste()
        await feilLenke(felt)
        fyll(felt, 'a'.repeat(201))
        neste()
        await feilLenke('maksLengde')
        expect(lagreKladd).not.toHaveBeenCalled()
        fyll(felt, 'a'.repeat(200))
        neste()
        await ventPaaNeste()
    })

    it.each(['', '101'])('Avviser ugyldig studieprosent "%s"', async (verdi) => {
        setup(utdanning)
        fyll('studieprosent', verdi)
        neste()
        await feilLenke(verdi ? 'studieprosent' : 'studieprosentPaakrevd')
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each(['49', '50'])('Tillater studieprosent %s, også under 50', async (verdi) => {
        setup(utdanning)
        fyll('studieprosent', verdi)
        expect(!!screen.queryByText(nb['utdanningOgTiltak.advarsel.studieprosent'])).toBe(Number(verdi) < 50)
        neste()
        await ventPaaNeste()
        expect(lagret().utdanning.studieprosent).toBe(verdi)
        expect(lagreKladd.mock.calls.at(-1)[0].skjema).toMatchObject(annetSkjema)
    })

    it.each(['startDato', 'sluttDato'])(
        'Bruker ikke gammel gyldig dato når %s tømmes eller blir ugyldig',
        async (felt) => {
            setup(utdanning)
            fyll(felt, '')
            neste()
            await feilLenke(felt)
            fyll(felt, '31.02.2026')
            fireEvent.blur(screen.getByLabelText(nb[`kontrakt.${felt}`]))
            neste()
            await feilLenke(felt)
            expect(screen.getByLabelText(nb[`kontrakt.${felt}`]).value).toBe('31.02.2026')
            expect(lagreKladd).not.toHaveBeenCalled()
        }
    )

    it('Validerer perioden med oppdatert fra dato og tillater like datoer og skuddår', async () => {
        setup(utdanning)
        fyll('startDato', '01.01.2030')
        neste()
        expect((await feilLenke('periode')).getAttribute('href')).toBe('#utdanning.sluttDato')
        expect(screen.getByLabelText(nb['kontrakt.sluttDato']).getAttribute('aria-invalid')).toBe('true')
        expect(screen.getAllByText(nb['utdanningOgTiltak.feil.periode'])).toHaveLength(2)
        expect(lagreKladd).not.toHaveBeenCalled()
        fyll('startDato', '29.02.2028')
        fyll('sluttDato', '29.02.2028')
        neste()
        await ventPaaNeste()
        expect(lagret().utdanning).toMatchObject({ startDato: '2028-02-29', sluttDato: '2028-02-29' })
    })

    it('Gjenoppretter ISO-kladd og lagrede svar etter navigasjon, uten skjulte data', async () => {
        setup({
            ...utdanning,
            aktivitetsplan: 'JA',
            arbeidsrettetTiltak: tiltak.arbeidsrettetTiltak,
        })
        expect(screen.getByLabelText(nb['kontrakt.startDato']).value).toBe('15.08.2026')
        expect(screen.getByLabelText(nb['kontrakt.sluttDato']).value).toBe('15.06.2029')
        neste()
        await ventPaaNeste()
        expect(lagret()).toEqual(utdanning)
        tilbake()
        expect(screen.getByLabelText(nb['kontrakt.studiested']).value).toBe('OsloMet')
        expect(screen.getByLabelText(nb['kontrakt.studieprosent']).value).toBe('60')
        expect(screen.getByRole('radio', { name: nb['kontrakt.DELTID'] }).checked).toBe(true)
    })

    it('Lagrer ufullstendig kladd ved forrige steg uten gammel eller ugyldig dato', async () => {
        setup(utdanning)
        fyll('startDato', '31.02.2026')
        fyll('studie', '')
        fireEvent.click(screen.getByRole('button', { name: nb['knapp.tilbake'] }))
        await waitFor(() => expect(status().path).toBe('/skjema/steg/situasjonen-din'))
        expect(lagret().utdanning.startDato).toBeUndefined()
        expect(lagret().utdanning.studie).toBe('')
        tilbake()
        expect(screen.getByLabelText(nb['kontrakt.startDato']).value).toBe('')
        neste()
        await feilLenke('startDato')
    })

    it('Fjerner studieprosent ved heltid og gjenoppliver ikke tidligere kladdverdier', async () => {
        setup(utdanning)
        velg('HELTID')
        expect(screen.queryByLabelText(nb['kontrakt.studieprosent'])).toBeNull()
        neste()
        await ventPaaNeste()
        expect(lagret().utdanning).not.toHaveProperty('studieprosent')
        tilbake()
        velg('DELTID')
        expect(screen.getByLabelText(nb['kontrakt.studieprosent']).value).toBe('')
        neste()
        await feilLenke('studieprosentPaakrevd')
    })

    it('Fjerner skjulte utdanningssvar ved bytte til tiltak og deretter ingen', async () => {
        setup(utdanning)
        velg('ARBEIDSRETTET_TILTAK')
        fyll('tiltak', 'Arbeidstrening')
        velg('HELTID')
        velg('JA')
        neste()
        await ventPaaNeste()
        expect(lagret()).toEqual({
            aktivitet: 'ARBEIDSRETTET_TILTAK',
            arbeidsrettetTiltak: { tiltak: 'Arbeidstrening', omfang: 'HELTID' },
            aktivitetsplan: 'JA',
        })
        tilbake()
        velg('INGEN')
        expect(screen.getByText(nb['utdanningOgTiltak.advarsel.ingen'])).not.toBeNull()
        neste()
        await ventPaaNeste()
        expect(lagret()).toEqual({ aktivitet: 'INGEN' })
        tilbake()
        velg('UTDANNING')
        expect(screen.getByLabelText(nb['kontrakt.studiested']).value).toBe('')
        velg('ARBEIDSRETTET_TILTAK')
        expect(screen.getByLabelText(nb['kontrakt.tiltak']).value).toBe('')
        expect(screen.getByRole('radio', { name: 'Ja' }).checked).toBe(false)
    })

    it('Fjerner tiltak og aktivitetsplan ved bytte til utdanning uten å gjenopplive dem', async () => {
        setup(tiltak)
        velg('UTDANNING')
        velg('ARBEIDSRETTET_TILTAK')
        expect(screen.getByLabelText(nb['kontrakt.tiltak']).value).toBe('')
        expect(screen.getByRole('radio', { name: 'Nei' }).checked).toBe(false)
    })

    it('Krever tiltak, omfang og aktivitetsplan, og validerer tekstlengde', async () => {
        setup({ aktivitet: 'ARBEIDSRETTET_TILTAK' })
        neste()
        for (const felt of ['tiltak', 'omfang', 'aktivitetsplan']) await feilLenke(felt)
        fyll('tiltak', ' ')
        neste()
        await feilLenke('tiltak')
        fyll('tiltak', 'a'.repeat(201))
        neste()
        await feilLenke('maksLengde')
        fyll('tiltak', 'a'.repeat(200))
        velg('DELTID')
        velg('NEI')
        neste()
        await ventPaaNeste()
        expect(lagret().arbeidsrettetTiltak.omfang).toBe('DELTID')
        expect(lagret().aktivitetsplan).toBe('NEI')
    })

    it.each([
        ['nb', nb, 'Åpne datovelger'],
        ['nn', nn, 'Opne datoveljar'],
        ['en', en, 'Open date picker'],
    ])('Viser spørsmål, advarsler, kalender og feil på %s', async (spraak, tekster, aapne) => {
        await i18n.changeLanguage(spraak)
        setup({ ...utdanning, utdanning: { ...utdanning.utdanning, studieprosent: '40' } })
        expect(screen.getByRole('radiogroup', { name: tekster['kontrakt.aktivitet'] })).not.toBeNull()
        expect(screen.getByText(tekster['utdanningOgTiltak.advarsel.studieprosent'])).not.toBeNull()
        expect(screen.getByText(tekster['utdanningOgTiltak.tiltakBeskrivelse'])).not.toBeNull()
        fireEvent.change(screen.getByLabelText(tekster['kontrakt.startDato']), { target: { value: '' } })
        fireEvent.click(screen.getByRole('button', { name: tekster['knapp.neste'] }))
        await screen.findByRole('link', { name: tekster['utdanningOgTiltak.feil.startDato'] })
        expect(screen.getAllByRole('button', { name: aapne })).toHaveLength(2)
    })

    it('Lagrer dato valgt i kalenderen som ISO-dato', async () => {
        setup(utdanning)
        fireEvent.click(screen.getAllByRole('button', { name: 'Åpne datovelger' })[0])
        const kalender = await screen.findByRole('dialog')
        await act(async () => {
            fireEvent.click(
                within(kalender)
                    .getAllByRole('button')
                    .find((knapp) => knapp.textContent === '20')
            )
        })
        expect(screen.getByLabelText(nb['kontrakt.startDato']).value).toMatch(/^20\.\d{2}\.\d{4}$/)
        neste()
        await ventPaaNeste()
        expect(lagret().utdanning.startDato).toMatch(/^\d{4}-\d{2}-20$/)
    })

    it.each([
        { ...utdanning, utdanning: { ...utdanning.utdanning, studieprosent: '40' } },
        tiltak,
        { aktivitet: 'INGEN' },
    ])('Har ingen automatiske axe-feil i synlige felt og advarsler', async (data) => {
        const { container } = setup(data)
        const resultat = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(resultat.violations).toEqual([])
    })

    it('Har ingen automatiske axe-feil med valideringsfeil og feilsammendrag', async () => {
        const { container } = setup({ aktivitet: 'UTDANNING' })
        neste()
        await feilLenke('startDato')
        const resultat = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(resultat.violations).toEqual([])
    })
})
