import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import SideIkkeFunnet from "./SideIkkeFunnet";
import UgyldigSoeker from "./UgyldigSoeker";

describe("Side ikke funnet", () => {
    it("Skal rendre ut innhold fra språkliste", () => {
        const { getByText } = render(
            <I18nextProvider i18n={i18n}>
                <SideIkkeFunnet />
            </I18nextProvider>
        );
        expect(getByText("Oi, her var det noe rusk")).toBeDefined();
        expect(getByText("Siden du har etterspurt finnes ikke.")).toBeDefined();
    });
});

describe("Side ikke funnet", () => {
  it("Skal rendre ut innhold fra språkliste", () => {
      const { getByText } = render(
          <I18nextProvider i18n={i18n}>
              <UgyldigSoeker />
          </I18nextProvider>
      );      
      expect(getByText("Hei, du kan ikke søke om gjenlevendepensjon.")).toBeDefined();
  });
});