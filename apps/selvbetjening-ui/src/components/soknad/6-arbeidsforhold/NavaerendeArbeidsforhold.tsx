import React from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useArbeidsforholdContext } from "../../../context/arbeidsforhold/ArbeidsforholdContext";
import { ArbeidsforholdActionTypes } from "../../../context/arbeidsforhold/arbeidsforhold";
import SoknadSteg from "../../../typer/SoknadSteg";

const NavaerendeArbeidsforhold: SoknadSteg = ({ neste, forrige }) => {
    const { state, dispatch } = useArbeidsforholdContext();

    const update = (target: any, type: ArbeidsforholdActionTypes) => {
        dispatch({ type, payload: target.value });
    };

    return (
        <Panel>
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
                <Input
                    value={state.startDato}
                    label="Startdato (dd.mm.åå)"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_START_DATO)}
                />
                <Input
                    value={state.sluttDato}
                    label="Fremtidig sluttdato (dd.mm.åå)"
                    onChange={(e) => update(e.target, ArbeidsforholdActionTypes.OPPDATER_SLUTT_DATO)}
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
                        value={state.stillingsprosent}
                        label="Hvis deltid, oppgi prosent"
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

            <Knapp onClick={forrige}>Tilbake</Knapp>
            <Hovedknapp onClick={neste}>Neste</Hovedknapp>
        </Panel>
    );
};

export default NavaerendeArbeidsforhold;
