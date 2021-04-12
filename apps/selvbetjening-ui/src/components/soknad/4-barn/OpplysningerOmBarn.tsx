import React, { useState } from "react";
import "./OpplysningerOmBarn.less";
import ikon from "../../../assets/barn1.svg";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst, Systemtittel, Undertittel } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn } from "../../../typer/IPerson";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";

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
        statsborgerskapOgLand: "",
    };

    const [barn, setBarn] = useState(tomtElement);

    const leggTilBarn = () => {
        dispatch({ type: SoeknadActionTypes.LEGG_TIL_BARN, payload: barn });

        setBarn(tomtElement);
    };

    return (
        <>
            {/* Steg 4 */}
            <Systemtittel>4 Opplysninger om barn</Systemtittel>

            <div className={"barnekort-wrapper"}>
                {state.opplysningerOmBarn?.map((barn) => {
                    return (
                        <div className={"barnekort"} key={barn.foedselsnummer}>
                            <div className={"barnekort__header"}>
                                <img alt="barn" className="barneikon" src={ikon} />
                            </div>
                            <div className={"barnekort__informasjonsboks"}>
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
            </div>

            <br />
            <Knapp onClick={() => setIsOpen(true)}>+ Legg til barn</Knapp>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                closeButton={true}
                contentLabel="Min modalrute"
            >
                <div style={{ padding: "2rem 2.5rem" }}>
                    <SkjemaGruppe>
                        {/* sjekkboks for INGEN BARN */}

                        <Input
                            label="Fornavn"
                            value={barn.fornavn}
                            onChange={(e) => setBarn({ ...barn, fornavn: (e.target as HTMLInputElement).value })}
                        />

                        <Input
                            label="Etternavn"
                            value={barn.etternavn}
                            onChange={(e) => setBarn({ ...barn, etternavn: (e.target as HTMLInputElement).value })}
                        />

                        <Input
                            label="Fødselsnummer (11 siffer)"
                            value={barn.foedselsnummer}
                            onChange={(e) => setBarn({ ...barn, foedselsnummer: (e.target as HTMLInputElement).value })}
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
                            <Input
                                label="Hvis ja, oppgi statsborgerskap og land."
                                value={barn.statsborgerskapOgLand}
                                onChange={(e) =>
                                    setBarn({
                                        ...barn,
                                        statsborgerskapOgLand: (e.target as HTMLInputElement).value,
                                    })
                                }
                            />
                        </ToValgRadio>

                        <Knapp onClick={leggTilBarn}>Legg til</Knapp>
                    </SkjemaGruppe>
                </div>
            </Modal>
        </>
    );
};

export default OpplysningerOmBarn;
