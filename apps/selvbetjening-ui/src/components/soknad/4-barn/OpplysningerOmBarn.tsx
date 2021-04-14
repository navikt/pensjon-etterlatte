import React, { useState } from "react";
import "../../../App.less";
import "../../felles/Infokort.less";
import ikon from "../../../assets/barn1.svg";
import { RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst, Systemtittel, Undertittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn } from "../../../typer/IPerson";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";
import TekstInput from "../../felles/TekstInput";

Modal.setAppElement("#root");

const OpplysningerOmBarn: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const tomtElement: IBarn = {
        fornavn: "",
        etternavn: "",
        foedselsnummer: "",
        foreldre: "",
        bosattUtland: "",
        statsborgerskap: "",
        land: "",
    };

    const [barn, setBarn] = useState(tomtElement);

    const leggTilOgLukk = () => {
        leggTil();
        setIsOpen(false);
        setBarn(tomtElement);
    };

    const leggTil = () => {
        dispatch({ type: SoeknadActionTypes.LEGG_TIL_BARN, payload: barn });
        setBarn(tomtElement);
    };

    const lukkModalvindu = () => {
        setIsOpen(false);
        setBarn(tomtElement);
    };

    return (
        <>
            {/* Steg 4 */}
            <Systemtittel>4 Opplysninger om barn</Systemtittel>

            <div className={"infokort-wrapper"}>
                {state.opplysningerOmBarn?.map((barn) => {
                    return (
                        <div className={"infokort"} key={barn.foedselsnummer}>
                            <div className={"infokort__header"}>
                                <img alt="barn" className="barneikon" src={ikon} />
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Undertittel tag="h3">
                                        {barn.fornavn} {barn.etternavn}
                                    </Undertittel>
                                </div>
                                <div className="informasjonselement">
                                    <Normaltekst>{barn.foedselsnummer}</Normaltekst>
                                    <Normaltekst>{barn.foreldre}</Normaltekst>
                                    <Normaltekst>Bosatt i utlandet: {barn.bosattUtland}</Normaltekst>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className={"infokort"}>
                    <div className={"infokort__header gjennomsiktig"}>
                        <img alt="barn" className="barneikon" src={ikon} />
                    </div>
                    <div className={"infokort__informasjonsboks"}>
                        <div className={"informasjonsboks-innhold"}>
                            <Knapp onClick={() => setIsOpen(true)}>+ Legg til barn</Knapp>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={lukkModalvindu}
                closeButton={true}
                contentLabel="Modalvindu - Opplysninger om barn"
            >
                <div style={{ padding: "2rem 2.5rem" }}>
                    <SkjemaGruppe>
                        {/* sjekkboks for INGEN BARN */}

                        <TekstInput
                            label="Fornavn"
                            value={barn.fornavn}
                            onChange={(fornavn) => setBarn({ ...barn, fornavn })}
                        />

                        <TekstInput
                            label="Etternavn"
                            value={barn.etternavn}
                            onChange={(etternavn) => setBarn({ ...barn, etternavn })}
                        />

                        <TekstInput
                            label="Fødselsnummer (11 siffer)"
                            value={barn.foedselsnummer}
                            onChange={(foedselsnummer) => setBarn({ ...barn, foedselsnummer })}
                        />

                        <RadioPanelGruppe
                            name={"barn-opphav"}
                            radios={[
                                { label: "Fellesbarn m/avdøde", value: "Fellesbarn m/avdøde" },
                                { label: "Avdødes særkullsbarn", value: "Avdødes særkullsbarn" },
                                { label: "Egne særkullsbarn", value: "Egne særkullsbarn" },
                            ]}
                            checked={barn.foreldre}
                            onChange={(e) => setBarn({ ...barn, foreldre: (e.target as HTMLInputElement).value })}
                        />

                        <ToValgRadio
                            checked={barn.bosattUtland}
                            label={"Bor barnet i utlandet?"}
                            onChange={(valgtSvar) => setBarn({ ...barn, bosattUtland: valgtSvar })}
                        >
                            <TekstInput
                                label="Statsborgerskap"
                                value={barn.statsborgerskap}
                                onChange={(statsborgerskap) =>
                                    setBarn({
                                        ...barn,
                                        statsborgerskap,
                                    })
                                }
                            />

                            <TekstInput
                                label="Land"
                                value={barn.land}
                                onChange={(land) =>
                                    setBarn({
                                        ...barn,
                                        land,
                                    })
                                }
                            />
                        </ToValgRadio>

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

export default OpplysningerOmBarn;
