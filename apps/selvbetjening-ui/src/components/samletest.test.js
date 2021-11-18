import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import SideIkkeFunnet from "./SideIkkeFunnet";
import UgyldigSoeker from "./UgyldigSoeker";
import * as api from '../api/api';
import nb from '../mocks/nblocaleMock.json';

describe("Side ikke funnet", () => {
    beforeEach(() => {
        jest.spyOn(api, "hentLocales").mockReturnValue({nb: nb, nn: {}, en: {} })
        renderHook(() => useLanguage());
    })
    it("Skal rendre ut innhold fra språkliste", () => {
        const { findByText } = render(
            <I18nextProvider i18n={i18n}>
                <SideIkkeFunnet />
            </I18nextProvider>
        );
        expect(findByText("Oi, her var det noe rusk")).toBeDefined();
        expect(findByText("Siden du har etterspurt finnes ikke.")).toBeDefined();
    });
});

describe("Side ikke funnet", () => {
  it("Skal rendre ut innhold fra språkliste", () => {
      const { findByText } = render(
          <I18nextProvider i18n={i18n}>
              <UgyldigSoeker />
          </I18nextProvider>
      );      
      expect(findByText("Hei, du kan ikke søke om gjenlevendepensjon.")).toBeDefined();
  });
});