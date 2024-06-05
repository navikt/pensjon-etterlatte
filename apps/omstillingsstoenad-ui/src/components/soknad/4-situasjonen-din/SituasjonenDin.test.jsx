import { render } from '@testing-library/react'
import SituasjonenDin from './SituasjonenDin'
import { describe, expect, it, vi } from 'vitest'
import {BrowserRouter} from "react-router-dom";

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

describe('Omsorg for barn', () => {
    beforeAll(() => {
        vi.useFakeTimers('modern')
    })

    afterAll(() => {
        vi.useRealTimers()
    })

    it('Snapshot', () => {
        vi.setSystemTime(new Date(2024, 0, 1))

        const { container } = render(<BrowserRouter><SituasjonenDin /></BrowserRouter>)
        expect(container).toMatchSnapshot()
    })
})
