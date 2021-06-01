import React, { useState } from "react";
import "../../../App.less";
import "../../felles/Infokort.less";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import LeggTilArbeidsforholdSkjema from "./LeggTilArbeidsforholdSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ITidligereArbeidsforhold } from "../../../typer/arbeidsforhold";
import TidlArbeidKort from "./TidlArbeidKort";
import { Ytelse } from "../../../typer/ytelser";
import AlertStripe from "nav-frontend-alertstriper";

/**
 * TODO: Skal kun fylles ut dersom søker har valgt "pensjon/overgangsstønad", "skolepenger", eller "barnetilsyn"
 */
const TidligereArbeidsforhold: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const leggTilOgLukk = (data: ITidligereArbeidsforhold) => {
        dispatch({
            type: ActionTypes.LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD,
            payload: data,
        });
        setIsOpen(false);
    };

    const fjern = (index: number) =>
        dispatch({
            type: ActionTypes.FJERN_TIDLIGERE_ARBEIDSFORHOLD,
            payload: index,
        });

    const gjenlevendetillegg = state.stoenadType?.valgteYtelser?.hovedytelse === Ytelse.gjenlevendetillegg
    const skjemaGyldig = gjenlevendetillegg || (!gjenlevendetillegg && state.tidligereArbeidsforhold.length > 0)

    return (
        <>
            {/* Steg 4 */}

            <Systemtittel>{t("tidligereArbeidsforhold.tittel")}</Systemtittel>

            {gjenlevendetillegg ? (
                <SkjemaGruppe>
                    <AlertStripe type={"info"}>
                        Siden du søker om <b>gjenlevendetillegg i uføretrygden</b> trenger du ikke fylle ut noe på denne siden.
                    </AlertStripe>
                </SkjemaGruppe>
            ) : (
                <SkjemaGruppe>
                    <div className={"infokort-wrapper"}>
                        {state.tidligereArbeidsforhold.map((item: any, index: number) => (
                            <TidlArbeidKort item={item} index={index} fjern={fjern}/>
                        ))}

                        <div className={"infokort infokort__fullbredde"}>
                            <div className={"infokort__informasjonsboks"}>
                                <div className="informasjonselement center">
                                    <Knapp onClick={() => setIsOpen(true)}>{t("knapp.leggTilArbeidsforhold")}</Knapp>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        closeButton={true}
                        contentLabel="Modalvindu - Tidligere Arbeidsforhold"
                    >
                        <LeggTilArbeidsforholdSkjema lagre={leggTilOgLukk}/>
                    </Modal>
                </SkjemaGruppe>
            )}

            {!skjemaGyldig && (
                <SkjemaGruppe>
                    <AlertStripe type={"advarsel"}>
                        Siden du søker om gjenlevendepensjon må du fylle ut informasjon om tidligere arbeidsforhold for å gå videre.
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

export default TidligereArbeidsforhold;
