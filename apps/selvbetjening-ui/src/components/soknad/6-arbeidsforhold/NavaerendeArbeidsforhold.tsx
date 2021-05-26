import React from "react";
import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Datovelger from "../../felles/Datovelger";
import RHFInput from "../../felles/RHFInput";
import NaavaerendeArbeidsforholdSchema from "./NaavaerendeArbeidsforholdSchema";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import { IArbeidsforhold } from "../../../typer/arbeidsforhold";

const NavaerendeArbeidsforhold: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IArbeidsforhold>({
        defaultValues: state.naavaerendeArbeidsforhold || {},
        resolver: yupResolver(NaavaerendeArbeidsforholdSchema),
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const lagre = (data: IArbeidsforhold) => {
        dispatch({ type: ActionTypes.OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD, payload: data });
        neste!!();
    };

    const heltidDeltid = watch("heltidDeltid")

    return (
        <FormProvider {...methods}>
            {/* Steg 6 */}
            {/* TODO: I arbeid eller student? */}
            {/* TODO: Hvis student, ikke vise dette skjemaet */}

            <Systemtittel>{t("naavaerendeArbeidsforhold.tittel")}</Systemtittel>

            <form onSubmit={handleSubmit(lagre)}>
                <SkjemaGruppe>
                    <RHFInput
                        name={"yrke"}
                        label={t("felles.yrke")}
                    />

                    <RHFInput
                        name={"stilling"}
                        label={t("felles.stilling")}
                    />
                </SkjemaGruppe>

                <div className={"skjemagruppe skjemagruppe__inline"}>
                    <Datovelger
                        name={"startDato"}
                        control={control}
                        label={t("felles.startDato")}
                        feil={errors.startDato && "Startdato må fylles ut"}
                    />

                    <Datovelger
                        name={"sluttDato"}
                        control={control}
                        label={t("felles.sluttDato")}
                        feil={errors.sluttDato && "Sluttdato må fylles ut"}
                    />
                </div>

                <SkjemaGruppe>
                    <RHFRadio
                        name={"ansettelsesforhold"}
                        legend={t("naavaerendeArbeidsforhold.typeArbeidsforhold")}
                        radios={[
                            { label: t("naavaerendeArbeidsforhold.fast"), value: "Fast" },
                            { label: t("naavaerendeArbeidsforhold.midlertidig"), value: "Midlertidig" },
                            { label: t("naavaerendeArbeidsforhold.sesongarbeid"), value: "Sesongarbeid" },
                        ]}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"heltidDeltid"}
                        legend={t("naavaerendeArbeidsforhold.heltidEllerDeltid")}
                        overrideRadios={[
                            { label: t("naavaerendeArbeidsforhold.heltid"), value: "Heltid" },
                            { label: t("naavaerendeArbeidsforhold.deltid"), value: "Deltid" },
                        ]}
                    />

                    {heltidDeltid === "Deltid" && (
                        <RHFInput
                            name={"stillingsprosent"}
                            label={t("naavaerendeArbeidsforhold.stillingsprosent")}
                        />
                    )}
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFInput
                        name={"arbeidsgiver.navn"}
                        label={t("naavaerendeArbeidsforhold.arbeidsgiversNavn")}
                    />
                    <RHFInput
                        name={"arbeidsgiver.adresse"}
                        label={t("naavaerendeArbeidsforhold.arbeidsgiversAdresse")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFInput
                        name={"inntekt.bruttoArbeidsinntektPrMd"}
                        label={t("naavaerendeArbeidsforhold.bruttoInntektPrMd")}
                    />
                    <RHFInput
                        name={"inntekt.personinntektFraNaeringPrAr"}
                        label={t("naavaerendeArbeidsforhold.personinntektFraNaering")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>

                    <Hovedknapp htmlType={"submit"}>{t("knapp.neste")}</Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default NavaerendeArbeidsforhold;
