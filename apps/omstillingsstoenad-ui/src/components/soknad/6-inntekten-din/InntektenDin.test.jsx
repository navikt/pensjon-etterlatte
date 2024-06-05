import { render } from '@testing-library/react'
import InntektenDin from './InntektenDin'
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

const defaultValues = {}

vi.mock('../../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({
        state: { inntektenDin: defaultValues },
        dispatch: vi.fn(),
    }),
}))

describe('Inntekten din', () => {
    it('Snapshot', () => {
        const { container } = render(<BrowserRouter><InntektenDin /></BrowserRouter>)
        expect(container).toMatchSnapshot()
    })

    it('Skal rendre selvstendig', () => {
        const { container } = render(<BrowserRouter><InntektenDin /></BrowserRouter>)

        expect(container).toMatchSnapshot()
    })
})
