import { FC, useEffect } from "react";
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
    useEffect(() => {
        console.log(`Aktivt steg: ${state.aktivtSteg}`);
        history.push(`/soknad/steg/${state.aktivtSteg}`);
    }, [history, state.aktivtSteg]);

    const forrige = () => dispatch({ type: StegActionTypes.FORRIGE });
    const neste = () => dispatch({ type: StegActionTypes.NESTE });

    const alleSteg = state.steg.map((steg, index) => {
        return {
            index: index,
            label: steg.label,
            disabled: steg.disabled,
        };
    });

    return (
        <>
            <Stegindikator
                aktivtSteg={state.aktivtSteg - 1}
                steg={alleSteg}
                onChange={(index) => {
                    history.push(`${path}/steg/${index + 1}`);
                }}
            />

            <div className={"app"}>
                {state.steg.map((steg, index) => {
                    const stegNr = index + 1;

                    return (
                        <Route key={index} path={`${path}/steg/${stegNr}`} component={steg.component}>
                            <steg.component forrige={forrige} neste={neste} />
                        </Route>
                    );
                })}
            </div>
        </>
    );
};

export default SoknadDialog;
