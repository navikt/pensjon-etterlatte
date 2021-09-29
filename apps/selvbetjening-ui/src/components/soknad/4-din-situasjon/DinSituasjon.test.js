import { render } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import DinSituasjon from "./DinSituasjon";

jest.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

const defaultValues = {
    jobbStatus: ["jobbStatus.arbeidstaker"],
    utdanning: {
        hoyesteFullfoerteUtdanning: "utdanning.mastergrad",
    },
    andreYtelser: {
        kravOmAnnenStonad: {
            svar: "Ja",
            beskrivelse: "Barnepensjon",
        },
        annenPensjon: {
            svar: "Ja",
            beskrivelse: "Skandia",
        },
        mottarPensjonUtland: {
            svar: "Ja",
            hvaSlagsPensjon: "Polsk Uførepensjon",
            fraHvilketLand: "Polen",
            bruttobeloepPrAar: "4000 PLN",
        },
    },
    arbeidsforhold: [
        {
            arbeidsgiver: "Potetskreller AS",
            ansettelsesforhold: "stillingType.midlertidig",
            stillingsprosent: "100%",
            forventerEndretInntekt: {
                svar: "Ja",
                beskrivelse: "150 000",
            },
        },
    ],
};

jest.mock("../../../context/soknad/SoknadContext", () => ({
    useSoknadContext: () => ({
        state: { dinSituasjon: defaultValues },
        dispatch: jest.fn(),
    }),
}));

JSutils.guid = jest.fn(() => "123");
describe("Om den avdøde", () => {
    it("Snapshot", () => {
        const { container } = render(<DinSituasjon />);
        expect(container).toMatchSnapshot();
    });
});
