import { render } from '@testing-library/react'
import OmsorgForBarn from './OmsorgForBarn'

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

describe('Omsorg for barn', () => {
    it('Snapshot', () => {
        const { container } = render(<OmsorgForBarn />)
        expect(container).toMatchSnapshot()
    })
})
