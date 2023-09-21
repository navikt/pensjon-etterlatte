import { render } from '@testing-library/react'
import BarnInfokort from './BarnInfokort'

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
}))

describe('BarnInfoKort', () => {
    it('Snapshot', () => {
        const { getByText } = render(
            <BarnInfokort barn={{ fornavn: 'Treig', etternavn: 'Floskel', foedselsnummer: '04096222195' }} />
        )
        expect(getByText('Treig Floskel')).toBeDefined()
        expect(getByText('040962 22195')).toBeDefined()
    })
})
