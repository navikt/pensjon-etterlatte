import { render, fireEvent } from "@testing-library/react";
import i18n from "../../i18n"; // tar med denne for å slippe warnings fra komponenten vi tester
import HvorforSpoerVi from "./HvorforSpoerVi";

describe("HvorforSpoerVi", () => {
    it("skal rendre hvorfor spør vi som lukket boks", () => {
        const { container } = render(
            <HvorforSpoerVi>
                <span data-testid="test-tekst">Diverse informasjon om hvorfor vi spør!</span>
            </HvorforSpoerVi>
        );
        expect(container).toMatchSnapshot();
    });

    it("Skal åpne boksen og matche med innholdet vi legger inn", () => {
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
