import { fireEvent, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import OmDeg from './OmDeg'

vi.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...vi.importActual('react-i18next'),
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
}))

// Her må det mockes litt forskjellige guid-pakker...
vi.mock('uuid', () => ({
    v4: () => '456',
}))

describe('Om deg og avdød', () => {
    it('Burde vise iban-nummer', () => {
        const { container, getByText } = render(
            <BrowserRouter>
                <OmDeg />
            </BrowserRouter>
        )

        const bankkontoTypeUtenlandsk = container.querySelectorAll("[value='bankkontoType.utenlandsk']")[0]
        fireEvent.click(bankkontoTypeUtenlandsk)

        expect(getByText('omDeg.utbetalingsInformasjon.iban')).toBeDefined()
    })
})
