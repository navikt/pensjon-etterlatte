import { useEffect, useState } from "react";
import { hentInnloggetPerson, hentSoeknad, lagreSoeknad } from "../../api";
import { ActionTypes as BrukerActionTypes, IBruker } from "../../context/bruker/bruker";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { Route } from "react-router";
import SoknadForside from "./SoknadForside";
import SoknadDialog from "./SoknadDialog";
import SoknadKvittering from "./SoknadKvittering";
import { hentAlder } from "../../utils/dato";
import { gyldigAlder } from "../../utils/alder";
import { useHistory } from "react-router-dom";
import Spinner from "../felles/Spinner";
import { ActionTypes as SoeknadActionTypes, ISoeknad } from "../../context/soknad/soknad";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import Admin from "../dev/Admin";

const Soeknad = () => {
    const history = useHistory();

    const { dispatch: brukerDispatch } = useBrukerContext();
    const { state, dispatch: soeknadDispatch } = useSoknadContext();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        hentInnloggetPerson()
            .then((person: IBruker) => {
                const alder = hentAlder(person.foedselsdato!!);

                if (!gyldigAlder(alder)) {
                    history.push("/ugyldig-alder")
                } else {
                    brukerDispatch({ type: BrukerActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
                }
            })
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);

        hentSoeknad()
            .then((soeknad: ISoeknad | undefined) => {
                if (!soeknad?.harSamtykket) {
                    history.push("/");
                } else {
                    soeknadDispatch({ type: SoeknadActionTypes.HENT_SOEKNAD, payload: soeknad });
                }
            })
            .catch((err) => {
                console.error("Klarte ikke hente eksisterende søknad fra NAV sine systemer.", err);
                history.push("/"); // Sende brukeren til forsiden
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        // TODO: Finne bedre løsning
        //  En mulig løsning kan være at bruker alltid sendes til start ved refresh, men får info om pågående søknad
        //  og mulighet til å fortsette der de slapp. Deretter kan vi sende personen til det steget de stoppet på.

        if (state.klarForLagring) {
            const now = new Date();

            lagreSoeknad({ ...state, sistLagretDato: now })
                .then(() => soeknadDispatch({ type: SoeknadActionTypes.LAGRE_SOEKNAD, payload: now }))
                .catch((err) => console.error(err));
        }
    }, [state]);

    return (
        <>
            <Spinner visible={loading} label={"Henter informasjon ..."}/>

            {/* TODO: Kun i dev/qa*/}
            <Route path={"/soknad/admin"} component={Admin} />

            <Route path={"/soknad/steg"} component={SoknadDialog} />

            <Route path={"/soknad/sendt/:id"} component={SoknadKvittering} />

            <Route exact path={"/"} component={SoknadForside} />
        </>
    );
}

export default Soeknad;
