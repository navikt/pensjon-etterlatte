import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Hjelpetekst from "./Hjelpetekst";

describe("Hjelpetekst", () => {
    it("skal rendre hjelpetekst", () => {
        const { container, getByTestId } = render(
            <Hjelpetekst>
                <div data-testid="test-tekst">Dette er hjelpetekst</div>
            </Hjelpetekst>
        );
        expect(getByTestId("test-tekst").innerHTML).toEqual("Dette er hjelpetekst");
        expect(container.querySelectorAll('[aria-hidden="false"]').length).toBe(0);
    });
    it("skal rendre hjelpetekst og være synlig", () => {
        const { container, getByTestId } = render(
            <Hjelpetekst>
                <div data-testid="test-tekst">Dette er hjelpetekst</div>
            </Hjelpetekst>
        );
        act(() => {
            fireEvent.click(getByTestId("hjelpetekst-button"));
        });
        expect(container.querySelectorAll('[aria-hidden="false"]').length).toBe(1);
    });
});
