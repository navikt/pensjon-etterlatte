import { useEffect, useState } from "react";
import { hentInnloggetPerson, hentSoeknad } from "../../api";
import { IBruker, ActionTypes as BrukerActionTypes } from "../../context/bruker/bruker";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { Route } from "react-router";
import SoknadForside from "./SoknadForside";
import SoknadDialog from "./SoknadDialog";
import SoknadKvittering from "./SoknadKvittering";
import { hentAlder } from "../../utils/dato";
import { gyldigAlder } from "../../utils/alder";
import { useHistory } from "react-router-dom";
import Spinner from "../felles/Spinner";
import { ISoeknad, ActionTypes as SoeknadActionTypes } from "../../context/soknad/soknad";
import { useSoknadContext } from "../../context/soknad/SoknadContext";

const Soeknad = () => {
    const history = useHistory();

    const { dispatch: brukerDispatch } = useBrukerContext();
    const { dispatch: soeknadDispatch } = useSoknadContext();

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
            .catch((e) => {
                if (process.env.NODE_ENV === "development") {
                    // TODO: Dette må fjernes før appen går i prod. Finne bedre alternativ for kjøring lokalt.
                    brukerDispatch({ type: BrukerActionTypes.INIT_TEST_BRUKER });
                } else {
                    console.error(e)
                }
            })
            .finally(() => setLoading(false));

        setLoading(true);

        hentSoeknad()
            .then((soeknad: ISoeknad) => {
                if (!soeknad.harSamtykket) {
                    history.push("/");
                }

                soeknadDispatch({ type: SoeknadActionTypes.HENT_SOEKNAD, payload: soeknad });
            })
            .catch((err) => {
                console.error("Klarte ikke hente eksisterende søknad fra NAV sine systemer.", err);
                history.push("/"); // Sende brukeren til forsiden
            })
            .finally(() => setLoading(false));
    }, [brukerDispatch, soeknadDispatch, history]);

    return (
        <>
            <Spinner visible={loading} label={"Henter informasjon ..."}/>

            <Route path={"/soknad/steg"} component={SoknadDialog} />

            <Route path={"/soknad/sendt/:id"} component={SoknadKvittering} />

            <Route exact path={"/"} component={SoknadForside} />
        </>
    );
}

export default Soeknad;
