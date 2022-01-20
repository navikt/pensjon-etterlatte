import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import * as rr from "react-router-dom";
import i18n from "../../i18n";
import Soeknad from "./Soeknad";

const Page = ({location}) => (
    <I18nextProvider i18n={i18n}>
        <rr.StaticRouter location={location}>
            <Soeknad />
        </rr.StaticRouter>
    </I18nextProvider>
);

describe("Soknad", () => {
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
