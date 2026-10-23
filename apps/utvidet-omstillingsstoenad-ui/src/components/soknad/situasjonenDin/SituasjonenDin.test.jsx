import { fnr } from '@navikt/fnrvalidator'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
import SoknadDialog from '../SoknadDialog'
import { rensSituasjonenDin } from './SituasjonenDin'

vi.mock('../../../api/api', () => ({ lagreKladd: vi.fn(), slettSoeknad: vi.fn() }))
vi.mock('../../../hooks/useLanguage', () => ({ useLanguage: vi.fn() }))
vi.mock('../../../hooks/useAnalytics', () => ({
    LogEvents: { KLIKK: 'klikk' },
    useAnalytics: () => ({ logEvent: vi.fn() }),
}))
vi.mock('../../../context/bruker/BrukerContext', () => ({
    useBrukerContext: () => ({ state: { foedselsnummer: egetNummer }, dispatch: vi.fn() }),
}))

// Konstruerte testnumre med gyldige kontrollsifre, ikke personopplysninger.
const testnummer = (dag, fra) => {
    for (let i = fra; i < 100000; i++) {
        const nummer = `${dag}0101${String(i).padStart(5, '0')}`
        if (fnr(nummer).status === 'valid') return nummer
    }
    throw new Error('Fant ikke testnummer')
}
const egetNummer = testnummer('01', 10000)
const samboerNummer = testnummer('01', 20000)
const dNummer = testnummer('41', 30000)
const samboer = {
    fornavn: 'Test',
    etternavn: 'Samboer',
    foedselsnummer: samboerNummer,
    fellesBarnEllertidligereGift: 'NEI',
}

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
    return <output data-testid="status">{JSON.stringify({ path: useLocation().pathname, state })}</output>
}

const Tilbake = () => {
    const navigate = useNavigate()
    return (
        <button type="button" onClick={() => navigate('/skjema/steg/situasjonen-din')}>
            Til situasjonen din
        </button>
    )
}

const setup = (situasjon, annetSkjema = {}) => {
    const state = {
        ...tomSoeknad,
        harSamtykket: true,
        spraak: 'nb',
        aktivtSteg: 'situasjonen-din',
        skjema: { ...annetSkjema, ...(situasjon ? { situasjonenDinIDag: situasjon } : {}) },
    }
    return render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter initialEntries={['/skjema/steg/situasjonen-din']}>
                <SoknadProvider>
                    <Initialiser state={state}>
                        <Routes>
                            <Route path="/skjema/steg/*" element={<SoknadDialog />} />
                        </Routes>
                        <Tilbake />
                        <Status />
                    </Initialiser>
                </SoknadProvider>
            </MemoryRouter>
        </I18nextProvider>
    )
}
const status = () => JSON.parse(screen.getByTestId('status').textContent)
const neste = () => fireEvent.click(screen.getByRole('button', { name: nb['knapp.neste'] }))
const lagretSituasjon = () => lagreKladd.mock.calls.at(-1)[0].skjema.situasjonenDinIDag
const ventPaaNeste = () => waitFor(() => expect(status().path).toBe('/skjema/steg/utdanning-og-tiltak'))

beforeEach(async () => {
    vi.clearAllMocks()
    await i18n.changeLanguage('nb')
    lagreKladd.mockImplementation(async (state) => ({ ...state, sistLagretDato: new Date() }))
    HTMLDialogElement.prototype.showModal = function () {
        this.setAttribute('open', '')
    }
})
afterEach(cleanup)

describe('Situasjonen din i dag', () => {
    it('Krever svar, fokuserer feilsammendraget og lenker til et faktisk radiofelt', async () => {
        setup()
        expect(screen.queryByRole('alert')).toBeNull()
        expect(screen.queryByRole('textbox')).toBeNull()
        neste()
        const lenke = await screen.findByRole('link', { name: nb['situasjonenDin.feil.nySivilstand'] })
        expect(lenke.getAttribute('href')).toBe('#nySivilstand')
        expect(document.getElementById('nySivilstand').tagName).toBe('INPUT')
        await waitFor(() =>
            expect(document.activeElement).toBe(screen.getByRole('heading', { name: nb['skjema.feil'] }))
        )
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it('Viser bare samboerfeltene ved ny samboer og krever alle fire svar', async () => {
        setup()
        fireEvent.click(screen.getByLabelText(nb['kontrakt.NY_SAMBOER']))
        expect(screen.getAllByRole('textbox')).toHaveLength(3)
        neste()
        const meldinger = ['fornavn', 'etternavn', 'foedselsnummerPaakrevd', 'fellesBarn']
        for (const feil of meldinger) {
            const lenke = await screen.findByRole('link', { name: nb[`situasjonenDin.feil.${feil}`] })
            expect(document.getElementById(lenke.getAttribute('href').slice(1))).not.toBeNull()
        }
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each([
        ['ugyldige kontrollsifre', '12345678901', 'foedselsnummerUgyldig'],
        ['eget fødselsnummer', egetNummer, 'foedselsnummerEget'],
    ])('Avviser %s', async (_beskrivelse, nummer, feil) => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer: { ...samboer, foedselsnummer: nummer } })
        neste()
        expect(await screen.findByRole('link', { name: nb[`situasjonenDin.feil.${feil}`] })).toBeDefined()
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each(['fornavn', 'etternavn'])('Avviser bare mellomrom i %s', async (felt) => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer: { ...samboer, [felt]: '   ' } })
        neste()
        expect(await screen.findByRole('link', { name: nb[`situasjonenDin.feil.${felt}`] })).toBeDefined()
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each([samboerNummer, dNummer])('Godtar fnr/d-nummer og normaliserer mellomrom før lagring', async (nummer) => {
        const inntekt = { arbeidsinntekt: '123' }
        setup({ nySivilstand: 'NY_SAMBOER', samboer }, { inntekt })
        fireEvent.change(screen.getByLabelText(nb['kontrakt.samboerFornavn']), { target: { value: ' Test ' } })
        fireEvent.change(screen.getByLabelText(nb['kontrakt.samboerEtternavn']), { target: { value: ' Samboer ' } })
        fireEvent.change(screen.getByLabelText(nb['kontrakt.samboerFoedselsnummer']), {
            target: { value: `${nummer.slice(0, 6)} ${nummer.slice(6)}` },
        })
        neste()
        await ventPaaNeste()
        expect(lagretSituasjon()).toEqual({
            nySivilstand: 'NY_SAMBOER',
            samboer: { ...samboer, foedselsnummer: nummer },
        })
        expect(status().state.skjema.inntekt).toEqual(inntekt)
        expect(status().state.spraak).toBe('nb')
        expect(lagreKladd.mock.calls[0][0].aktivtSteg).toBe('utdanning-og-tiltak')
    })

    it.each(['GIFTET_PAA_NYTT', 'INGEN_AV_DELENE'])('Fjerner gamle samboersvar når valget er %s', async (valg) => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer })
        fireEvent.click(screen.getByLabelText(nb[`kontrakt.${valg}`]))
        expect(screen.queryByRole('textbox')).toBeNull()
        neste()
        await ventPaaNeste()
        expect(lagretSituasjon()).toEqual({ nySivilstand: valg })
        expect(status().state.skjema.situasjonenDinIDag).toEqual({ nySivilstand: valg })
    })

    it('Henter ikke frem slettede standardverdier når ny samboer velges igjen', async () => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer })
        fireEvent.click(screen.getByLabelText(nb['kontrakt.INGEN_AV_DELENE']))
        fireEvent.click(screen.getByLabelText(nb['kontrakt.NY_SAMBOER']))
        expect(screen.getByLabelText(nb['kontrakt.samboerFornavn']).value).toBe('')
        expect(screen.getByLabelText(nb['kontrakt.samboerEtternavn']).value).toBe('')
        expect(screen.getByLabelText(nb['kontrakt.samboerFoedselsnummer']).value).toBe('')
        expect(screen.getByLabelText(nb['kontrakt.NEI']).checked).toBe(false)
        neste()
        await screen.findByRole('link', { name: nb['situasjonenDin.feil.fornavn'] })
        expect(lagreKladd).not.toHaveBeenCalled()
    })

    it.each([
        { nySivilstand: 'GIFTET_PAA_NYTT' },
        { nySivilstand: 'NY_SAMBOER', samboer: { ...samboer, fellesBarnEllertidligereGift: 'JA' } },
    ])('Advarsel blokkerer ikke neste steg: $nySivilstand', async (situasjon) => {
        setup(situasjon)
        expect(screen.getByText(nb['situasjonenDin.advarsel.tittel'])).toBeDefined()
        const advarsel =
            situasjon.nySivilstand === 'GIFTET_PAA_NYTT'
                ? nb['situasjonenDin.advarsel.gift']
                : nb['situasjonenDin.advarsel.samboer']
        expect(screen.getByText(advarsel)).toBeDefined()
        expect(screen.getByText(nb['situasjonenDin.advarsel.tittel']).closest('[data-color="warning"]')).not.toBeNull()
        neste()
        await ventPaaNeste()
        expect(lagretSituasjon()).toEqual(situasjon)
    })

    it('Fjerner advarselen når svaret på felles barn endres til nei', () => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer: { ...samboer, fellesBarnEllertidligereGift: 'JA' } })
        expect(screen.getByText(nb['situasjonenDin.advarsel.samboer'])).toBeDefined()
        fireEvent.click(screen.getByLabelText(nb['kontrakt.NEI']))
        expect(screen.queryByText(nb['situasjonenDin.advarsel.samboer'])).toBeNull()
    })

    it('Gjenoppretter lagrede svar ved retur fra neste steg', async () => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer })
        neste()
        await ventPaaNeste()
        fireEvent.click(screen.getByText('Til situasjonen din'))
        expect(screen.getByLabelText(nb['kontrakt.samboerFornavn']).value).toBe(samboer.fornavn)
        expect(screen.getByLabelText(nb['kontrakt.samboerFoedselsnummer']).value).toBe(samboer.foedselsnummer)
        expect(screen.getByLabelText(nb['kontrakt.NEI']).checked).toBe(true)
    })

    it('Forrige steg lagrer en ufullstendig kladd uten å validere', async () => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer: { fornavn: 'Delvis' } })
        fireEvent.click(screen.getByRole('button', { name: nb['knapp.tilbake'] }))
        await waitFor(() => expect(status().path).toBe('/skjema/steg/personopplysninger'))
        expect(lagretSituasjon().samboer.fornavn).toBe('Delvis')
    })

    it('Fortsett senere lagrer ufullstendige svar', async () => {
        setup({ nySivilstand: 'NY_SAMBOER', samboer: { fornavn: 'Delvis' } })
        fireEvent.click(screen.getByRole('button', { name: nb['knapp.avbryt'] }))
        fireEvent.click(await screen.findByRole('button', { name: nb['avbrytModal.svarJa'] }))
        await waitFor(() => expect(lagreKladd).toHaveBeenCalledTimes(1))
        expect(lagretSituasjon().samboer.fornavn).toBe('Delvis')
    })

    it('Beholder inndata ved lagringsfeil og lar brukeren prøve på nytt', async () => {
        lagreKladd.mockRejectedValueOnce(new Error('nettverksfeil'))
        setup({ nySivilstand: 'NY_SAMBOER', samboer })
        neste()
        await screen.findByText(nb['skjema.lagringFeilet'])
        expect(status().path).toBe('/skjema/steg/situasjonen-din')
        expect(screen.getByLabelText(nb['kontrakt.samboerFornavn']).value).toBe(samboer.fornavn)
        neste()
        await ventPaaNeste()
    })

    it.each([
        ['nb', nb],
        ['nn', nn],
        ['en', en],
    ])('Viser spørsmål, advarsel og validering på %s', async (spraak, locale) => {
        await i18n.changeLanguage(spraak)
        setup({ nySivilstand: 'NY_SAMBOER', samboer: { fellesBarnEllertidligereGift: 'JA' } })
        expect(screen.getByRole('radiogroup', { name: locale['kontrakt.nySivilstand'] })).toBeDefined()
        expect(screen.getByText(locale['situasjonenDin.advarsel.samboer'])).toBeDefined()
        fireEvent.click(screen.getByRole('button', { name: locale['knapp.neste'] }))
        expect(await screen.findByRole('link', { name: locale['situasjonenDin.feil.fornavn'] })).toBeDefined()
    })

    it.each([
        undefined,
        { nySivilstand: 'GIFTET_PAA_NYTT' },
        { nySivilstand: 'NY_SAMBOER', samboer: { ...samboer, fellesBarnEllertidligereGift: 'JA' } },
    ])('Har ingen automatiske axe-feil i synlige felt og advarsler', async (situasjon) => {
        const { container } = setup(situasjon)
        const resultat = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(resultat.violations).toEqual([])
    })

    it('Har ingen automatiske axe-feil med valideringsfeil og feilsammendrag', async () => {
        const { container } = setup({ nySivilstand: 'NY_SAMBOER' })
        neste()
        await screen.findByRole('link', { name: nb['situasjonenDin.feil.fornavn'] })
        const resultat = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(resultat.violations).toEqual([])
    })
})

describe('Rensing av kladd', () => {
    it('Tar ikke med skjulte samboersvar fra en tidligere kladd', () => {
        expect(rensSituasjonenDin({ nySivilstand: 'INGEN_AV_DELENE', samboer })).toEqual({
            nySivilstand: 'INGEN_AV_DELENE',
        })
        expect(rensSituasjonenDin({ samboer })).toEqual({})
    })
})
