import { FormSummary } from '@navikt/ds-react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TekstGruppe } from './fragmenter/TekstGruppe'

vi.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
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

describe('Tekstgruppe', () => {
    it('Skal rendre testittel og testcontent', () => {
        const { getByText } = render(
            <FormSummary.Answers>
                <TekstGruppe tittel={'Testtittel'} innhold={'Testcontent'} />
            </FormSummary.Answers>
        )
        expect(getByText('Testtittel')).toBeDefined()
        expect(getByText('Testcontent')).toBeDefined()
    })

    it('Skal rendre tittel som dt og innhold som dd', () => {
        const { getByText } = render(
            <FormSummary.Answers>
                <TekstGruppe tittel={'Testtittel'} innhold={'Testcontent'} id={'test-id'} />
            </FormSummary.Answers>
        )
        expect(getByText('Testtittel').tagName).toBe('DT')

        const innhold = getByText('Testcontent')
        expect(innhold.tagName).toBe('DD')
        expect(innhold.id).toBe('test-id')
    })
})
