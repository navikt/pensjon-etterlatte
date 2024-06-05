import { act, render, fireEvent } from '@testing-library/react'
import MerOmSituasjonenDin from './MerOmSituasjonenDin'
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

const defaultValues = {
    jobbStatus: ['jobbStatus.arbeidstaker'],
    utdanning: {
        hoyesteFullfoerteUtdanning: 'utdanning.mastergrad',
    },
    arbeidsforhold: [
        {
            arbeidsgiver: 'Potetskreller AS',
            typeArbeidsmengde: 'arbeidsmengde.timer',
            arbeidsmengde: '12',
            ansettelsesforhold: 'stillingType.midlertidig',
            endretArbeidssituasjon: {
                svar: 'Ja',
                opplysning: 'Mister kanskje jobben',
            },
            sagtOppEllerRedusert: 'Reduserer pga vond rygg'
        },
    ],
}

vi.mock('../../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({
        state: { merOmSituasjonenDin: defaultValues },
        dispatch: vi.fn(),
    }),
}))

describe('Mer om situasjonen din', () => {
    it('Snapshot', () => {
        const { container } = render(<BrowserRouter><MerOmSituasjonenDin /></BrowserRouter>)
        expect(container).toMatchSnapshot()
    })

    it('Skal rendre selvstendig', () => {
        const { container, getByLabelText } = render(<BrowserRouter><MerOmSituasjonenDin /></BrowserRouter>)
        act(() => {
            fireEvent.click(getByLabelText('jobbStatus.selvstendig'))
        })

        expect(container).toMatchSnapshot()
    })
})
