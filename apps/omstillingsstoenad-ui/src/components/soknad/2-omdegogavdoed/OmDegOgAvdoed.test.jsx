import { act, render, fireEvent } from '@testing-library/react'
import OmDegOgAvdoed from './OmDegOgAvdoed'
import { describe, expect, it, vi } from 'vitest'
import {BrowserRouter} from "react-router-dom";

vi.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...vi.importActual('react-i18next'),
    useTranslation: () => ({
        t: (str) => str,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}))

vi.mock('uuid', () => ({
    v4: () => '456',
}))

describe('Om deg og avdød', () => {
    beforeAll(() => {
        vi.useFakeTimers('modern')
    })

    afterAll(() => {
        vi.useRealTimers()
    })

    it('Snapshot uten samboerskjema', () => {
        vi.setSystemTime(new Date(2024, 0, 1))
        const { container } = render(<BrowserRouter><OmDegOgAvdoed /></BrowserRouter>)
        expect(container).toMatchSnapshot()
    })

    it('Snapshot med sivilstatus samboer', () => {
        vi.setSystemTime(new Date(2024, 0, 1))
        const { container, getByText, getByLabelText } = render(<BrowserRouter><OmDegOgAvdoed /></BrowserRouter>)

        act(() => {
            fireEvent.click(getByLabelText('avdoede.relasjon.samboer'))
        })
        expect(getByText('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')).toBeDefined()
        expect(container).toMatchSnapshot()
    })
})
