import React from "react";
import "../../../App.less";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { useArbeidsforholdContext } from "../../../context/arbeidsforhold/ArbeidsforholdContext";
import { ArbeidsforholdActionTypes } from "../../../context/arbeidsforhold/arbeidsforhold";
import SoknadSteg from "../../../typer/SoknadSteg";
import Datovelger from "../../felles/Datovelger";

const NavaerendeArbeidsforhold: SoknadSteg = () => {
    const { state, dispatch } = useArbeidsforholdContext();

    const update = (target: any, type: ArbeidsforholdActionTypes) => {
        dispatch({ type, payload: target.value });
    };

    return (
        <>
            {/* Steg 6 */}
            {/* TODO: I arbeid eller student? */}
            {/* TODO: Hvis student, ikke vise dette skjemaet */}

            <Systemtittel>6 Søkers nåværende arbeids- og inntektsforhold</Systemtittel>

            <SkjemaGruppe>
                <Input
                    value={state.yrke}
                    label="Yrke"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_YRKE)}
                />
                <Input
                    value={state.stilling}
                    label="Stilling"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_STILLING)}
                />
                <Datovelger
                    valgtDato={state.startDato}
                    label={"Startdato"}
                    onChange={(valgtDato) =>
                        dispatch({ type: ArbeidsforholdActionTypes.OPPDATER_START_DATO, payload: valgtDato })
                    }
                />
                <Datovelger
                    valgtDato={state.sluttDato}
                    label={"Fremtidig sluttdato"}
                    onChange={(valgtDato) =>
                        dispatch({ type: ArbeidsforholdActionTypes.OPPDATER_SLUTT_DATO, payload: valgtDato })
                    }
                />
                <br />

                <RadioPanelGruppe
                    name={"ansettelsesforhold"}
                    legend={"Oppgi type arbeidsforhold"}
                    radios={[
                        { label: "Fast", value: "Fast" },
                        { label: "Midlertidig", value: "Midlertidig" },
                        { label: "Sesongarbeid", value: "Sesongarbeid" },
                    ]}
                    checked={state.ansettelsesforhold}
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_ANSETTELSESFORHOLD)}
                />
                <br />
                <RadioPanelGruppe
                    name={"heltidDeltid"}
                    className={"to-valg-radio"}
                    legend={"Er arbeidsforholdet heltid eller deltid?"}
                    radios={[
                        { label: "Heltid", value: "Heltid" },
                        { label: "Deltid", value: "Deltid" },
                    ]}
                    checked={state.heltidDeltid}
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_HELTID_DELTID)}
                />

                {state.heltidDeltid === "Deltid" && (
                    <Input
                        value={state.stillingsprosent ?? ""}
                        type={"number"}
                        min={0}
                        max={100}
                        label="Oppgi stillingsprosent"
                        onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_STILLINGSPROSENT)}
                    />
                )}
                <br />

                <Input
                    value={state.arbeidsgiver.navn}
                    label="Arbeidsgivers navn (Virksomhetens navn)"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_ARBEIDSGIVER_NAVN)}
                />
                <Input
                    value={state.arbeidsgiver.adresse}
                    label="Arbeidsgivers adresse (Virksomhetens adresse)"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_ARBEIDSGIVER_ADRESSE)}
                />

                <Input
                    value={state.inntekt.bruttoArbeidsinntektPrMd}
                    label="Brutto arbeidsinntekt pr. måned"
                    placeholder="Kr"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_BRUTTO_ARBEIDSINNTEKT)}
                />
                <Input
                    value={state.inntekt.personinntektFraNaeringPrAr}
                    label="Beregnet personinntekt fra næring pr. år"
                    placeholder="Kr"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_PERSONINNTEKT)}
                />
            </SkjemaGruppe>
        </>
    );
};

export default NavaerendeArbeidsforhold;
