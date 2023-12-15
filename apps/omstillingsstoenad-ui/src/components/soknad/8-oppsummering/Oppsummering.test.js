import { render } from '@testing-library/react'
import { TekstGruppe } from './fragmenter/TekstGruppe'
import Oppsummering from './Oppsummering'
import { BrowserRouter } from 'react-router-dom'

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...jest.requireActual('react-i18next'),
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
}))

describe('Oppsummering', () => {
    it('Snapshot', () => {
        const { container } = render(<BrowserRouter><Oppsummering /></BrowserRouter>)
        expect(container).toMatchSnapshot()
    })
})

describe('Tekstgruppe', () => {
    it('Skal rendre testittel og testcontent', () => {
        const { getByText } = render(<TekstGruppe tittel={'Testtittel'} innhold={'Testcontent'} />)
        expect(getByText('Testtittel')).toBeDefined()
        expect(getByText('Testcontent')).toBeDefined()
    })
})
