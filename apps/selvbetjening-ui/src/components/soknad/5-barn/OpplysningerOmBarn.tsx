import React, { useState } from "react";
import "../../felles/Infokort.less";
import ikon from "../../../assets/ikoner/barn1.svg";
import { Systemtittel } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import BarnInfokort from "./BarnInfokort";
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { BekreftCheckboksPanel, SkjemaGruppe } from "nav-frontend-skjema";
import { v4 as uuid } from "uuid";
import Navigasjon from "../../felles/Navigasjon";

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

    const [soekerBarnep, setSoekerBarnep] = useState<boolean>(false);

    return (
        <>
            {/* Steg 4 */}
            <SkjemaGruppe>
                <Systemtittel className={"center"}>
                    {t("omBarn.tittel")}
                </Systemtittel>
            </SkjemaGruppe>

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

            {state.opplysningerOmBarn.length > 0 && (
                <SkjemaGruppe>
                    <BekreftCheckboksPanel
                        label={"Ja, jeg ønsker å søke om barnepensjon."}
                        checked={soekerBarnep}
                        onChange={(e) => setSoekerBarnep((e.target as HTMLInputElement).checked)}
                    >
                        Hvis du har felles barn med avdøde, som er under 18 år, kan de ha rett til barnepensjon.
                    </BekreftCheckboksPanel>
                </SkjemaGruppe>
            )}

            <Navigasjon
                forrige={forrige}
                neste={neste}
            />
        </>
    );
};

export default OpplysningerOmBarn;
