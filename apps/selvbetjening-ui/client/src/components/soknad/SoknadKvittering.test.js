import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import * as JSutils from "nav-frontend-js-utils";
import { useLanguage } from "../../hooks/useLanguage";
import SoknadKvittering from "./SoknadKvittering";
import * as api from "../../api/api";
import nb from '../../mocks/nbLocaleMock.json';

/*
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
jest.mock()*/
JSutils.guid = jest.fn(() => "");

describe("SoknadKvittering", () => {
    it("skal matche snapshot", () => {
        // jest.spyOn(hook, 'useLanguage').mockImplementation(() => (null)); //be quiet
        jest.spyOn(api, "hentLocales").mockReturnValue({ nb: nb, nn: {}, en: {} });
        renderHook(() => useLanguage());

        const { container } = render(<SoknadKvittering />);
        expect(container).toMatchSnapshot();
    });
});
