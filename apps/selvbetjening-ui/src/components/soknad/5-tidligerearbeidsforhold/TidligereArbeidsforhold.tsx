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
import { IArbeidsforholdElement, SoeknadActionTypes } from "../../../context/soknad/soknad";

const TidligereArbeidsforhold: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const tomtElement: IArbeidsforholdElement = { beskrivelse: "", varighet: "" };

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

    return (
        <>
            {/* TODO: Kun relevant hvis "skolepenger" */}
            {/* TODO: Kun relevant hvis IKKE i arbeid, eks. hvis student. */}
            {/* Steg 4 */}

            <Systemtittel>5 Opplysninger om søkers tidligere arbeidsforhold</Systemtittel>

            <div className={"infokort-wrapper"}>
                {state.tidligereArbeidsforhold.map((item: any, index: number) => {
                    return (
                        <div key={index} className={"infokort infokort__fullbredde"}>
                            <div className={"infokort-knapper"}>
                                {/* TODO: Lage støtte for å redigere elementer
                                <RedigerKnapp
                                    title={"Rediger element"}
                                    onClick={() => redigerElement(index)}
                                />
                                */}
                                <Xknapp title={"Fjern element"} onClick={() => fjern(index)} />
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Undertittel tag="h3">{item.beskrivelse}</Undertittel>
                                </div>
                                <div className="informasjonselement">
                                    <Normaltekst>{item.varighet}</Normaltekst>
                                </div>

                                {/*<Fareknapp onClick={() => dispatch({ type: TidlArbActionTypes.FJERN, payload: index })}>
                                    Fjern
                                </Fareknapp>*/}
                            </div>
                        </div>
                    );
                })}
            </div>

            <br />
            <Knapp onClick={() => setIsOpen(true)}>+ Legg til arbeidsforhold</Knapp>
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
                            label={"Skoler utover grunnskolen, yrkesrettede kurs o.l. og tidligere arbeidsforhold"}
                            onChange={(beskrivelse) => setArbeidsforhold({ ...arbeidsforhold, beskrivelse })}
                        />

                        <TekstInput
                            value={arbeidsforhold.varighet}
                            label={"Varighet"}
                            onChange={(varighet) => setArbeidsforhold({ ...arbeidsforhold, varighet })}
                        />

                        <section className={"navigasjon-rad"}>
                            <Knapp onClick={leggTilOgLukk}>Legg til og lukk</Knapp>
                            <Hovedknapp onClick={leggTil}>Legg til</Hovedknapp>
                        </section>
                    </SkjemaGruppe>
                </div>
            </Modal>
        </>
    );
};

export default TidligereArbeidsforhold;
