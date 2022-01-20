import { render, fireEvent } from "@testing-library/react";
import HvorforSpoerVi from "./HvorforSpoerVi";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (str) => str,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    })
}));

describe("HvorforSpoerVi", () => {
    it("skal rendre hvorfor spør vi som lukket boks", () => {
        const { container } = render(
            <HvorforSpoerVi>
                <span data-testid="test-tekst">Diverse informasjon om hvorfor vi spør!</span>
            </HvorforSpoerVi>
        );
        expect(container).toMatchSnapshot();
    });

    xit("Skal åpne boksen og matche med innholdet vi legger inn", () => {
        const { container, getByTestId } = render(
            <HvorforSpoerVi>
                <span data-testid="test-tekst">Diverse informasjon om hvorfor vi spør!</span>
            </HvorforSpoerVi>
        );

        fireEvent.click(getByTestId("hvorforPanel_toggle"));
        expect(getByTestId("test-tekst").innerHTML).toEqual("Diverse informasjon om hvorfor vi spør!");
        expect(container).toMatchSnapshot();
    });
});
