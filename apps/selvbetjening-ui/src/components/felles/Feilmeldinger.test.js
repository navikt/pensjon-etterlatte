import Feilmeldinger, { konverterFeilmeldinger } from "./Feilmeldinger";
import { screen, render } from "@testing-library/react";
import { useTranslation } from "react-i18next";

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

describe("Feilmeldinger", () => {
    it("Nøkkel for oversettelse har korrekt format", () => {
        const errors = [
            {
                ref: { name: "name" },
                type: "type",
            },
        ];

        render(<Feilmeldinger errors={errors} />);

        const feilmelding = screen.getByText("feil.name.type");
        expect(feilmelding).not.toBeUndefined();
    });

    it("Kaster feil hvis 'ref' mangler", () => {
        console.error = jest.fn(); // Ignore error output

        const errors = [
            {
                ref: undefined,
                type: "type",
            },
        ];

        expect(() => render(<Feilmeldinger errors={errors} />)).toThrowError();
    });
});

const testErrors = {
    utdanning: {
        hoyesteFullfoerteUtdanning: {
            type: "required",
            message: "",
            ref: {
                name: "utdanning.hoyesteFullfoerteUtdanning",
            },
        },
    },
    andreYtelser: {
        kravOmAnnenStonad: {
            svar: {
                type: "required",
                message: "",
                ref: {
                    name: "andreYtelser.kravOmAnnenStonad.svar",
                },
            },
        },
        mottarPensjonUtland: {
            svar: {
                type: "required",
                message: "",
                ref: {
                    name: "andreYtelser.mottarPensjonUtland.svar",
                },
            },
        },
    },
    selvstendig: {
        beskrivelse: {
            type: "required",
            message: "",
            ref: {
                name: "selvstendig.beskrivelse",
            },
        },
        type: {
            type: "required",
            message: "",
            ref: {
                name: "selvstendig.type",
            },
        },
        endringIfmDoedsfall: {
            type: "required",
            message: "",
            ref: {
                name: "selvstendig.endringIfmDoedsfall",
            },
        },
    },
};

describe("Test konvertering", () => {
    it("Feilmelding skal ikke feile på ordet type", () => {
        const { t } = useTranslation();

        const res = konverterFeilmeldinger(testErrors, t);
        console.log(res);
    });
});
