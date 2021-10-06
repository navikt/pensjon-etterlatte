import { render, act, fireEvent } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import { AccordionItem } from "./AccordionItem";
import Oppsummering from "./Oppsummering";

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

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(() => ({ pathname: "/soknad/steg/oppsummering" })),
}));

JSutils.guid = jest.fn(() => "123");
describe("Om den avdøde", () => {
    it("Snapshot", () => {
        const { container } = render(<Oppsummering />);
        expect(container).toMatchSnapshot();
    });
});

describe("Test accordionItem", () => {
    it("skal endre aria-expanded", () => {
        const { container, getByText } = render(
            <AccordionItem tittel="Testtittel" defaultOpen={false}>
                Innhold
            </AccordionItem>
        );
        expect(container.querySelectorAll("[aria-expanded]")[0].getAttribute("aria-expanded")).toBe("false");
        fireEvent.click(getByText("Testtittel"));
        expect(container.querySelectorAll("[aria-expanded]")[0].getAttribute("aria-expanded")).toBe("true");
    });
    it("skal rendre innholdet synlig", () => {
        const { getByText } = render(
            <AccordionItem tittel="Testtittel" defaultOpen={true}>
                Innhold
            </AccordionItem>
        );
        expect(getByText("Innhold")).toBeDefined()
    });
});
