import { Flatknapp, Hovedknapp, Knapp } from "nav-frontend-knapper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import NavFrontendSpinner from "nav-frontend-spinner";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { ActionTypes as BrukerAction } from "../../context/bruker/bruker";
import { ActionTypes as SoknadAction } from "../../context/soknad/soknad";


const Navigasjon = ({ neste, forrige, send, disabled }: {
    neste?: () => void;
    forrige?: () => void;
    send?: () => void;
    disabled?: boolean;
}) => {
    const { t } = useTranslation();
    const { dispatch: soknadDispatch } = useSoknadContext();
    const { dispatch: brukerDispatch } = useBrukerContext();

    const avbryt = () => {
        soknadDispatch({ type: SoknadAction.TILBAKESTILL })
        brukerDispatch({ type: BrukerAction.TILBAKESTILL })

        window.location.href = "https://www.nav.no"
    }

    return (
        <>
            <SkjemaGruppe className={classNames("navigasjon-rad", disabled && "disabled")} >
                {!!forrige && (
                    <Knapp htmlType={"button"} onClick={forrige}>
                        {t("knapp.tilbake")}
                    </Knapp>
                )}

                {!!neste && (
                    <Hovedknapp onClick={neste}>
                        {t("knapp.neste")}
                    </Hovedknapp>
                )}

                {!!send && (
                    <Hovedknapp htmlType={"button"} onClick={send}>
                        {t("knapp.sendSoeknad")} {disabled && (<NavFrontendSpinner />)}
                    </Hovedknapp>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe className={classNames("navigasjon-rad", disabled && "disabled")}>
                <Flatknapp htmlType={"button"} onClick={avbryt}>
                    Avbryt
                </Flatknapp>
            </SkjemaGruppe>
        </>
    );
};

export default Navigasjon;
