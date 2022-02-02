import { render, fireEvent } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import * as uuid from "uuid";
import OmDeg from "./OmDeg";

jest.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...jest.requireActual("react-i18next"),
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

// Her må det mockes litt forskjellige guid-pakker...
jest.mock("uuid", () => ({
    v4: () => "456"
}))
describe("Om deg og avdød", () => {
    it("Snapshot", () => {
        jest.spyOn(JSutils, "guid").mockReturnValue("123");

        const { container, getByText } = render(<OmDeg />);
        
        const oppholderSegINorge = container.querySelectorAll("[name='oppholderSegINorge'][value='radiobuttons.nei']")[0];
        fireEvent.click(oppholderSegINorge);
        const bankkontoTypeUtenlandsk = container.querySelectorAll("[value='bankkontoType.utenlandsk']")[0];
        fireEvent.click(bankkontoTypeUtenlandsk);

        expect(getByText("omDeg.utbetalingsInformasjon.iban")).toBeDefined();
        expect(container).toMatchSnapshot();
    });
});
