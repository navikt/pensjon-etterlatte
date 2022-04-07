import { renderHook,act } from "@testing-library/react-hooks";
import useInnloggetBruker from "./useInnloggetBruker";
import * as api from "../api/api";

const mock = jest.fn(async () => {
    return "Ok"
})
jest.mock("../api/api", () => {
    return {
        hentInnloggetPerson: async () => {
            mock();
            return new Promise(() => {
                return "test";
            });
        },
    };
});

describe("useInnloggetBruker", () => {
    it("skal teste at innlogget person blir kalt", () => {
        const { result } = renderHook(() => useInnloggetBruker());

        expect(result.current).toBe(true);
        expect(mock).toBeCalledTimes(1);
    });
});
