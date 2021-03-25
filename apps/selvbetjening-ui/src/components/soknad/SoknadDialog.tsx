import { FC } from "react";
import { Route, useRouteMatch } from "react-router";
import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useHistory } from "react-router-dom";
import { StegActionTypes } from "../../context/steg/steg";

const SoknadDialog: FC = () => {
    const history = useHistory();

    let { path } = useRouteMatch();

    const { state, dispatch } = useStegContext();

    /*
     * TODO: Steghåndtering må forbedres, dette er ikke helt bra...
     */

    const forrige = (nåværendeSteg: number) => {
        const forrigeSteg = nåværendeSteg - 1;

        dispatch({ type: StegActionTypes.FORRIGE, payload: forrigeSteg });

        history.push(`/soknad/steg/${forrigeSteg}`);
    };
    const neste = (nåværendeSteg: number) => {
        const nesteSteg = nåværendeSteg + 1;

        dispatch({ type: StegActionTypes.NESTE, payload: nesteSteg });

        history.push(`/soknad/steg/${nesteSteg}`);
    };

    const alleSteg = state.steg.map((steg, index) => {
        return {
            index: index + 1,
            label: steg.label,
            disabled: steg.disabled,
        };
    });

    return (
        <>
            <Stegindikator
                aktivtSteg={(state.aktivtSteg ?? 1) - 1}
                steg={alleSteg}
                onChange={(index) => {
                    history.push(`/soknad/steg/${index + 1}`);
                }}
            />

            <div className={"app"}>
                {state.steg.map((steg, index) => {
                    const stegNr = index + 1;

                    return (
                        <Route key={index} path={`${path}/steg/${stegNr}`} component={steg.component}>
                            <steg.component forrige={() => forrige(stegNr)} neste={() => neste(stegNr)} />
                        </Route>
                    );
                })}
            </div>
        </>
    );
};

export default SoknadDialog;
