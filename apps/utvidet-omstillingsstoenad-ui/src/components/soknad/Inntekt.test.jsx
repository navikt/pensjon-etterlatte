import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import axe from 'axe-core'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lagreKladd } from '../../api/api'
import { SoknadProvider, useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes, tomSoeknad } from '../../context/soknad/soknad'
import i18n from '../../i18n'
import { mapSoeknad } from '../../utils/mapSoeknad'
import { InntektSteg } from './Inntekt'
import { SoeknadStegRute } from './SoeknadSteg'
import SoknadDialog from './SoknadDialog'

vi.mock('../../api/api', () => ({ lagreKladd: vi.fn(), slettSoeknad: vi.fn() }))
vi.mock('../../hooks/useLanguage', () => ({ useLanguage: vi.fn() }))
vi.mock('../../hooks/useAnalytics', () => ({
    LogEvents: {},
    useAnalytics: () => ({ logEvent: vi.fn() }),
}))

const Start = ({ inntekt }) => {
    const { state, dispatch } = useSoknadContext()
    const [klar, settKlar] = useState(false)
    const location = useLocation()
    useEffect(() => {
        dispatch({
            type: ActionTypes.OPPDATER_KLADD,
            payload: {
                ...tomSoeknad,
                harSamtykket: true,
                spraak: i18n.language,
                aktivtSteg: 'inntekt',
                skjema: {
                    situasjonenDinIDag: { nySivilstand: 'INGEN_AV_DELENE' },
                    utdanningOgTiltak: { aktivitet: 'INGEN' },
                    ...(inntekt ? { inntekt } : {}),
                },
            },
        })
        settKlar(true)
    }, [dispatch, inntekt])
    return (
        <>
            {klar && (
                <Routes>
                    <Route path="/skjema/steg" element={<SoknadDialog />}>
                        <Route path="inntekt" element={<InntektSteg />} />
                        {['utdanning-og-tiltak', 'dokumentasjon'].map((path) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <SoeknadStegRute>
                                        <p>skjema.underArbeid</p>
                                    </SoeknadStegRute>
                                }
                            />
                        ))}
                    </Route>
                </Routes>
            )}
            <output data-testid="status">{JSON.stringify({ path: location.pathname, state })}</output>
        </>
    )
}

const setup = (inntekt) =>
    render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter initialEntries={['/skjema/steg/inntekt']}>
                <SoknadProvider>
                    <Start inntekt={inntekt} />
                </SoknadProvider>
            </MemoryRouter>
        </I18nextProvider>
    )

const status = () => JSON.parse(screen.getByTestId('status').textContent)
const felt = (key) => screen.getByRole('textbox', { name: i18n.t(`kontrakt.${key}`) })
const fyll = (key, value) => fireEvent.change(felt(key), { target: { value } })
const svar = (key, value) =>
    fireEvent.click(
        within(screen.getByRole('radiogroup', { name: i18n.t(`kontrakt.${key}`) })).getByRole('radio', {
            name: i18n.t(`kontrakt.${value}`),
        })
    )
const neste = () => fireEvent.click(screen.getByRole('button', { name: i18n.t('knapp.neste') }))
const lagretInntekt = () => lagreKladd.mock.calls.at(-1)[0].skjema.inntekt
const grunn = (value) =>
    fireEvent.change(screen.getByRole('combobox', { name: i18n.t('kontrakt.grunnTilPaavirkelseAvInntekt') }), {
        target: { value },
    })
const paakrevdBeloep = (key) =>
    i18n.t('inntekt.feil.paakrevdBeloep', {
        felt: i18n.t(`kontrakt.${key}`).toLocaleLowerCase(i18n.language),
    })
const gyldig = {
    arbeidsinntekt: '250 000',
    naeringsinntekt: '0',
    inntektFraUtland: '0',
    andreInntekter: { valg: 'NEI' },
    noeSomKanPaavirkeInntekten: { valg: 'NEI' },
}

beforeEach(async () => {
    vi.clearAllMocks()
    await i18n.changeLanguage('nb')
    lagreKladd.mockImplementation(async (state) => state)
})
afterEach(cleanup)

describe('Inntektssteget', () => {
    it('viser ingress, påkrevde beløp med riktige standardverdier og ingen AFP', async () => {
        setup()
        expect(screen.getByText(i18n.t('inntekt.ingress'))).toBeDefined()
        expect(felt('arbeidsinntekt').value).toBe('')
        expect(felt('naeringsinntekt').value).toBe('0')
        expect(felt('inntektFraUtland').value).toBe('0')
        for (const name of ['arbeidsinntekt', 'naeringsinntekt', 'inntektFraUtland']) {
            expect(felt(name).getAttribute('size')).toBe('25')
        }
        expect(screen.getByText(i18n.t('inntekt.utlandBeskrivelse'))).toBeDefined()
        expect(screen.queryByText(/AFP/)).toBeNull()
        expect(screen.queryByRole('textbox', { name: i18n.t('kontrakt.sumAndreInntekter') })).toBeNull()
        expect(screen.queryByRole('combobox')).toBeNull()
        neste()
        const feilmelding = paakrevdBeloep('arbeidsinntekt')
        expect(feilmelding).toBe('Du må oppgi beløp for arbeidsinntekt og andre utbetalinger')
        expect(await screen.findByRole('link', { name: feilmelding })).toBeDefined()
        expect(await screen.findByRole('link', { name: i18n.t('inntekt.feil.andreInntekter') })).toBeDefined()
        expect(await screen.findByRole('link', { name: i18n.t('inntekt.feil.paavirkeInntekt') })).toBeDefined()
        await waitFor(() =>
            expect(document.activeElement).toBe(screen.getByRole('heading', { name: i18n.t('skjema.feil') }))
        )
        for (const link of screen.getAllByRole('link')) {
            const id = link.getAttribute('href')?.slice(1)
            if (link.getAttribute('href')?.startsWith('#')) expect(document.getElementById(id)).not.toBeNull()
        }
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each(['', ' ', '-1', '1.5', '1,5', 'abc', '1e3'])('avviser ugyldig arbeidsinntekt «%s»', async (value) => {
        setup(gyldig)
        fyll('arbeidsinntekt', value)
        neste()
        const melding = value === '' ? paakrevdBeloep('arbeidsinntekt') : i18n.t('inntekt.feil.beloep')
        expect((await screen.findByRole('link', { name: melding })).getAttribute('href')).toBe('#arbeidsinntekt')
        expect(felt('arbeidsinntekt').value).toBe(value)
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each(['naeringsinntekt', 'inntektFraUtland', 'sumAndreInntekter'])(
        'validerer også beløpet for %s',
        async (key) => {
            setup({ ...gyldig, andreInntekter: { valg: 'JA', inntekt: '100', beskrivelse: 'Utleie' } })
            fyll(key, '-1')
            neste()
            const link = await screen.findByRole('link', { name: i18n.t('inntekt.feil.beloep') })
            expect(link.getAttribute('href')).toBe(`#${key === 'sumAndreInntekter' ? 'andreInntekter.inntekt' : key}`)
            expect(lagreKladd).not.toHaveBeenCalled()
        }
    )

    it('godtar null og mellomrom, lagrer svar og mapper uten AFP eller mellomrom', async () => {
        setup()
        fyll('arbeidsinntekt', '0')
        fyll('naeringsinntekt', '12 345')
        fyll('inntektFraUtland', '6\u00a0789')
        svar('andreInntekter', 'JA')
        fyll('sumAndreInntekter', '1 000')
        fyll('andreInntekterBeskrivelse', 'Utleie')
        svar('paavirkeInntekt', 'VET_IKKE')
        neste()
        await waitFor(() => expect(status().path).toBe('/skjema/steg/dokumentasjon'))
        expect(lagretInntekt()).toEqual({
            arbeidsinntekt: '0',
            naeringsinntekt: '12345',
            inntektFraUtland: '6789',
            andreInntekter: { valg: 'JA', inntekt: '1000', beskrivelse: 'Utleie' },
            noeSomKanPaavirkeInntekten: { valg: 'VET_IKKE' },
        })
        expect(status().state.skjema.inntekt).toEqual(lagretInntekt())
        const kontrakt = mapSoeknad(
            status().state,
            { fornavn: 'Ola', etternavn: 'Nordmann', foedselsnummer: '123' },
            'test',
            (key) => i18n.t(key)
        )
        expect(kontrakt.inntekt.afpInntekt).toBeNull()
        expect(kontrakt.inntekt.naeringsinntekt.inntekt.svar.innhold).toBe('12345')
        expect(kontrakt.inntekt.andreInntekter.inntekt.svar.innhold).toBe('1000')
        fireEvent.click(screen.getByRole('button', { name: i18n.t('knapp.tilbake') }))
        await screen.findByRole('textbox', { name: i18n.t('kontrakt.arbeidsinntekt') })
        expect(felt('naeringsinntekt').value).toBe('12345')
        expect(felt('sumAndreInntekter').value).toBe('1000')
    })

    it('krever beløp og beskrivelse bare når andre inntekter er Ja', async () => {
        setup(gyldig)
        svar('andreInntekter', 'JA')
        neste()
        expect(await screen.findByRole('link', { name: i18n.t('inntekt.feil.andreBeskrivelse') })).toBeDefined()
        expect(
            await screen.findByRole('link', {
                name: paakrevdBeloep('sumAndreInntekter'),
            })
        ).toBeDefined()
        svar('andreInntekter', 'NEI')
        neste()
        await waitFor(() => expect(lagreKladd).toHaveBeenCalledTimes(1))
        expect(lagretInntekt().andreInntekter).toEqual({ valg: 'NEI' })
    })

    it('krever grunn ved Ja og beskrivelse bare for annen grunn', async () => {
        setup(gyldig)
        svar('paavirkeInntekt', 'JA')
        neste()
        expect(await screen.findByRole('link', { name: i18n.t('inntekt.feil.grunn') })).toBeDefined()
        grunn('ANNEN_GRUNN')
        neste()
        expect(await screen.findByRole('link', { name: i18n.t('inntekt.feil.endringBeskrivelse') })).toBeDefined()
        fyll('endringBeskrivelse', 'Ny arbeidssituasjon')
        grunn('BYTTE_AV_JOBB')
        expect(screen.queryByRole('textbox', { name: i18n.t('kontrakt.endringBeskrivelse') })).toBeNull()
        neste()
        await waitFor(() => expect(lagreKladd).toHaveBeenCalledTimes(1))
        expect(lagretInntekt().noeSomKanPaavirkeInntekten).toEqual({
            valg: 'JA',
            grunnTilPaavirkelseAvInntekt: 'BYTTE_AV_JOBB',
        })
    })

    it.each(['NEI', 'VET_IKKE'])('fjerner oppfølgingsfelt fra lagret state ved %s', async (valg) => {
        setup({
            ...gyldig,
            andreInntekter: { valg: 'JA', inntekt: '1 000', beskrivelse: 'Utleie' },
            noeSomKanPaavirkeInntekten: {
                valg: 'JA',
                grunnTilPaavirkelseAvInntekt: 'ANNEN_GRUNN',
                beskrivelse: 'Gammelt svar',
            },
        })
        svar('andreInntekter', valg)
        svar('paavirkeInntekt', valg)
        expect(screen.queryByRole('textbox', { name: i18n.t('kontrakt.sumAndreInntekter') })).toBeNull()
        expect(screen.queryByRole('combobox')).toBeNull()
        neste()
        await waitFor(() => expect(lagreKladd).toHaveBeenCalledTimes(1))
        expect(lagretInntekt().andreInntekter).toEqual({ valg })
        expect(lagretInntekt().noeSomKanPaavirkeInntekten).toEqual({ valg })
        expect(status().state.skjema.inntekt).toEqual(lagretInntekt())
    })

    it('henter ikke tilbake slettede svar når oppfølgingsfelt vises igjen', () => {
        setup({
            ...gyldig,
            andreInntekter: { valg: 'JA', inntekt: '1000', beskrivelse: 'Utleie' },
            noeSomKanPaavirkeInntekten: {
                valg: 'JA',
                grunnTilPaavirkelseAvInntekt: 'ANNEN_GRUNN',
                beskrivelse: 'Gammelt svar',
            },
        })
        svar('andreInntekter', 'NEI')
        svar('andreInntekter', 'JA')
        expect(felt('sumAndreInntekter').value).toBe('')
        expect(felt('andreInntekterBeskrivelse').value).toBe('')
        grunn('BYTTE_AV_JOBB')
        grunn('ANNEN_GRUNN')
        expect(felt('endringBeskrivelse').value).toBe('')
        svar('paavirkeInntekt', 'VET_IKKE')
        svar('paavirkeInntekt', 'JA')
        expect(screen.getByRole('combobox').value).toBe('')
    })

    it('lar brukeren lagre et ufullstendig steg med Forrige', async () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: i18n.t('knapp.tilbake') }))
        await waitFor(() => expect(status().path).toBe('/skjema/steg/utdanning-og-tiltak'))
        expect(lagretInntekt().arbeidsinntekt).toBe('')
        expect(lagretInntekt().naeringsinntekt).toBe('0')
        expect(lagretInntekt().inntektFraUtland).toBe('0')
    })

    it.each([' ', 'a'.repeat(1001)])('avviser tom eller for lang beskrivelse', async (beskrivelse) => {
        setup({
            ...gyldig,
            andreInntekter: { valg: 'JA', inntekt: '0', beskrivelse },
            noeSomKanPaavirkeInntekten: {
                valg: 'JA',
                grunnTilPaavirkelseAvInntekt: 'ANNEN_GRUNN',
                beskrivelse,
            },
        })
        neste()
        await screen.findByRole('heading', { name: i18n.t('skjema.feil') })
        const ids = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
        expect(ids).toContain('#andreInntekter.beskrivelse')
        expect(ids).toContain('#noeSomKanPaavirkeInntekten.beskrivelse')
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each(['nb', 'nn', 'en'])('viser inntektstekster og ReadMore på %s', async (spraak) => {
        await i18n.changeLanguage(spraak)
        setup()
        expect(screen.getByText(i18n.t('inntekt.ingress'))).toBeDefined()
        expect(felt('arbeidsinntekt')).toBeDefined()
        const readMoreKeys = [
            'arbeidsinntekterDuSkalFylleUt.tittel',
            'naeringsinntekterDuSkalFylleUt.label',
            'inntekterFraUtlandDuSkalFylleUt.label',
        ]
        for (const key of readMoreKeys) {
            const tekst = i18n.t(`inntektenDin.felles.${key}`)
            expect(tekst).not.toBe(`inntektenDin.felles.${key}`)
            fireEvent.click(screen.getByRole('button', { name: tekst }))
        }
        expect(
            screen.getAllByText(i18n.t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.arbeidsinntekter.l1'))
                .length
        ).toBe(2)
        expect(
            screen.getAllByText(i18n.t('inntektenDin.felles.naeringsinntekterDuSkalFylleUt.innhold.l1')).length
        ).toBe(2)
    })

    it.each(['nb', 'nn', 'en'])('viser oppdaterte tegntellere i begge beskrivelsesfeltene på %s', async (spraak) => {
        await i18n.changeLanguage(spraak)
        setup(gyldig)
        svar('andreInntekter', 'JA')
        svar('paavirkeInntekt', 'JA')
        grunn('ANNEN_GRUNN')
        expect(screen.getAllByText(`1000 ${i18n.t('inntekt.counterLeft')}`).length).toBe(2)
        fyll('andreInntekterBeskrivelse', 'Utleie')
        expect(screen.getByText(`994 ${i18n.t('inntekt.counterLeft')}`)).toBeDefined()
        fyll('endringBeskrivelse', 'a'.repeat(1000))
        expect(screen.getAllByText(`0 ${i18n.t('inntekt.counterLeft')}`).length).toBeGreaterThan(0)
        for (const key of ['andreInntekterBeskrivelse', 'endringBeskrivelse']) {
            fyll(key, 'a'.repeat(1001))
        }
        expect(screen.getAllByText(`1 ${i18n.t('inntekt.counterTooMuch')}`).length).toBeGreaterThanOrEqual(2)
    })

    it('har ingen automatiske axe-feil med åpne oppfølgingsfelt, ReadMore og valideringsfeil', async () => {
        const { container } = setup()
        svar('andreInntekter', 'JA')
        svar('paavirkeInntekt', 'JA')
        grunn('ANNEN_GRUNN')
        for (const button of screen.getAllByRole('button', { expanded: false })) {
            fireEvent.click(button)
        }
        neste()
        await screen.findByRole('heading', { name: i18n.t('skjema.feil') })
        const result = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(result.violations).toEqual([])
    })
})
