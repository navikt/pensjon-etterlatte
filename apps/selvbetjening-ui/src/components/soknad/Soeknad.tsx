import { useEffect, useState } from "react";
import { hentInnloggetPerson } from "../../api";
import { ActionTypes, IBruker } from "../../context/bruker/bruker";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { Route } from "react-router";
import SoknadForside from "./SoknadForside";
import SoknadDialog from "./SoknadDialog";
import SoknadKvittering from "./SoknadKvittering";
import { hentAlder } from "../../utils/dato";
import { gyldigAlder } from "../../utils/alder";
import { useHistory } from "react-router-dom";
import Spinner from "../felles/Spinner";

const Soeknad = () => {
    const history = useHistory();

    const { dispatch } = useBrukerContext();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        hentInnloggetPerson()
            .then((person: IBruker) => {
                const alder = hentAlder(person.foedselsdato!!);

                if (!gyldigAlder(alder)) {
                    history.push("/ugyldig-alder")
                } else {
                    dispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
                }
            })
            .catch((e) => {
                if (process.env.NODE_ENV === "development") {
                    // TODO: Dette må fjernes før appen går i prod. Finne bedre alternativ for kjøring lokalt.
                    dispatch({ type: ActionTypes.INIT_TEST_BRUKER });
                } else {
                    console.error(e)
                }
            })
            .finally(() => setLoading(false));
    }, [dispatch, history]);

    return (
        <>
            <Spinner visible={loading} label={"Henter brukerinformasjon ..."}/>

            <Route path={"/soknad/steg"} component={SoknadDialog} />

            <Route path={"/soknad/sendt/:id"} component={SoknadKvittering} />

            <Route exact path={"/"} component={SoknadForside} />
        </>
    );
}

export default Soeknad;
