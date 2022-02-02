import "./Spraakvalg.scss";
import { Language } from "../../i18n";
import { Select, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { ActionTypes } from "../../context/soknad/soknad";
import { useEffect } from "react";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { useBrukerContext } from "../../context/bruker/BrukerContext";

export const Spraakvalg = () => {
    const { t } = useTranslation();
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext();

    const personHarStoettetSpraakvalg = () => Object.values<string>(Language).includes(brukerState?.spraak || "");
    const oppdaterSpraak = (spraak: string) => soknadDispatch({
        type: ActionTypes.OPPDATER_SPRAAK,
        payload: spraak,
    });

    useEffect(() => {
        // Benytt språk fra KRR dersom det finnes, hvis ikke sett norsk bokmål som default.
        if (!soknadState.spraak && personHarStoettetSpraakvalg()) {
            oppdaterSpraak(brukerState.spraak!!);
        } else if (!soknadState.spraak && Object.keys(brukerState).length !== 0 && !brukerState.spraak) {
            oppdaterSpraak(Language.NORSK_BOKMAAL)
        }
    }, [soknadState.spraak, brukerState.spraak]);

    return (
        <SkjemaGruppe id="language-selector">
            <SkjemaGruppe className="dropdown_alt2">
                <Select onChange={(e) => oppdaterSpraak(e.target.value)}
                        value={soknadState.spraak}
                        label={t("felles.spraakValg")}>
                    <option value={Language.NORSK_BOKMAAL}>Bokmål</option>
                    <option value={Language.NORSK_NYNORSK}>Nynorsk</option>
                    <option value={Language.ENGELSK}>English</option>
                </Select>
            </SkjemaGruppe>
        </SkjemaGruppe>
    );
};
