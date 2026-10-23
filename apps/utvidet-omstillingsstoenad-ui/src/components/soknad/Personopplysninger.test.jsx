import { cleanup, render, screen } from '@testing-library/react'
import axe from 'axe-core'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it } from 'vitest'
import { BrukerProvider, useBrukerContext } from '../../context/bruker/BrukerContext'
import { ActionTypes } from '../../context/bruker/bruker'
import i18n from '../../i18n'
import Personopplysninger from './Personopplysninger'

const BrukerMedOpplysninger = ({ bruker }) => {
    const { dispatch } = useBrukerContext()
    useEffect(() => {
        dispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: bruker })
    }, [dispatch, bruker])
    return <Personopplysninger />
}

const setup = (bruker) =>
    render(
        <I18nextProvider i18n={i18n}>
            <BrukerProvider>
                <BrukerMedOpplysninger bruker={bruker} />
            </BrukerProvider>
        </I18nextProvider>
    )

afterEach(cleanup)

describe('Personopplysninger', () => {
    it('viser innloggede personopplysninger og lenke til Folkeregisteret', () => {
        setup({
            fornavn: 'Ola',
            etternavn: 'Nordmann',
            foedselsnummer: '123',
            adresse: 'Eksempelveien',
            husnummer: '1',
            postnummer: '0101',
            poststed: 'Oslo',
            sivilstatus: 'UGIFT',
            statsborgerskap: 'Norge',
            telefonnummer: '99 99 99 99',
        })

        expect(screen.getByText('Ola Nordmann')).toBeDefined()
        expect(screen.getByText('123')).toBeDefined()
        expect(screen.getByText('Eksempelveien 1, 0101 Oslo')).toBeDefined()
        expect(screen.getByText('Ugift')).toBeDefined()
        expect(screen.getByText('Norge')).toBeDefined()
        expect(screen.getByText('99 99 99 99')).toBeDefined()

        const link = screen.getByRole('link', { name: 'Endre opplysningene i Folkeregisteret' })
        expect(link.getAttribute('href')).toBe('https://www.skatteetaten.no/skjema/opplysninger-i-folkeregisteret/')
        expect(link.getAttribute('target')).toBe('_blank')
    })

    it('viser ikke skjermet adresse', () => {
        setup({
            adresse: 'Skjermet vei',
            husnummer: '1',
            postnummer: '0101',
            poststed: 'Oslo',
            adressebeskyttelse: true,
        })

        expect(screen.queryByText('Skjermet vei 1, 0101 Oslo')).toBeNull()
        expect(screen.queryByText('Bostedsadresse')).toBeNull()
        expect(screen.getByRole('heading', { name: 'Er opplysningene feil?' })).toBeDefined()
    })

    it('har ingen automatiske tilgjengelighetsfeil', async () => {
        const { container } = setup({
            fornavn: 'Ola',
            etternavn: 'Nordmann',
            foedselsnummer: '123',
            sivilstatus: 'UGIFT',
        })

        const result = await axe.run(container, {
            rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
        })
        expect(result.violations).toEqual([])
    })
})
