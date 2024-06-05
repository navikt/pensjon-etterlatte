import { render, fireEvent } from "@testing-library/react";
import OmDeg from "./OmDeg";
import { describe, expect, it, vi } from 'vitest'
import {BrowserRouter} from "react-router-dom";

vi.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    ...vi.importActual("react-i18next"),
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
vi.mock("uuid", () => ({
    v4: () => "456"
}))

describe("Om deg og avdød", () => {
    it("Snapshot", () => {
        const { container, getByText } = render(<BrowserRouter><OmDeg /></BrowserRouter>);
        
        const bankkontoTypeUtenlandsk = container.querySelectorAll("[value='bankkontoType.utenlandsk']")[0];
        fireEvent.click(bankkontoTypeUtenlandsk);

        expect(getByText("omDeg.utbetalingsInformasjon.iban")).toBeDefined();
        expect(container).toMatchSnapshot();
    });
});
