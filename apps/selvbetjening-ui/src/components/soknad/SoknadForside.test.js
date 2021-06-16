import { render, screen, fireEvent } from "@testing-library/react";
import SoknadForside from "./SoknadForside";
import { SoknadProvider } from "../../context/soknad/SoknadContext";
import { BrukerProvider } from "../../context/bruker/BrukerContext";

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

beforeEach(() => {
    render(
            <SoknadProvider>
                <BrukerProvider>
                    <SoknadForside/>
                </BrukerProvider>
            </SoknadProvider>
    )
})

describe("Samtykke", () => {
    it("Knapp vises ikke hvis samtykke mangler", () => {
        const bekreftSjekkboks = screen.getByLabelText("forside.samtykke.bekreftelse");
        expect(bekreftSjekkboks).toBeVisible()
        expect(bekreftSjekkboks).not.toBeChecked()

        const startKnapp = screen.queryByText("forside.startSoeknad")
        expect(startKnapp).toBeNull()
    })

    it("Knapp vises hvis samtykke er huket av", async () => {
        const bekreftSjekkboks = screen.getByLabelText("forside.samtykke.bekreftelse");
        expect(bekreftSjekkboks).toBeVisible()

        fireEvent.click(bekreftSjekkboks);
        expect(bekreftSjekkboks).toBeChecked()

        const startKnapp = await screen.findByText("forside.startSoeknad")
        expect(startKnapp).toBeVisible()
    })
})
