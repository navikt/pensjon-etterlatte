import { act, render, fireEvent } from '@testing-library/react'
import MerOmSituasjonenDin from './MerOmSituasjonenDin'

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

jest.mock('../../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({
        state: { dinSituasjon: defaultValues },
        dispatch: jest.fn(),
    }),
}))

describe('Situasjonen din', () => {
    it('Snapshot', () => {
        const { container } = render(<MerOmSituasjonenDin />)
        expect(container).toMatchSnapshot()
    })

    it('Skal rendre selvstendig', () => {
        const { container, getByLabelText } = render(<MerOmSituasjonenDin />)
        act(() => {
            fireEvent.click(getByLabelText('jobbStatus.selvstendig.enk'))
        })

        expect(container).toMatchSnapshot()
    })
})
