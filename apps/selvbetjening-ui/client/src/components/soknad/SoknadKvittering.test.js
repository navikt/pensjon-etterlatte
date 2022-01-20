import { render } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import SoknadKvittering from "./SoknadKvittering";

jest.mock("react-i18next", () => ({
    ...jest.requireActual("react-i18next"),
    useTranslation: () => ({ t: jest.fn((key) => key) })
}));

JSutils.guid = jest.fn(() => "");

describe("SoknadKvittering", () => {

    it("skal matche snapshot", () => {
        const { container } = render(<SoknadKvittering />);
        expect(container).toMatchSnapshot();
    });
});
