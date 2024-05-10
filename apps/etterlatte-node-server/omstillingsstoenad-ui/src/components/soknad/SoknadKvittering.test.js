import { render } from '@testing-library/react'
import SoknadKvittering from './SoknadKvittering'

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: jest.fn((key) => key) }),
}))

describe('SoknadKvittering', () => {
    it('skal matche snapshot', () => {
        const { container } = render(<SoknadKvittering />)
        expect(container).toMatchSnapshot()
    })
})
