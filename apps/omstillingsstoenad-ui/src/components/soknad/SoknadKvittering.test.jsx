import { render } from '@testing-library/react'
import SoknadKvittering from './SoknadKvittering'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', async () => ({
    ...await vi.importActual('react-i18next'),
    useTranslation: () => ({ t: vi.fn((key) => key) }),
}))

describe('SoknadKvittering', () => {
    it('skal matche snapshot', () => {
        const { container } = render(<SoknadKvittering />)
        expect(container).toMatchSnapshot()
    })
})
