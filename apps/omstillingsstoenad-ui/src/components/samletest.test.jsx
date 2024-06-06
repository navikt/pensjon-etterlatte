import { render } from '@testing-library/react'
import SideIkkeFunnet from './SideIkkeFunnet'
import UgyldigSoeker from './UgyldigSoeker'
import { describe, expect, it, vi } from 'vitest'
/**
 * @vitest-environment jsdom
 */


vi.mock('react-i18next', () => ({
    ...vi.importActual('react-i18next'),
    useTranslation: () => {
        return { t: vi.fn((key) => key) }
    },
}))

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}))

describe('Enkel test av feilsider', () => {
    it('Side ikke funnet', async () => {
        const { findByText } = render(<SideIkkeFunnet />)

        expect(await findByText('sideIkkeFunnet.tittel')).toBeDefined()
        expect(await findByText('sideIkkeFunnet.beskrivelse')).toBeDefined()
    })

    it('Ugyldig søker', async () => {
        const { findByText } = render(<UgyldigSoeker />)

        expect(findByText('Hei, du kan ikke søke om gjenlevendepensjon.')).toBeDefined()
    })
})
