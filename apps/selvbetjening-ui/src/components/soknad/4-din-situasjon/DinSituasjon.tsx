import SoknadSteg from "../../../typer/SoknadSteg";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { RHFRadio } from "../../felles/RHFRadio";
import { ISituasjon, JobbStatus } from "../../../typer/situasjon";
import { FormProvider, useForm } from "react-hook-form";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import NavaerendeArbeidsforhold from "./fragmenter/NavaerendeArbeidsforhold";
import Feilmeldinger from "../../felles/Feilmeldinger";
import AndreYtelser from "./fragmenter/AndreYtelser";
import HoeyesteUtdanning from "./fragmenter/HoeyesteUtdanning";
import TidligereArbeidsforhold from "./fragmenter/TidligereArbeidsforhold";
import { Systemtittel, Undertittel } from "nav-frontend-typografi";
import Navigasjon from "../../felles/Navigasjon";
import { useTranslation } from "react-i18next";
import UnderUtdanning from "./fragmenter/UnderUtdanning";
import { RHFInput } from "../../felles/RHFInput";

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

    const jobbStatus = watch("jobbStatus")

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Systemtittel className={"center"}>
                        Situasjonen din
                    </Systemtittel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Undertittel>
                        Arbeid og utdanning
                    </Undertittel>
                </SkjemaGruppe>

                <RHFRadio
                    name={"jobbStatus"}
                    legend={t("dinSituasjon.jobbStatus")}
                    hjelpetekst={t("dinSituasjon.jobbStatusHvorfor")}
                    radios={Object.values(JobbStatus).map(value => {
                        return { label: t(value), value } as RadioProps;
                    })}
                />

                {jobbStatus === JobbStatus.arbeidstaker && (
                    <NavaerendeArbeidsforhold />
                )}

                {jobbStatus === JobbStatus.underUtdanning && (
                    <UnderUtdanning />
                )}

                {jobbStatus === JobbStatus.ingen && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"beskrivelseIngen"}
                            label={"Beskrivelse"}
                        />
                    </SkjemaGruppe>
                )}

                <TidligereArbeidsforhold />

                <HoeyesteUtdanning />

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
