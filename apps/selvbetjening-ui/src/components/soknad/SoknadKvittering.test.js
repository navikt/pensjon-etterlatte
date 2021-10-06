import { render } from "@testing-library/react";
import * as JSutils from "nav-frontend-js-utils";
import SoknadKvittering from "./SoknadKvittering";

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
JSutils.guid = jest.fn(() => "");


describe("SoknadKvittering", () => {
  
    it("skal matche snapshot", () => {
        const { container } = render(<SoknadKvittering />);
        expect(container).toMatchSnapshot();
    });
});
