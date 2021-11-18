import ReactDOM from "react-dom";
import { act, screen, fireEvent } from "@testing-library/react";
import { renderHook} from "@testing-library/react-hooks";
import SoknadForside from "./SoknadForside";
import { SoknadProvider } from "../../context/soknad/SoknadContext";
import i18n from "../../i18n";
import { I18nextProvider } from "react-i18next";
import * as api from "../../api/api";
import nb from '../../mocks/nblocaleMock.json';

jest.mock("../../context/bruker/BrukerContext", () => ({
    useBrukerContext: () => {
        return {
            state: {
                fornavn: "STERK",
                etternavn: "BUSK",
            },
        };
    },
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useLocation: jest.fn().mockImplementation(() => {
        return {
            pathname: "/testroute",
            search: "",
            hash: "",
            state: null,
        };
    }),
}));

// Hacker til språk, Kan påvirke andre steder som bruker navigator
const navigator = { language: "nb-NO" };
Object.defineProperty(window, "navigator", {
    value: navigator,
    writable: true,
});

let container;

beforeEach(() => {
    container = document.createElement("root");
    document.body.appendChild(container);

    jest.spyOn(api, "hentLocales").mockReturnValue({nb: nb, nn: {}, en: {} })
    renderHook(() => useLanguage());

    act(() => {
        ReactDOM.render(
            <I18nextProvider i18n={i18n}>
                <SoknadProvider>
                    <SoknadForside />
                </SoknadProvider>
            </I18nextProvider>,
            container
        );
    });
});



afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe("Samtykke", () => {
    xit("Knapp vises ikke hvis samtykke mangler", async () => {
        const bekreftSjekkboks = await screen.findByText(
            "Jeg, STERK BUSK, bekrefter at jeg vil gi riktige og fullstendige opplysninger."
        );
        expect(bekreftSjekkboks).toBeVisible();
        expect(bekreftSjekkboks).not.toBeChecked();

        const startKnapp = screen.queryByText("forside.startSoeknad");
        expect(startKnapp).toBeNull();
    });

    it("Knapp vises hvis samtykke er huket av", async () => {
        const bekreftSjekkboks = await screen.findByLabelText(
            "Jeg, STERK BUSK, bekrefter at jeg vil gi riktige og fullstendige opplysninger."
        );
        expect(bekreftSjekkboks).toBeVisible();

        await act(async () => {
            fireEvent.click(bekreftSjekkboks);
        });
        expect(bekreftSjekkboks).toBeChecked();

        const startKnapp = await screen.findByText("Start søknad");
        expect(startKnapp).toBeVisible();
    });
});

describe("Velkomstmelding", () => {
    it("Velkomstmelding med brukers navn vises", async () => {
        const velkomstmelding = await screen.findByText("Hei, STERK BUSK");

        expect(velkomstmelding).toBeVisible();
    });
});
