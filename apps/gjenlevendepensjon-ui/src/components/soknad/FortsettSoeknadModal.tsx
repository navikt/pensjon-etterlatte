import { Button, Heading } from "@navikt/ds-react";
import { SkjemaElement } from "../felles/SkjemaElement";
import React from "react";
import { useHistory } from "react-router-dom";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes, ActionTypes as SoknadActionTypes } from "../../context/soknad/soknad";
import { StegPath } from "../../typer/steg";
import { slettSoeknad } from "../../api/api";
import { useTranslation } from "react-i18next";
import {SpoersmaalModal} from "../felles/StyledComponents";

export const FortsettSoeknadModal = () => {
    const history = useHistory();
    const { state, dispatch } = useSoknadContext();
    const { t } = useTranslation();

    const nesteSteg = () => {
        if (state.opplysningerOmBarn.erValidert === true) {
            return StegPath.Oppsummering;
        } else if (state.dinSituasjon.erValidert === true) {
            return StegPath.OmBarn;
        } else if (state.omDenAvdoede.erValidert === true) {
            return StegPath.DinSituasjon;
        } else if (state.omDegOgAvdoed.erValidert === true) {
            return StegPath.OmAvdoed;
        } else if (state.omDeg.erValidert === true) {
            return StegPath.OmDegOgAvdoed;
        } else {
            return StegPath.OmDeg;
        }
    }

    const fortsettSoeknad = () => {
        const steg = nesteSteg();
        dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false });
        history.push(`/skjema/steg/${steg.valueOf()}`);
    };

    const startPaaNytt = () => {
        slettSoeknad().then(() => {
            dispatch({ type: SoknadActionTypes.TILBAKESTILL });
            dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false });
            history.push("/");
        })
    }

    return (
        <SpoersmaalModal
            open={state.visFortsettSoeknadModal}
            onClose={() => {}}
            shouldCloseOnOverlayClick={false}
        >
            <SkjemaElement>
                <Heading size={"medium"}>{t("fortsettSoeknad.beskrivelse")}</Heading>
            </SkjemaElement>

            <SkjemaElement>
                <Button variant={"primary"} type={"button"} onClick={fortsettSoeknad} id={"fortsett_soeknad"}>
                    {t("fortsettSoeknad.fortsettSoeknad")}
                </Button>
            </SkjemaElement>

            <SkjemaElement>
                <Button variant={"primary"} type={"button"} onClick={startPaaNytt} id={"start_paa_nytt"}>
                    {t("fortsettSoeknad.startPaaNytt")}
                </Button>
            </SkjemaElement>
        </SpoersmaalModal>
    )
}
