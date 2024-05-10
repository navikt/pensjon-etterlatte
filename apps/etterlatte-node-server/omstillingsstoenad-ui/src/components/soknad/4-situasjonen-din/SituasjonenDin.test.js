import { render } from '@testing-library/react'
import SituasjonenDin from './SituasjonenDin'

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
    beforeAll(() => {
        jest.useFakeTimers('modern')
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    it('Snapshot', () => {
        jest.setSystemTime(new Date(2024, 0, 1))

        const { container } = render(<SituasjonenDin />)
        expect(container).toMatchSnapshot()
    })
})
