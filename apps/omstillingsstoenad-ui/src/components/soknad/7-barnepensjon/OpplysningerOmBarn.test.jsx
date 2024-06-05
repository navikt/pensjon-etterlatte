import { render } from '@testing-library/react'
import OpplysningerOmBarnepensjon from './OpplysningerOmBarnepensjon'
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

describe('Opplysninger om barn', () => {
    it('Snapshot', () => {
        const { container } = render(<BrowserRouter><OpplysningerOmBarnepensjon /></BrowserRouter>)
        expect(container).toMatchSnapshot()
    })
})
