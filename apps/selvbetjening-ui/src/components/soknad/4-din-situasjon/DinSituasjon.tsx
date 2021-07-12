import SoknadSteg from "../../../typer/SoknadSteg";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import React from "react";
import { ISituasjon, JobbStatus } from "../../../typer/situasjon";
import { FormProvider, useForm } from "react-hook-form";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import NavaerendeArbeidsforhold from "./fragmenter/NavaerendeArbeidsforhold";
import Feilmeldinger from "../../felles/Feilmeldinger";
import AndreYtelser from "./fragmenter/AndreYtelser";
import HoeyesteUtdanning from "./fragmenter/HoeyesteUtdanning";
import TidligereArbeidsforhold from "./fragmenter/TidligereArbeidsforhold";
import { Systemtittel } from "nav-frontend-typografi";
import Navigasjon from "../../felles/Navigasjon";
import { useTranslation } from "react-i18next";

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

    const lagre = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: data });
        neste!!();
    };

    const status = watch("status")

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Systemtittel className={"center"}>
                        Arbeid og utdanning
                    </Systemtittel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFRadio
                        name={"status"}
                        legend={"Er du for tiden i arbeid?"}
                        radios={Object.values(JobbStatus).map(value => {
                            return { label: t(value), value } as RadioProps;
                        })}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"selvstendigNaeringsdrivende"}
                        legend={"Er du selvstendig næringsdrivende?"}
                    />
                </SkjemaGruppe>

                {status === JobbStatus.arbeidstaker && (
                    <NavaerendeArbeidsforhold />
                )}

                <HoeyesteUtdanning />

                <TidligereArbeidsforhold />

                <AndreYtelser />

                <Feilmeldinger errors={errors}/>

                <Navigasjon
                    forrige={forrige}
                    neste={handleSubmit(lagre)}
                />
            </form>
        </FormProvider>
    )
}

export default DinSituasjon;
