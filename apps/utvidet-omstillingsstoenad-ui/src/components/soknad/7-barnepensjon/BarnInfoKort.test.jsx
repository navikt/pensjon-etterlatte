import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BarnInfokort from './BarnInfokort'

vi.mock('react-i18next', () => ({
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
    it('Burde vise info om barn', () => {
        const { getByText } = render(
            <BarnInfokort barn={{ fornavn: 'Ufruktbar', etternavn: 'Flygefisk', foedselsnummer: '19440397142' }} />
        )
        expect(getByText('Ufruktbar Flygefisk')).toBeDefined()
        expect(getByText('194403 97142')).toBeDefined()
    })
})
