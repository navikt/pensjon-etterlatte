import "../../../App.less";
import { FnrInput, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Datovelger from "../../felles/Datovelger";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IAvdoed } from "../../../typer/person";
import TekstInput from "../../felles/TekstInput";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";

const OmDenAvdode: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();

    // TODO: Rydde i null | undefined. For øyeblikket lite konsekvent bruk...
    const initialState: IAvdoed = state.opplysningerOmDenAvdoede || {
        fornavn: "",
        etternavn: "",
        foedselsnummer: "",
        doedsdato: null,
        statsborgerskap: "",
        bosetning: undefined,
        doedsfallAarsak: undefined,
        boddEllerJobbetUtland: undefined,
        haddePensjonsgivendeInntekt: undefined,
        pensjonsgivendeInntektSvar: "",
        haddePensjonAndreLand: undefined,
        pensjonAndreLandSvar: "",
        harAvtjentMilitaerTjeneste: undefined,
        avtjentMilitaerTjenesteSvar: "",
    };

    const [avdoed, setAvdoed] = useState(initialState);

    const oppdaterFnr = (e: SyntheticEvent) => {
        const value = (e.target as HTMLInputElement).value;
        const foedselsnummer = value.replace(/[^\d]+/g, "");

        setAvdoed({ ...avdoed, foedselsnummer });
    };

    useEffect(() => {
        dispatch({ type: SoeknadActionTypes.OPPDATER_AVDOED, payload: avdoed });
    }, [avdoed, dispatch]);

    return (
        <>
            {/* Steg 3 */}
            <Systemtittel>3 Opplysninger om den avdøde</Systemtittel>

            <SkjemaGruppe>
                {/* 3.1 */}
                <section>
                    <TekstInput
                        label="Fornavn"
                        value={avdoed.fornavn}
                        onChange={(fornavn) => setAvdoed({ ...avdoed, fornavn })}
                    />
                </section>

                <section>
                    <TekstInput
                        label="Etternavn"
                        value={avdoed.etternavn}
                        onChange={(etternavn) => setAvdoed({ ...avdoed, etternavn })}
                    />
                </section>

                {/* 3.2 */}
                <section>
                    <FnrInput
                        label="Fødselsnummer (11 siffer)"
                        value={avdoed.foedselsnummer}
                        type={"tel"}
                        maxLength={11}
                        onChange={oppdaterFnr}
                        onValidate={
                            (valid) => {
                                console.log(`is valid: ${valid}`);
                            } /*setValid(val)*/
                        }
                        // feil={ ? "Ugyldig fødselsnummer" : undefined}
                    />
                </section>

                {/* 3.3 */}
                <Datovelger
                    label={"Dødsdato"}
                    valgtDato={avdoed.doedsdato}
                    onChange={(doedsdato) => setAvdoed({ ...avdoed, doedsdato })}
                />

                {/* 3.4 */}
                <section>
                    <TekstInput
                        label="Statsborgerskap"
                        value={avdoed.statsborgerskap}
                        onChange={(statsborgerskap) => setAvdoed({ ...avdoed, statsborgerskap })}
                    />
                </section>

                {/* 3.5 fjernes. Ikke lenger gyldig. */}
                {/* 3.6 */}
                <ToValgRadio
                    checked={avdoed.bosetning}
                    label={"Var den avdøde bosatt i Norge sammenhengende siste tre år før dødsfallet?"}
                    onChange={(bosetning) => setAvdoed({ ...avdoed, bosetning })}
                />

                {/* 3.7 */}
                <ToValgRadio
                    // name={"dodsfallArsak"}
                    checked={avdoed.doedsfallAarsak}
                    label={"Kan dødesfallet være en følge av yrkesskade/yrkessykdom?"}
                    onChange={(doedsfallAarsak) => setAvdoed({ ...avdoed, doedsfallAarsak })}
                />

                {/* 3.8 */}
                <ToValgRadio
                    // name={"avdodBoddEllerJobbetUtland"}
                    checked={avdoed.boddEllerJobbetUtland}
                    label={"Hadde den avdøde bodd eller arbeidet i utlandet etter fylte 16 år?"}
                    onChange={(boddEllerJobbetUtland) => setAvdoed({ ...avdoed, boddEllerJobbetUtland })}
                />
                {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}

                {/* 3.10 */}
                <ToValgRadio
                    // name={"pensjonsgivendeInntekt"}
                    checked={avdoed.haddePensjonsgivendeInntekt}
                    label={
                        "Hadde den avdøde pensjonsgivende inntekt (arbeidsinntekt eller næringsinntekt) på tidspunktet før dødsfallet?"
                    }
                    onChange={(haddePensjonsgivendeInntekt) => setAvdoed({ ...avdoed, haddePensjonsgivendeInntekt })}
                >
                    <TekstInput
                        label="Oppgi bruttobeløp pr. år (kr)"
                        value={avdoed.pensjonsgivendeInntektSvar}
                        onChange={(pensjonsgivendeInntektSvar) => setAvdoed({ ...avdoed, pensjonsgivendeInntektSvar })}
                    />
                </ToValgRadio>

                {/* 3.11 Samme som over ?! */}

                {/* 3.12 */}
                <ToValgRadio
                    // name={"pensjonAndreLand"}
                    checked={avdoed.haddePensjonAndreLand}
                    label={"Mottok den avdøde pensjon fra andre land enn Norge?"}
                    onChange={(haddePensjonAndreLand) => setAvdoed({ ...avdoed, haddePensjonAndreLand })}
                >
                    <TekstInput
                        label="Oppgi bruttobeløp pr. år (kr)"
                        value={avdoed.pensjonAndreLandSvar}
                        onChange={(pensjonAndreLandSvar) => setAvdoed({ ...avdoed, pensjonAndreLandSvar })}
                    />
                </ToValgRadio>

                {/* 3.13 */}
                <ToValgRadio
                    // name={"militaerTjeneste"}
                    checked={avdoed.harAvtjentMilitaerTjeneste}
                    label={
                        "Har den avdøde etter 1966 avtjent militær eller sivil førstegangstjeneste som varte minst 30 dager?"
                    }
                    onChange={(harAvtjentMilitaerTjeneste) => setAvdoed({ ...avdoed, harAvtjentMilitaerTjeneste })}
                >
                    <TekstInput
                        label="Oppgi årstall"
                        value={avdoed.avtjentMilitaerTjenesteSvar}
                        onChange={(avtjentMilitaerTjenesteSvar) =>
                            setAvdoed({
                                ...avdoed,
                                avtjentMilitaerTjenesteSvar,
                            })
                        }
                    />
                </ToValgRadio>
            </SkjemaGruppe>
        </>
    );
};

export default OmDenAvdode;
