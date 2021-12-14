import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { I18nextProvider } from "react-i18next";
import * as rr from "react-router-dom";
import * as api from "../../api/api";
import { useLanguage } from "../../hooks/useLanguage";
import i18n from "../../i18n";
import Soeknad from "./Soeknad";
import nb from '../../mocks/nbLocaleMock.json';


const Page = ({location}) => (
    <I18nextProvider i18n={i18n}>
        <rr.StaticRouter location={location}>
            <Soeknad />
        </rr.StaticRouter>
    </I18nextProvider>
);



describe("Soknad", () => {
    beforeAll(() => {
        jest.spyOn(api, "hentLocales").mockReturnValue(nb)
        renderHook(() => useLanguage());
    })
    it("skal rendre soknad - steg", () => {
        const { container } = render(
            <Page location="/skjema/steg/om-deg" />
        );
        expect(container.querySelectorAll("h1")[0].innerHTML).toEqual("Om deg");
    });

    it("skal rendre soknad - admin", () => {
        const { getByText } = render(
            <Page location="/skjema/admin" />
        );
        expect(getByText("Mock Søknad")).toBeDefined()
    });

    it("skal rendre soknad - admin", () => {
        const { container } = render(
            <Page location="/skjema/sendt" />
        );
        expect(container.querySelectorAll("h1")[0].innerHTML).toEqual("Søknaden din er sendt til oss");

    });
});
