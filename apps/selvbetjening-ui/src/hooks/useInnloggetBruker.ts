import { useEffect, useState } from "react";
import { hentInnloggetPerson } from "../api";
import { ActionTypes as BrukerActionTypes, IBruker } from "../context/bruker/bruker";
import { hentAlder } from "../utils/dato";
import { gyldigAlder } from "../utils/alder";
import { useBrukerContext } from "../context/bruker/BrukerContext";
import { useHistory } from "react-router-dom";
import { useError } from "./useError";

const useInnloggetBruker = () => {
    const history = useHistory();

    const { setError } = useError();
    const { dispatch } = useBrukerContext();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        hentInnloggetPerson()
            .then((person: IBruker) => {
                const alder = hentAlder(person.foedselsdato!!);
                const kanSoeke = gyldigAlder(alder);

                dispatch({
                    type: BrukerActionTypes.HENT_INNLOGGET_BRUKER,
                    payload: { ...person, alder, kanSoeke },
                });

                if (!kanSoeke) {
                    history.push("/ugyldig-alder");
                }
            })
            .catch(() => {
                setLoading(false);
                setError("Klarte ikke å hente brukerinformasjon. Vennligst prøv igjen senere.");
            })
            .finally(() => setLoading(false));
    }, []);

    return loading;
};

export default useInnloggetBruker;
