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
import { useTranslation } from "react-i18next";

const OmDenAvdode: SoknadSteg = () => {
    const { t } = useTranslation();
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
            <Systemtittel>{t("omDenAvdoede.tittel")}</Systemtittel>

            <SkjemaGruppe>
                {/* 3.1 */}
                <section>
                    <TekstInput
                        label={t("felles.fornavn")}
                        value={avdoed.fornavn}
                        onChange={(fornavn) => setAvdoed({ ...avdoed, fornavn })}
                    />
                </section>

                <section>
                    <TekstInput
                        label={t("felles.etternavn")}
                        value={avdoed.etternavn}
                        onChange={(etternavn) => setAvdoed({ ...avdoed, etternavn })}
                    />
                </section>

                {/* 3.2 */}
                <section>
                    <FnrInput
                        label={t("felles.fnr")}
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
                    label={t("felles.doedsdato")}
                    valgtDato={avdoed.doedsdato}
                    onChange={(doedsdato) => setAvdoed({ ...avdoed, doedsdato })}
                />

                {/* 3.4 */}
                <section>
                    <TekstInput
                        label={t("felles.statsborgerskap")}
                        value={avdoed.statsborgerskap}
                        onChange={(statsborgerskap) => setAvdoed({ ...avdoed, statsborgerskap })}
                    />
                </section>

                {/* 3.5 fjernes. Ikke lenger gyldig. */}
                {/* 3.6 */}
                <ToValgRadio
                    checked={avdoed.bosetning}
                    label={t("omDenAvdoede.bosattSammenhengende")}
                    onChange={(bosetning) => setAvdoed({ ...avdoed, bosetning })}
                />

                {/* 3.7 */}
                <ToValgRadio
                    // name={"dodsfallArsak"}
                    checked={avdoed.doedsfallAarsak}
                    label={t("omDenAvdoede.doedsfallPgaYrkesskade")}
                    onChange={(doedsfallAarsak) => setAvdoed({ ...avdoed, doedsfallAarsak })}
                />

                {/* 3.8 */}
                <ToValgRadio
                    // name={"avdodBoddEllerJobbetUtland"}
                    checked={avdoed.boddEllerJobbetUtland}
                    label={t("omDenAvdoede.boddEllerJobbetUtland")}
                    onChange={(boddEllerJobbetUtland) => setAvdoed({ ...avdoed, boddEllerJobbetUtland })}
                />
                {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}

                {/* 3.10 */}
                <ToValgRadio
                    // name={"pensjonsgivendeInntekt"}
                    checked={avdoed.haddePensjonsgivendeInntekt}
                    label={t("omDenAvdoede.haddePensjonsgivendeInntekt")}
                    onChange={(haddePensjonsgivendeInntekt) => setAvdoed({ ...avdoed, haddePensjonsgivendeInntekt })}
                >
                    <TekstInput
                        label={t("omDenAvdoede.pensjonsgivendeInntekt")}
                        value={avdoed.pensjonsgivendeInntektSvar}
                        onChange={(pensjonsgivendeInntektSvar) => setAvdoed({ ...avdoed, pensjonsgivendeInntektSvar })}
                    />
                </ToValgRadio>

                {/* 3.11 Samme som over ?! */}

                {/* 3.12 */}
                <ToValgRadio
                    // name={"pensjonAndreLand"}
                    checked={avdoed.haddePensjonAndreLand}
                    label={t("omDenAvdoede.mottokPensjonAndreLand")}
                    onChange={(haddePensjonAndreLand) => setAvdoed({ ...avdoed, haddePensjonAndreLand })}
                >
                    <TekstInput
                        label={t("omDenAvdoede.pensjonUtlandBruttoinntekt")}
                        value={avdoed.pensjonAndreLandSvar}
                        onChange={(pensjonAndreLandSvar) => setAvdoed({ ...avdoed, pensjonAndreLandSvar })}
                    />
                </ToValgRadio>

                {/* 3.13 */}
                <ToValgRadio
                    // name={"militaerTjeneste"}
                    checked={avdoed.harAvtjentMilitaerTjeneste}
                    label={t("omDenAvdoede.harAvtjentMilitaerTjeneste")}
                    onChange={(harAvtjentMilitaerTjeneste) => setAvdoed({ ...avdoed, harAvtjentMilitaerTjeneste })}
                >
                    <TekstInput
                        label={t("omDenAvdoede.avtjentMilitaerTjenesteAarstall")}
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
