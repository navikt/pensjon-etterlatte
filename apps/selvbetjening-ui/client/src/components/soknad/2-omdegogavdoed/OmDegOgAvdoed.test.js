import { act, render, fireEvent } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import OmDegOgAvdoed from "./OmDegOgAvdoed";

jest.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
        t: (str) => str,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}));

JSutils.guid = jest.fn(() => "123");

jest.mock("uuid", () => ({
    v4: () => "456",
}));

describe("Om deg og avdød", () => {
    it("Snapshot uten samboerskjema", () => {
        const { container } = render(<OmDegOgAvdoed />);
        expect(container).toMatchSnapshot();
    });

    it("Snapshot med sivilstatus samboer", () => {
        const { container, getByText, getByLabelText } = render(<OmDegOgAvdoed />);

        act(() => {
            fireEvent.click(getByLabelText("nySivilstatus.samboerskap"));
        });
        expect(getByText("omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift")).toBeDefined();
        expect(container).toMatchSnapshot();
    });
});
