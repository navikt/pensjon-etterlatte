import { render } from "@testing-library/react";
import SideIkkeFunnet from "./SideIkkeFunnet";
import UgyldigSoeker from "./UgyldigSoeker";

jest.mock("react-i18next", () => ({
    ...jest.requireActual("react-i18next"),
    useTranslation: () => {
        return { t: jest.fn((key) => key) };
    },
}));

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

describe("Enkel test av feilsider", () => {
    it("Side ikke funnet", async () => {
        const { findByText } = render(<SideIkkeFunnet />);

        expect(await findByText("sideIkkeFunnet.tittel")).toBeDefined();
        expect(await findByText("sideIkkeFunnet.alert")).toBeDefined();
    });

    it("Ugyldig søker", async () => {
        const { findByText } = render(<UgyldigSoeker/>);

        expect(findByText("Hei, du kan ikke søke om gjenlevendepensjon.")).toBeDefined();
    });
});
