import React, { useEffect, useState } from "react";
import "../../../App.less";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import Datovelger from "../../felles/Datovelger";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import TekstInput from "../../felles/TekstInput";
import { IArbeidsforhold, ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";

const NavaerendeArbeidsforhold: SoknadSteg = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const initialState: IArbeidsforhold = state.naavaerendeArbeidsforhold || {};

    const [arbeidsforhold, setArbeidsforhold] = useState(initialState);

    useEffect(() => {
        dispatch({
            type: ActionTypes.OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD,
            payload: arbeidsforhold,
        });
    }, [arbeidsforhold, dispatch]);

    return (
        <>
            {/* Steg 6 */}
            {/* TODO: I arbeid eller student? */}
            {/* TODO: Hvis student, ikke vise dette skjemaet */}

            <Systemtittel>{t("naavaerendeArbeidsforhold.tittel")}</Systemtittel>

            <SkjemaGruppe>
                <TekstInput
                    value={arbeidsforhold.yrke}
                    label={t("felles.yrke")}
                    onChange={(yrke) => setArbeidsforhold({ ...arbeidsforhold, yrke })}
                />
                <TekstInput
                    value={arbeidsforhold.stilling}
                    label={t("felles.stilling")}
                    onChange={(stilling) => setArbeidsforhold({ ...arbeidsforhold, stilling })}
                />

                <div className={"skjemagruppe skjemagruppe__inline"}>
                    <Datovelger
                        valgtDato={arbeidsforhold.startDato}
                        label={t("felles.startDato")}
                        onChange={(startDato) => setArbeidsforhold({ ...arbeidsforhold, startDato })}
                    />
                    <Datovelger
                        valgtDato={arbeidsforhold.sluttDato}
                        label={t("felles.sluttDato")}
                        onChange={(sluttDato) => setArbeidsforhold({ ...arbeidsforhold, sluttDato })}
                    />
                </div>
                <br />

                <RadioPanelGruppe
                    name={"ansettelsesforhold"}
                    legend={t("naavaerendeArbeidsforhold.typeArbeidsforhold")}
                    radios={[
                        { label: t("naavaerendeArbeidsforhold.fast"), value: "Fast" },
                        { label: t("naavaerendeArbeidsforhold.midlertidig"), value: "Midlertidig" },
                        { label: t("naavaerendeArbeidsforhold.sesongarbeid"), value: "Sesongarbeid" },
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
                    legend={t("naavaerendeArbeidsforhold.heltidEllerDeltid")}
                    radios={[
                        { label: t("naavaerendeArbeidsforhold.heltid"), value: "Heltid" },
                        { label: t("naavaerendeArbeidsforhold.deltid"), value: "Deltid" },
                    ]}
                    checked={arbeidsforhold.heltidDeltid}
                    onChange={(e) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            heltidDeltid: (e.target as HTMLInputElement).value,
                        })
                    }
                />

                {arbeidsforhold.heltidDeltid === "Deltid" && (
                    <Input
                        value={arbeidsforhold.stillingsprosent ?? ""}
                        type={"number"}
                        min={0}
                        max={100}
                        label={t("naavaerendeArbeidsforhold.stillingsprosent")}
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
                    value={arbeidsforhold.arbeidsgiver?.navn}
                    label={t("naavaerendeArbeidsforhold.arbeidsgiversNavn")}
                    onChange={(navn) =>
                        setArbeidsforhold({ ...arbeidsforhold, arbeidsgiver: { ...arbeidsforhold.arbeidsgiver, navn } })
                    }
                />
                <TekstInput
                    value={arbeidsforhold.arbeidsgiver?.adresse}
                    label={t("naavaerendeArbeidsforhold.arbeidsgiversAdresse")}
                    onChange={(adresse) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            arbeidsgiver: { ...arbeidsforhold.arbeidsgiver, adresse },
                        })
                    }
                />

                <TekstInput
                    value={arbeidsforhold.inntekt?.bruttoArbeidsinntektPrMd}
                    label={t("naavaerendeArbeidsforhold.bruttoInntektPrMd")}
                    placeholder="Kr"
                    onChange={(bruttoArbeidsinntektPrMd) =>
                        setArbeidsforhold({
                            ...arbeidsforhold,
                            inntekt: { ...arbeidsforhold.inntekt, bruttoArbeidsinntektPrMd },
                        })
                    }
                />
                <TekstInput
                    value={arbeidsforhold.inntekt?.personinntektFraNaeringPrAr}
                    label={t("naavaerendeArbeidsforhold.personinntektFraNaering")}
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
