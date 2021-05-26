import React, { useState } from "react";
import "../../../App.less";
import "../../felles/Infokort.less";
import ikon from "../../../assets/ikoner/barn1.svg";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import BarnInfokort from "./BarnInfokort";
import { v4 as uuid } from "uuid";
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";

Modal.setAppElement("#root");

const OpplysningerOmBarn: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const leggTilBarn = (data: IBarn) => {
        dispatch({ type: ActionTypes.LEGG_TIL_BARN, payload: data });
        setIsOpen(false);
    };

    return (
        <>
            {/* Steg 4 */}
            <Systemtittel>{t("opplysningerOmBarn.tittel")}</Systemtittel>

            <div className={"infokort-wrapper"}>
                {state.opplysningerOmBarn?.map((barn) => (
                    <BarnInfokort key={uuid()} barn={barn} />
                ))}

                <div className={"infokort"}>
                    <div className={"infokort__header gjennomsiktig"}>
                        <img alt="barn" className="barneikon" src={ikon} />
                    </div>
                    <div className={"infokort__informasjonsboks"}>
                        <div className={"informasjonsboks-innhold"}>
                            <Knapp onClick={() => setIsOpen(true)}>{t("knapp.leggTilBarn")}</Knapp>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                closeButton={true}
                contentLabel={t("opplysningerOmBarn.modalContentLabel")}
            >
                <LeggTilBarnSkjema lagre={leggTilBarn} />
            </Modal>

            <SkjemaGruppe className={"navigasjon-rad"}>
                <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>
                <Hovedknapp onClick={neste}>{t("knapp.neste")}</Hovedknapp>
            </SkjemaGruppe>
        </>
    );
};

export default OpplysningerOmBarn;
