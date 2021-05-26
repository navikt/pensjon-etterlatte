import React, { useState } from "react";
import "../../../App.less";
import "../../felles/Infokort.less";
import { Normaltekst, Systemtittel, Undertittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { Xknapp } from "nav-frontend-ikonknapper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import LeggTilArbeidsforholdSkjema from "./LeggTilArbeidsforholdSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ITidligereArbeidsforhold } from "../../../typer/arbeidsforhold";

const TidligereArbeidsforhold: SoknadSteg = ({ neste, forrige }) => {
    const { t, i18n } = useTranslation();
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

    const lukkModalvindu = () => {
        setIsOpen(false);
    };

    const dtf = Intl.DateTimeFormat(i18n.language, { month: "short", year: "numeric" });

    return (
        <>
            {/* TODO: Kun relevant hvis "skolepenger" */}
            {/* TODO: Kun relevant hvis IKKE i arbeid, eks. hvis student. */}
            {/* Steg 4 */}

            <Systemtittel>{t("tidligereArbeidsforhold.tittel")}</Systemtittel>

            <div className={"infokort-wrapper"}>
                {state.tidligereArbeidsforhold.map((item: any, index: number) => {
                    let fraDato = dtf.format(new Date(item.fraDato));
                    let tilDato = dtf.format(new Date(item.tilDato));

                    return (
                        <div key={index} className={"infokort infokort__fullbredde"}>
                            <div className={"infokort-knapper"}>
                                {/* TODO: Lage støtte for å redigere elementer
                                <RedigerKnapp
                                    title={"Rediger element"}
                                    onClick={() => redigerElement(index)}
                                />
                                */}
                                <Xknapp title={t("knapp.fjernElement")} onClick={() => fjern(index)} />
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Undertittel tag="h3">{item.beskrivelse}</Undertittel>
                                </div>
                                <div className="informasjonselement">
                                    <Normaltekst>
                                        <span className={"capitalize"}>{fraDato}</span> -{" "}
                                        <span className={"capitalize"}>{tilDato}</span>
                                    </Normaltekst>
                                </div>
                            </div>
                        </div>
                    );
                })}

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
                onRequestClose={lukkModalvindu}
                closeButton={true}
                contentLabel="Modalvindu - Tidligere Arbeidsforhold"
            >
                <LeggTilArbeidsforholdSkjema lagre={leggTilOgLukk} />
            </Modal>

            <SkjemaGruppe className={"navigasjon-rad"}>
                <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>
                <Hovedknapp onClick={neste}>{t("knapp.neste")}</Hovedknapp>
            </SkjemaGruppe>
        </>
    );
};

export default TidligereArbeidsforhold;
