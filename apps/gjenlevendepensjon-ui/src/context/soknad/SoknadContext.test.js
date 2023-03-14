import { act } from "@testing-library/react-hooks";
import { renderHook } from "@testing-library/react";
import { SoknadProvider, useSoknadContext } from "./SoknadContext";
import { ActionTypes, tomSoeknad } from "./soknad";

const setup = () => {
    const wrapper = ({ children }) => <SoknadProvider>{children}</SoknadProvider>;

    return renderHook(() => useSoknadContext(), { wrapper });
};

describe("Reducer fungerer som forventet", () => {
    test("Lagre søknad", () => {
        const { result } = setup();

        const now = new Date();

        act(() => {
            result.current.dispatch({ type: ActionTypes.LAGRE_SOEKNAD, payload: now });
        });

        expect(result.current.state.klarForLagring).toBeFalsy();
        expect(result.current.state.sistLagretDato).toBe(now);
    });

    test("Tilbakestill søknad", () => {
        const { result } = setup();

        act(() => {
            result.current.dispatch({ type: ActionTypes.TILBAKESTILL });
        });

        expect(result.current.state).toBe(tomSoeknad);
    });

    test("Hent søknad", () => {
        const { result } = setup();

        const soeknad = {
            ...tomSoeknad,
            harSamtykket: true,
            sistLagretDato: new Date(),
            visFortsettSoeknadModal: true,
        };

        act(() => {
            result.current.dispatch({ type: ActionTypes.HENT_SOEKNAD, payload: soeknad });
        });

        expect(result.current.state.klarForLagring).toBeFalsy();
        expect(result.current.state).toStrictEqual(soeknad);
    });
});
