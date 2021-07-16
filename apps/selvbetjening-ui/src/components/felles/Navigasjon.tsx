import { Fareknapp, Flatknapp, Hovedknapp, Knapp } from "nav-frontend-knapper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import NavFrontendSpinner from "nav-frontend-spinner";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { ActionTypes as BrukerAction } from "../../context/bruker/bruker";
import { ActionTypes as SoknadAction } from "../../context/soknad/soknad";
import { default as Modal } from "nav-frontend-modal";
import { Ingress, Undertekst } from "nav-frontend-typografi";
import { erDato } from "../../utils/dato";

interface KnappProps {
    label?: string;
    callback?: () => void;
}

const Navigasjon = ({ neste, forrige, send, disabled }: {
    neste?: KnappProps;
    forrige?: KnappProps;
    send?: KnappProps;
    disabled?: boolean;
}) => {
    const { t, i18n } = useTranslation();
    const {
        state: { sistLagretDato },
        dispatch: soknadDispatch
    } = useSoknadContext();

    const { dispatch: brukerDispatch } = useBrukerContext();

    const dtf = Intl.DateTimeFormat(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    let sistLagret;
    if (!!sistLagretDato && erDato(sistLagretDato)) {
        sistLagret = dtf.format(new Date(sistLagretDato))
    }

    const [isOpen, setIsOpen] = useState(false);

    const avbryt = () => {
        soknadDispatch({ type: SoknadAction.TILBAKESTILL })
        brukerDispatch({ type: BrukerAction.TILBAKESTILL })

        window.location.href = "https://www.nav.no"
    }

    return (
        <>
            <SkjemaGruppe>
                <div className={classNames("navigasjon-rad", disabled && "disabled")} >
                    {!!forrige && (
                        <Knapp htmlType={"button"} onClick={forrige.callback}>
                            {forrige.label || t("knapp.tilbake")}
                        </Knapp>
                    )}

                    {!!neste && (
                        <Hovedknapp htmlType={"button"} onClick={neste.callback}>
                            {neste.label || t("knapp.neste")}
                        </Hovedknapp>
                    )}

                    {!!send && (
                        <Hovedknapp htmlType={"button"} onClick={send.callback}>
                            {send.label || t("knapp.sendSoeknad")} {disabled && (<NavFrontendSpinner />)}
                        </Hovedknapp>
                    )}
                </div>

                {!!sistLagret && (
                    <Undertekst className={"center"}>
                        {t("felles.sistLagret")}: {sistLagret}
                    </Undertekst>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe className={classNames("navigasjon-rad", disabled && "disabled")}>
                <Flatknapp htmlType={"button"} onClick={() => setIsOpen(true)}>
                    {t("knapp.avbryt")}
                </Flatknapp>
            </SkjemaGruppe>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                closeButton={true}
                contentLabel={"aasdfsdf"}
            >
                <SkjemaGruppe>
                    <Ingress>
                        Er du helt sikker på at du vil avbryte søknaden?
                    </Ingress>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Hovedknapp htmlType={"button"} onClick={() => setIsOpen(false)}>
                        Nei, jeg vil fortsette søknaden
                    </Hovedknapp>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Fareknapp htmlType={"button"} onClick={avbryt}>
                        Ja, avbryt søknaden
                    </Fareknapp>
                </SkjemaGruppe>
            </Modal>
        </>
    );
};

export default Navigasjon;
