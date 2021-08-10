import ReactDOM from "react-dom";
import { act, screen, fireEvent } from "@testing-library/react";
import SoknadForside from "./SoknadForside";
import { SoknadProvider } from "../../context/soknad/SoknadContext";
import i18n from "../../i18n";
import { I18nextProvider } from "react-i18next";

jest.mock("../../context/bruker/BrukerContext", () => ({
    useBrukerContext: () => {
        return {
            state: {
                fornavn: "STERK",
                etternavn: "BUSK"
            }
        }
    }
}))

let container;

beforeEach(() => {
    container = document.createElement("root");
    document.body.appendChild(container);

    act(() => {
        ReactDOM.render((
                <I18nextProvider i18n={i18n}>
                    <SoknadProvider>
                        <SoknadForside/>
                    </SoknadProvider>
                </I18nextProvider>
        ), container)
    });
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("Samtykke", () => {
    it("Knapp vises ikke hvis samtykke mangler", async () => {
        const bekreftSjekkboks = screen.getByLabelText("Jeg, STERK BUSK, bekrefter at jeg vil gi riktige og fullstendige opplysninger.");
        expect(bekreftSjekkboks).toBeVisible()
        expect(bekreftSjekkboks).not.toBeChecked()

        const startKnapp = screen.queryByText("forside.startSoeknad")
        expect(startKnapp).toBeNull()
    })

    it("Knapp vises hvis samtykke er huket av", async () => {
        const bekreftSjekkboks = screen.getByLabelText("Jeg, STERK BUSK, bekrefter at jeg vil gi riktige og fullstendige opplysninger.");
        expect(bekreftSjekkboks).toBeVisible()

        await act(async () => {
            fireEvent.click(bekreftSjekkboks)
        })
        expect(bekreftSjekkboks).toBeChecked()

        const startKnapp = await screen.findByText("Start søknad")
        expect(startKnapp).toBeVisible()
    })
})

describe("Velkomstmelding", () => {
    it("Velkomstmelding med brukers navn vises", async () => {
        const velkomstmelding = await screen.findByText("Hei, STERK BUSK")

        expect(velkomstmelding).toBeVisible()
    })
})
