import { act, render, fireEvent } from '@testing-library/react'
import OmDegOgAvdoed from './OmDegOgAvdoed'

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({
        t: (str) => str,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}))

jest.mock('uuid', () => ({
    v4: () => '456',
}))

describe('Om deg og avdød', () => {
    it('Snapshot uten samboerskjema', () => {
        const { container } = render(<OmDegOgAvdoed />)
        expect(container).toMatchSnapshot()
    })

    it('Snapshot med sivilstatus samboer', () => {
        const { container, getByText, getByLabelText } = render(<OmDegOgAvdoed />)

        act(() => {
            fireEvent.click(getByLabelText('avdoede.relasjon.samboer'))
        })
        expect(getByText('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')).toBeDefined()
        expect(container).toMatchSnapshot()
    })
})
