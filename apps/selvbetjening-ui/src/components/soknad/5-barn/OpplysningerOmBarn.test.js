import { render } from "@testing-library/react";
import uuid from "uuid";
import lodash from "lodash";
import * as JSutils from "nav-frontend-js-utils";
import OpplysningerOmBarn from "./OpplysningerOmBarn";

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
describe("Om den avdøde", () => {
    it("Snapshot", () => {
        const { container } = render(<OpplysningerOmBarn />);
        expect(container).toMatchSnapshot();
    });
});
