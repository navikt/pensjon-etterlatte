import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { TekstGruppe } from './fragmenter/TekstGruppe'
import { OppsummeringSeksjon } from './OppsummeringSeksjon'

vi.mock('react-i18next', () => ({
    ...vi.importActual('react-i18next'),
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
}))

const renderSeksjon = (senderSoeknad) =>
    render(
        <MemoryRouter>
            <OppsummeringSeksjon
                tittel={'Om deg'}
                path={'/skjema/steg/om-deg'}
                pathText={'omDeg'}
                senderSoeknad={senderSoeknad}
            >
                <TekstGruppe tittel={'Testtittel'} innhold={'Testcontent'} />
            </OppsummeringSeksjon>
        </MemoryRouter>
    )

describe('OppsummeringSeksjon', () => {
    it('Skal rendre tittel, innhold og endrelenke til riktig steg', () => {
        const { getByRole, getByText } = renderSeksjon(false)

        expect(getByRole('heading', { level: 2, name: 'Om deg' })).toBeDefined()
        expect(getByText('Testcontent')).toBeDefined()

        const lenke = getByRole('link', { name: /endreSvarOppsummering\.omDeg/ })
        expect(lenke.getAttribute('href')).toBe('/skjema/steg/om-deg')
        expect(lenke.classList.contains('disabled')).toBe(false)
    })

    it('Skal deaktivere endrelenken mens søknaden sendes', () => {
        const { getByRole } = renderSeksjon(true)

        const lenke = getByRole('link', { name: /endreSvarOppsummering\.omDeg/ })
        expect(lenke.classList.contains('disabled')).toBe(true)
    })

    it('Lar innholdet eie svarlisten når det trenger en egen periodeoverskrift', () => {
        const { container, getByRole } = render(
            <MemoryRouter>
                <OppsummeringSeksjon tittel="Inntekten din" path="/inntekt" pathText="inntekt" medSvarliste={false}>
                    <Heading level="3" size="small">
                        Inntekt i år
                    </Heading>
                    <FormSummary.Answers>
                        <TekstGruppe tittel="Arbeidsinntekt" innhold="100000" />
                    </FormSummary.Answers>
                </OppsummeringSeksjon>
            </MemoryRouter>
        )

        expect(container.querySelectorAll('dl')).toHaveLength(1)
        expect(getByRole('heading', { level: 3 }).closest('dl')).toBeNull()
        expect(getByRole('link').closest('.aksel-form-summary__footer')).not.toBeNull()
    })
})

import { FormSummary, Heading } from '@navikt/ds-react'
