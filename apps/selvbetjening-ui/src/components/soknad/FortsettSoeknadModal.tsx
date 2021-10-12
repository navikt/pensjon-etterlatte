import { Button, Modal, Heading } from "@navikt/ds-react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import React from "react";
import { useHistory } from "react-router-dom";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes, ActionTypes as SoknadActionTypes } from "../../context/soknad/soknad";
import { StegPath } from "../../typer/steg";
import { isEmpty } from "lodash";
import { slettSoeknad } from "../../api/api";
import { useTranslation } from "react-i18next";

export const FortsettSoeknadModal = () => {
    const history = useHistory();
    const { state, dispatch } = useSoknadContext();
    const { t } = useTranslation();

    const nesteSteg = () => {
        if (!isEmpty(state.opplysningerOmBarn)) {
            return StegPath.Oppsummering;
        } else if (!isEmpty(state.dinSituasjon)) {
            return StegPath.OmBarn;
        } else if (!isEmpty(state.omDenAvdoede)) {
            return StegPath.DinSituasjon;
        } else if (!isEmpty(state.omDegOgAvdoed)) {
            return StegPath.OmAvdoed;
        } else if (!isEmpty(state.omDeg)) {
            return StegPath.OmDegOgAvdoed;
        } else {
            return StegPath.OmDeg;
        }
    }

    const fortsettSoeknad = () => {
        const steg = nesteSteg();
        dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false });
        history.push(`/soknad/steg/${steg.valueOf()}`);
    };

    const startPaaNytt = () => {
        slettSoeknad().then(() => {
            dispatch({ type: SoknadActionTypes.TILBAKESTILL });
            dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false });
            history.push("/");
        })
    }

    return (
        <Modal
            open={state.visFortsettSoeknadModal}
            onClose={() => {}}
            shouldCloseOnOverlayClick={false}
            className="spoersmaal-modal skjul-modal-knapp ey-modal"
        >
            <SkjemaGruppe>
                <Heading size={"medium"}>{t("fortsettSoeknad.beskrivelse")}</Heading>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Button variant={"primary"} type={"button"} onClick={fortsettSoeknad}>
                    {t("fortsettSoeknad.fortsettSoeknad")}
                </Button>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Button variant={"primary"} type={"button"} onClick={startPaaNytt}>
                    {t("fortsettSoeknad.startPaaNytt")}
                </Button>
            </SkjemaGruppe>
        </Modal>
    )
}
