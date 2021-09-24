import { render } from "@testing-library/react";
import * as rr from "react-router-dom";
import Stegviser from "./Stegviser";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
    ...jest.requireActual("react-i18next"),
    useTranslation: () => {
        return { t: jest.fn((key) => key) }; // Fordi vi ikke oversettelsen for testene
    },
}));

const testSteg = (number) => {
    const { container } = render(<Stegviser />);
    expect(container.querySelectorAll(".stegindikator__steg-inner--aktiv")[0].firstChild?.textContent).toEqual(number);
    expect(container).toMatchSnapshot();
};

describe("Stegviser", () => {
    it("skal vise riktig steg 1", () => {
        rr.useLocation.mockReturnValueOnce({ pathname: "/soknad/steg/om-deg" });
        testSteg("1");
    });
    it("skal vise riktig steg 2", () => {
        rr.useLocation.mockReturnValueOnce({ pathname: "/soknad/steg/om-deg-og-avdoed" });
        testSteg("2");
    });
    it("skal vise riktig steg 3", () => {
        rr.useLocation.mockReturnValueOnce({ pathname: "/soknad/steg/om-den-avdoede" });
        testSteg("3");
    });
    it("skal vise riktig steg 4", () => {
        rr.useLocation.mockReturnValueOnce({ pathname: "/soknad/steg/din-situasjon" });
        testSteg("4");
    });
    it("skal vise riktig steg 5", () => {
        rr.useLocation.mockReturnValueOnce({ pathname: "/soknad/steg/om-barn" });
        testSteg("5");
    });
    it("skal vise riktig steg 6", () => {
        rr.useLocation.mockReturnValueOnce({ pathname: "/soknad/steg/oppsummering" });
        testSteg("6");
    });
});
