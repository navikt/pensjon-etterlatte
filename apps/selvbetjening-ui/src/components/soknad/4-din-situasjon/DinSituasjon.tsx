import SoknadSteg from "../../../typer/SoknadSteg";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import React from "react";
import { ISituasjon, JobbStatus } from "../../../typer/situasjon";
import { useForm, FormProvider } from "react-hook-form";
import { IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import NavaerendeArbeidsforhold from "./fragmenter/NavaerendeArbeidsforhold";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import AndreYtelser from "./fragmenter/AndreYtelser";
import HoeyesteUtdanning from "./fragmenter/HoeyesteUtdanning";
import TidligereArbeidsforhold from "./fragmenter/TidligereArbeidsforhold";
import { Undertittel } from "nav-frontend-typografi";

const DinSituasjon: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();

    const { state, dispatch } = useSoknadContext();

    const methods = useForm<ISituasjon>({
        defaultValues: state.dinSituasjon || {},
        shouldUnregister: true
    });

    const {
        handleSubmit,
        formState: { errors },
        watch
    } = methods;

    const lagre = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: data });
        neste!!();
    };

    const status = watch("status")

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Undertittel>
                        Arbeid og utdanning
                    </Undertittel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFRadio
                        name={"status"}
                        legend={"Er du for tiden i arbeid?"}
                        radios={[
                            { label: "Ja", value: JobbStatus.Arbeidstaker },
                            { label: "Nei, er arbeidsledig", value: JobbStatus.Arbeidsledig },
                            { label: "Nei, er under utdanning", value: JobbStatus.UnderUtdanning },
                        ]}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"selvstendigNaeringsdrivende"}
                        legend={"Er du selvstendig næringsdrivende?"}
                    />
                </SkjemaGruppe>

                {status === JobbStatus.Arbeidstaker && (
                    <NavaerendeArbeidsforhold />
                    // Mulig tidligere arbeidsforhold må inn i komp over...
                )}

                <HoeyesteUtdanning />

                <TidligereArbeidsforhold />

                <AndreYtelser />

                <Feilmeldinger errors={errors}/>

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Knapp htmlType={"button"} onClick={forrige}>
                        {t("knapp.tilbake")}
                    </Knapp>

                    <Hovedknapp htmlType={"button"} onClick={handleSubmit(lagre)}>
                        {t("knapp.neste")}
                    </Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    )
}

export default DinSituasjon;
