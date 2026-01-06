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
        const { getByText } = render(<TekstGruppe tittel={'Testtittel'} innhold={'Testcontent'} />)
        expect(getByText('Testtittel')).toBeDefined()
        expect(getByText('Testcontent')).toBeDefined()
    })
})
