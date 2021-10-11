import { render } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import OmDeg from "./OmDeg";

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

JSutils.guid = jest.fn(() => "123");
describe("Om deg og avdød", () => {
    it("Snapshot", () => {
        const { container } = render(<OmDeg />);
        expect(container).toMatchSnapshot();
    });
});
