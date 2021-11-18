import { renderHook, act } from "@testing-library/react-hooks";
import i18next from "../i18n";
import { useLanguage } from "./useLanguage";
import * as api from "../api/api";
import nb from '../mocks/nblocaleMock.json';

const navigator = { language: "nb-NO" };
Object.defineProperty(window, "navigator", {
    value: navigator,
    writable: true,
});

jest.mock("../i18n", () => {
    const originalModule = jest.requireActual('../i18n');
    return {
        changeLanguage: jest.fn(),
        addResourceBundle: jest.fn(),
        ...originalModule
    };
});

const localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
    value: localStorage,
    writable: true,
});

describe("useLanguage", () => {
    beforeEach(() => {
        jest.spyOn(api, "hentLocales").mockReturnValue({ nb: nb, nn: {}, en: {} });
    });
    it("Skal sette riktig verdi og ha blitt kalt to ganger", () => {
        const { result } = renderHook(() => useLanguage());

        expect(result.current.currentLanguage).toEqual("nb");
        expect(i18next.changeLanguage).toHaveBeenCalledTimes(1);

        act(() => {
            result.current.setLanguage("test");
        });

        expect(result.current.currentLanguage).toEqual("test");
        expect(i18next.changeLanguage).toHaveBeenCalledTimes(2);
    });

    it("Skal sette en verdi i localstorage", () => {
        const { result } = renderHook(() => useLanguage());

        act(() => {
            result.current.setLanguage("test");
        });
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it("Skal returnere state og setState", () => {
        const { result } = renderHook(() => useLanguage());

        expect(result.current.setLanguage).toBeDefined();
        expect(result.current.currentLanguage).toBeDefined();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
});
