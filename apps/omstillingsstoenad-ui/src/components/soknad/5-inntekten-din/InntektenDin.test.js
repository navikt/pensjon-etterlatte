import { render } from '@testing-library/react'
import InntektenDin from './InntektenDin'

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

const defaultValues = {}

jest.mock('../../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({
        state: { inntektenDin: defaultValues },
        dispatch: jest.fn(),
    }),
}))

describe('Inntekten din', () => {
    it('Snapshot', () => {
        const { container } = render(<InntektenDin />)
        expect(container).toMatchSnapshot()
    })

    it('Skal rendre selvstendig', () => {
        const { container } = render(<InntektenDin />)

        expect(container).toMatchSnapshot()
    })
})
