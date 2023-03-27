import { render, fireEvent } from "@testing-library/react";
import { AccordionItem } from "./AccordionItem";
import TekstGruppe from "./fragmenter/TekstGruppe";
import Oppsummering from "./Oppsummering";

jest.mock("react-i18next", () => ({
    ...jest.requireActual("react-i18next"),
    useTranslation: () => ({
        t: jest.fn((key) => key),
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    })
}));

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

describe("Oppsummering", () => {
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

describe("Tekstgruppe", () => {
    it("Skal rendre testittel og testcontent", () => {
        const { getByText } = render(<TekstGruppe tittel="Testtittel" innhold={"Testcontent"} />);
        expect(getByText("Testtittel")).toBeDefined();
        expect(getByText("Testcontent")).toBeDefined();
    })
})