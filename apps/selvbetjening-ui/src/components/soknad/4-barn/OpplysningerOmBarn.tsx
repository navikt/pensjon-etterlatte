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
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { IValg } from "../../../typer/Spoersmaal";
import AlertStripe from "nav-frontend-alertstriper";
import { v4 as uuid } from "uuid";

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

    const fjern = (index: number) =>
        dispatch({ type: ActionTypes.FJERN_BARN, payload: index, });

    const harBarn = state.situasjon?.barnepensjon === IValg.JA
    const skjemaGyldig = !harBarn || (harBarn && state.opplysningerOmBarn.length > 0)

    return (
        <>
            {/* Steg 4 */}
            <SkjemaGruppe>
                <Systemtittel className={"center"}>{t("omBarn.tittel")}</Systemtittel>
            </SkjemaGruppe>

            {harBarn ? (
                <SkjemaGruppe>
                    <div className={"infokort-wrapper"}>
                        {state.opplysningerOmBarn?.map((barn: IBarn, index: number) => (
                            <BarnInfokort key={uuid()} barn={barn} index={index} fjern={fjern} />
                        ))}

                        <div className={"infokort"}>
                            <div className={"infokort__header gjennomsiktig"}>
                                <img alt="barn" className="barneikon" src={ikon} />
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Knapp onClick={() => setIsOpen(true)}>
                                        {t("knapp.leggTilBarn")}
                                    </Knapp>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        closeButton={true}
                        contentLabel={t("omBarn.tittel")}
                    >
                        <LeggTilBarnSkjema lagre={leggTilBarn} />
                    </Modal>
                </SkjemaGruppe>
            ): (
                <SkjemaGruppe>
                    <AlertStripe type={"info"}>
                        Du trenger ikke fylle ut dette steget ...
                    </AlertStripe>
                </SkjemaGruppe>
            )}


            {!skjemaGyldig && (
                <SkjemaGruppe>
                    <AlertStripe type={"advarsel"}>
                        Siden du søker om barnepensjon må du fylle ut informasjon om barn for å gå videre.
                    </AlertStripe>
                </SkjemaGruppe>
            )}

            <SkjemaGruppe className={"navigasjon-rad"}>
                <Knapp htmlType={"button"} onClick={forrige}>{t("knapp.tilbake")}</Knapp>
                <Hovedknapp onClick={neste} disabled={!skjemaGyldig}>{t("knapp.neste")}</Hovedknapp>
            </SkjemaGruppe>
        </>
    );
};

export default OpplysningerOmBarn;
