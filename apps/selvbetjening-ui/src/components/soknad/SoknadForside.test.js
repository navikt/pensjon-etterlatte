import ReactDOM from "react-dom";
import { act, screen, fireEvent } from "@testing-library/react";
import SoknadForside from "./SoknadForside";
import { SoknadProvider } from "../../context/soknad/SoknadContext";

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {
                }),
            },
        };
    },
}));

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
                <SoknadProvider>
                    <SoknadForside/>
                </SoknadProvider>
        ), container)
    });
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("Samtykke", () => {
    it("Knapp vises ikke hvis samtykke mangler", async () => {
        const bekreftSjekkboks = screen.getByLabelText("forside.samtykke.bekreftelse");
        expect(bekreftSjekkboks).toBeVisible()
        expect(bekreftSjekkboks).not.toBeChecked()

        const startKnapp = screen.queryByText("forside.startSoeknad")
        expect(startKnapp).toBeNull()
    })

    it("Knapp vises hvis samtykke er huket av", async () => {
        const bekreftSjekkboks = screen.getByLabelText("forside.samtykke.bekreftelse");
        expect(bekreftSjekkboks).toBeVisible()

        await act(async () => {
            fireEvent.click(bekreftSjekkboks)
        })
        expect(bekreftSjekkboks).toBeChecked()

        const startKnapp = await screen.findByText("forside.startSoeknad")
        expect(startKnapp).toBeVisible()
    })
})

describe("Velkomstmelding", () => {
    it("Velkomstmelding med brukers navn vises", async () => {
        const velkomstmelding = await screen.findByText(/forside.hei/)

        expect(velkomstmelding.textContent).toBe("forside.hei, STERK BUSK")
    })
})
