import { useEffect } from "react";
import { hentInnloggetPerson } from "../../api";
import { ActionTypes, IBruker } from "../../context/bruker/bruker";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { Route, useRouteMatch } from "react-router";
import SoknadForside from "./SoknadForside";
import SoknadDialog from "./SoknadDialog";
import SoknadKvittering from "./SoknadKvittering";
import { gyldigAlder, hentAlder } from "../../utils/Utils";
import { useHistory } from "react-router-dom";

const Soeknad = () => {
    const { path } = useRouteMatch();
    const history = useHistory();

    const {
        state: brukerState,
        dispatch: brukerDispatch
    } = useBrukerContext();

    useEffect(() => {
        if (!!brukerState?.foedselsnummer) {
            const alder = hentAlder(brukerState.foedselsdato!!);

            if (!gyldigAlder(alder)) {
                history.push("/ugyldig-alder")
            }
        } else {
            hentInnloggetPerson()
                .then((person: IBruker) => {
                    brukerDispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
                })
                .catch(() => {
                    if (process.env.NODE_ENV === "development") {
                        brukerDispatch({ type: ActionTypes.INIT_TEST_BRUKER });
                    }
                });
        }
    });

    return (
        <>
            <Route exact path={`${path}/`} component={SoknadForside} />
            <Route path={`${path}/steg`} component={SoknadDialog} />
            <Route path={`${path}/sendt/:id`} component={SoknadKvittering} />
        </>
    );
}

export default Soeknad;
