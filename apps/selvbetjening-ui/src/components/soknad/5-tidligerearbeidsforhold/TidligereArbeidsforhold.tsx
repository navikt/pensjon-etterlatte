import { useState } from "react";
import "../../../App.less";
import "../../felles/Infokort.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst, Systemtittel, Undertittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { Xknapp } from "nav-frontend-ikonknapper";
import TekstInput from "../../felles/TekstInput";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ITidligereArbeidsforhold, SoeknadActionTypes } from "../../../context/soknad/soknad";
import Datovelger from "../../felles/Datovelger";
import { useTranslation } from "react-i18next";

const TidligereArbeidsforhold: SoknadSteg = () => {
    const { t, i18n } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const tomtElement: ITidligereArbeidsforhold = {
        beskrivelse: "",
        varighet: "",
        fraDato: null,
        tilDato: null,
    };

    const [arbeidsforhold, setArbeidsforhold] = useState(tomtElement);

    const leggTilOgLukk = () => {
        leggTil();
        setIsOpen(false);
        setArbeidsforhold(tomtElement);
    };

    const leggTil = () => {
        dispatch({
            type: SoeknadActionTypes.LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD,
            payload: arbeidsforhold,
        });

        setArbeidsforhold(tomtElement);
    };

    const fjern = (index: number) =>
        dispatch({
            type: SoeknadActionTypes.FJERN_TIDLIGERE_ARBEIDSFORHOLD,
            payload: index,
        });

    const lukkModalvindu = () => {
        setIsOpen(false);
        setArbeidsforhold(tomtElement);
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
                <div style={{ padding: "2rem 2.5rem" }}>
                    <SkjemaGruppe>
                        <TekstInput
                            value={arbeidsforhold.beskrivelse}
                            label={t("tidligereArbeidsforhold.skoleKursArbeidOsv")}
                            onChange={(beskrivelse) => setArbeidsforhold({ ...arbeidsforhold, beskrivelse })}
                        />

                        <div className={"skjemagruppe skjemagruppe__inline"}>
                            <Datovelger
                                label={t("felles.fraDato")}
                                valgtDato={arbeidsforhold.fraDato}
                                onChange={(fraDato) => setArbeidsforhold({ ...arbeidsforhold, fraDato })}
                                showMonthYearPicker
                            />
                            <Datovelger
                                label={t("felles.tilDato")}
                                valgtDato={arbeidsforhold.tilDato}
                                onChange={(tilDato) => setArbeidsforhold({ ...arbeidsforhold, tilDato })}
                                showMonthYearPicker
                            />
                        </div>
                    </SkjemaGruppe>

                    <section className={"navigasjon-rad"}>
                        <Knapp onClick={leggTilOgLukk}>{t("knapp.leggTilOgLukk")}</Knapp>
                        <Hovedknapp onClick={leggTil}>{t("knapp.leggTil")}</Hovedknapp>
                    </section>
                </div>
            </Modal>
        </>
    );
};

export default TidligereArbeidsforhold;
