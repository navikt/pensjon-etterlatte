import React, { useEffect, useState } from "react";
import "../../../App.less";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import Datovelger from "../../felles/Datovelger";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import TekstInput from "../../felles/TekstInput";
import { IArbeidsforhold, SoeknadActionTypes } from "../../../context/soknad/soknad";

const NavaerendeArbeidsforhold: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();

    const initialState: IArbeidsforhold = state.naavaerendeArbeidsforhold || {
        yrke: "",
        stilling: "",
        startDato: null,
        sluttDato: null,
        ansettelsesforhold: "", // låse valg til type?
        heltidDeltid: "",
        stillingsprosent: null,
        arbeidsgiver: {
            navn: "",
            adresse: "",
        },
        inntekt: {
            bruttoArbeidsinntektPrMd: "",
            personinntektFraNaeringPrAr: "",
        },
    };

    const [arbeidsforhold, setArbeidsforhold] = useState(initialState);

    useEffect(() => {
        dispatch({ type: SoeknadActionTypes.OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD, payload: arbeidsforhold });
    }, [arbeidsforhold, dispatch]);

    return (
        <>
            {/* Steg 6 */}
            {/* TODO: I arbeid eller student? */}
            {/* TODO: Hvis student, ikke vise dette skjemaet */}

            <Systemtittel>6 Søkers nåværende arbeids- og inntektsforhold</Systemtittel>

            <SkjemaGruppe>
                <TekstInput
                    value={arbeidsforhold.yrke}
                    label="Yrke"
                    onChange={(yrke) => setArbeidsforhold({ ...arbeidsforhold, yrke })}
                />
                <TekstInput
                    value={arbeidsforhold.stilling}
                    label="Stilling"
                    onChange={(stilling) => setArbeidsforhold({ ...arbeidsforhold, stilling })}
                />
                <Datovelger
                    valgtDato={arbeidsforhold.startDato}
                    label={"Startdato"}
                    onChange={(startDato) => setArbeidsforhold({ ...arbeidsforhold, startDato })}
                />
                <Datovelger
                    valgtDato={arbeidsforhold.sluttDato}
                    label={"Fremtidig sluttdato"}
                    onChange={(sluttDato) => setArbeidsforhold({ ...arbeidsforhold, sluttDato })}
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
                    checked={arbeidsforhold.ansettelsesforhold}
                    onChange={(e) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            ansettelsesforhold: (e.target as HTMLInputElement).value,
                        })
                    }
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
                    checked={arbeidsforhold.heltidDeltid}
                    onChange={(e) =>
                        setArbeidsforhold({ ...arbeidsforhold, heltidDeltid: (e.target as HTMLInputElement).value })
                    }
                />

                {arbeidsforhold.heltidDeltid === "Deltid" && (
                    <Input
                        value={arbeidsforhold.stillingsprosent ?? ""}
                        type={"number"}
                        min={0}
                        max={100}
                        label="Oppgi stillingsprosent"
                        onChange={(e) =>
                            setArbeidsforhold({
                                ...arbeidsforhold,
                                stillingsprosent: Number((e.target as HTMLInputElement).value),
                            })
                        }
                    />
                )}
                <br />

                <TekstInput
                    value={arbeidsforhold.arbeidsgiver.navn}
                    label="Arbeidsgivers navn (Virksomhetens navn)"
                    onChange={(navn) =>
                        setArbeidsforhold({ ...arbeidsforhold, arbeidsgiver: { ...arbeidsforhold.arbeidsgiver, navn } })
                    }
                />
                <TekstInput
                    value={arbeidsforhold.arbeidsgiver.adresse}
                    label="Arbeidsgivers adresse (Virksomhetens adresse)"
                    onChange={(adresse) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            arbeidsgiver: { ...arbeidsforhold.arbeidsgiver, adresse },
                        })
                    }
                />

                <TekstInput
                    value={arbeidsforhold.inntekt.bruttoArbeidsinntektPrMd}
                    label="Brutto arbeidsinntekt pr. måned"
                    placeholder="Kr"
                    onChange={(bruttoArbeidsinntektPrMd) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            inntekt: { ...arbeidsforhold.inntekt, bruttoArbeidsinntektPrMd },
                        })
                    }
                />
                <TekstInput
                    value={arbeidsforhold.inntekt.personinntektFraNaeringPrAr}
                    label="Beregnet personinntekt fra næring pr. år"
                    placeholder="Kr"
                    onChange={(personinntektFraNaeringPrAr) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            inntekt: { ...arbeidsforhold.inntekt, personinntektFraNaeringPrAr },
                        })
                    }
                />
            </SkjemaGruppe>
        </>
    );
};

export default NavaerendeArbeidsforhold;
