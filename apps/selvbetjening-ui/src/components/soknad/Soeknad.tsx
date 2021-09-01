import { useEffect, useState } from "react";
import { hentSoeknad, lagreSoeknad } from "../../api";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { Route } from "react-router";
import SoknadForside from "./SoknadForside";
import SoknadDialog from "./SoknadDialog";
import SoknadKvittering from "./SoknadKvittering";
import { useHistory } from "react-router-dom";
import { ActionTypes, ISoeknad } from "../../context/soknad/soknad";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import Admin from "../dev/Admin";
import Spinner from "../felles/Spinner";

const Soeknad = () => {
    const history = useHistory();

    const { state: bruker } = useBrukerContext();

    const { state, dispatch } = useSoknadContext();

    const [lasterSoeknad, settLasterSoeknad] = useState(true);

    useEffect(() => {
        if (!bruker.kanSoeke) return;

        hentSoeknad()
            .then((soeknad: ISoeknad | undefined) => {
                if (!soeknad?.harSamtykket) {
                    history.push("/");
                } else {
                    dispatch({ type: ActionTypes.HENT_SOEKNAD, payload: soeknad });
                }
            })
            .catch(() => history.push("/"))
            .finally(() => settLasterSoeknad(false));
    }, [bruker]);

    useEffect(() => {
        // TODO: Finne bedre løsning
        //  En mulig løsning kan være at bruker alltid sendes til start ved refresh, men får info om pågående søknad
        //  og mulighet til å fortsette der de slapp. Deretter kan vi sende personen til det steget de stoppet på.

        if (state.klarForLagring) {
            const now = new Date();

            lagreSoeknad({ ...state, sistLagretDato: now })
                .then(() => dispatch({ type: ActionTypes.LAGRE_SOEKNAD, payload: now }))
                .catch((err) => console.error(err));
        }
    }, [state.klarForLagring]);

    return (
        <>
            <Spinner visible={lasterSoeknad} label={"Henter informasjon ..."}/>

            {/* TODO: Kun i dev/qa*/}
            <Route path={"/soknad/admin"} component={Admin} />

            <Route path={"/soknad/steg"} component={SoknadDialog} />

            <Route path={"/soknad/sendt"} component={SoknadKvittering} />

            <Route exact path={"/"} component={SoknadForside} />
        </>
    );
}

export default Soeknad;
