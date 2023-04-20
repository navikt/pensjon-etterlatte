import { act, render, fireEvent } from '@testing-library/react'
import DinSituasjon from './DinSituasjon'

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...jest.requireActual('react-i18next'),
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
    andreYtelser: {
        kravOmAnnenStonad: {
            svar: 'Ja',
            beskrivelse: 'Barnepensjon',
        },
        annenPensjon: {
            svar: 'Ja',
            beskrivelse: 'Skandia',
        },
        mottarPensjonUtland: {
            svar: 'Ja',
            hvaSlagsPensjon: 'Polsk Uførepensjon',
            fraHvilketLand: 'Polen',
            bruttobeloepPrAar: '4000 PLN',
        },
    },
    arbeidsforhold: [
        {
            arbeidsgiver: 'Potetskreller AS',
            ansettelsesforhold: 'stillingType.midlertidig',
            stillingsprosent: '100%',
            forventerEndretInntekt: {
                svar: 'Ja',
                beskrivelse: '150 000',
            },
        },
    ],
}

jest.mock('../../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({
        state: { dinSituasjon: defaultValues },
        dispatch: jest.fn(),
    }),
}))

describe('Om den avdøde', () => {
    it('Snapshot', () => {
        const { container } = render(<DinSituasjon />)
        expect(container).toMatchSnapshot()
    })

    it('Skal rendre selvstendig', () => {
        const { container, getByLabelText } = render(<DinSituasjon />)
        act(() => {
            fireEvent.click(getByLabelText('jobbStatus.selvstendig'))
        })
        //console.log(container.querySelectorAll("input[name=selvstendig[0].forventerEndretInntekt.svar]"))
        /*
        act(() => {
           fireEvent.change(getByText("dinSituasjon.selvstendig.forventerEndretInntekt.svar"), { target: { value: "Ja" } });
        });
        */
        //expect(getByLabelText("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse")).toBeDefined();
        expect(container).toMatchSnapshot()
    })
})
