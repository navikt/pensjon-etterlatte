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
import Datovelger from "../../felles/Datovelger";
import { RHFInput } from "../../felles/RHFInput";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import { IArbeidsforhold } from "../../../typer/arbeidsforhold";
import Feilmeldinger from "../../felles/Feilmeldinger";

const NavaerendeArbeidsforhold: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IArbeidsforhold>({
        defaultValues: state.naavaerendeArbeidsforhold || {},
        shouldUnregister: true
    });

    const {
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

            <Systemtittel className={"center"}>{t("naavaerendeArbeidsforhold.tittel")}</Systemtittel>

            <form>
                <SkjemaGruppe>
                    <RHFInput
                        name={"yrke"}
                        label={t("naavaerendeArbeidsforhold.yrke")}
                    />

                    <RHFInput
                        name={"stilling"}
                        label={t("naavaerendeArbeidsforhold.stilling")}
                    />
                </SkjemaGruppe>

                <div className={"skjemagruppe skjemagruppe__inline"}>
                    <Datovelger
                        name={"startDato"}
                        label={t("naavaerendeArbeidsforhold.startDato")}
                        maxDate={watch("sluttDato")}
                    />

                    <Datovelger
                        name={"sluttDato"}
                        label={t("naavaerendeArbeidsforhold.sluttDato")}
                        minDate={watch("startDato")}
                    />
                </div>

                <SkjemaGruppe>
                    <RHFRadio
                        name={"ansettelsesforhold"}
                        legend={t("naavaerendeArbeidsforhold.ansettelsesforhold")}
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
                        legend={t("naavaerendeArbeidsforhold.heltidDeltid")}
                        overrideRadios={[
                            { label: t("naavaerendeArbeidsforhold.heltid"), value: "Heltid" },
                            { label: t("naavaerendeArbeidsforhold.deltid"), value: "Deltid" },
                        ]}
                    />

                    {heltidDeltid === "Deltid" && (
                        <RHFInput
                            name={"stillingsprosent"}
                            label={t("naavaerendeArbeidsforhold.stillingsprosent")}
                            rules={{ pattern: /^[0-9]{1,2}$/ }}
                        />
                    )}
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFInput
                        name={"arbeidsgiver.navn"}
                        label={t("naavaerendeArbeidsforhold.arbeidsgiver.navn")}
                    />
                    <RHFInput
                        name={"arbeidsgiver.adresse"}
                        label={t("naavaerendeArbeidsforhold.arbeidsgiver.adresse")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFInput
                        name={"inntekt.bruttoArbeidsinntektPrMd"}
                        label={t("naavaerendeArbeidsforhold.inntekt.bruttoArbeidsinntektPrMd")}
                        rules={{ pattern: /^\d+$/ }}
                    />
                    <RHFInput
                        name={"inntekt.personinntektFraNaeringPrAr"}
                        label={t("naavaerendeArbeidsforhold.inntekt.personinntektFraNaeringPrAr")}
                        rules={{ pattern: /^\d+$/ }}
                    />
                </SkjemaGruppe>

                <Feilmeldinger errors={errors}/>

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Knapp
                        htmlType={"button"}
                        onClick={forrige}
                    >
                        {t("knapp.tilbake")}
                    </Knapp>

                    <Hovedknapp
                        htmlType={"button"}
                        onClick={handleSubmit(lagre)}
                    >
                        {t("knapp.neste")}
                    </Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default NavaerendeArbeidsforhold;
