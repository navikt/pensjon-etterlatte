import SoknadSteg from "../../../typer/SoknadSteg";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { ISituasjon, JobbStatus } from "../../../typer/situasjon";
import { IngenJobb } from "../../../typer/arbeidsforhold";
import { FormProvider, useForm } from "react-hook-form";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import NavaerendeArbeidsforhold from "./fragmenter/NavaerendeArbeidsforhold";
import Feilmeldinger from "../../felles/Feilmeldinger";
import AndreYtelser from "./fragmenter/AndreYtelser";
import HoeyesteUtdanning from "./fragmenter/HoeyesteUtdanning";
import Navigasjon from "../../felles/Navigasjon";
import { useTranslation } from "react-i18next";
import UnderUtdanning from "./fragmenter/UnderUtdanning";
import { RHFSelect } from "../../felles/RHFSelect";
import { BodyLong, Heading } from "@navikt/ds-react";
import { RHFCheckboksPanelGruppe } from "../../felles/RHFCheckboksPanelGruppe";
import SkjemaGruppering from "../../felles/SkjemaGruppering";
import { deepCopy } from "../../../utils/deepCopy";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";

const DinSituasjon: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();

    const { state, dispatch } = useSoknadContext();
    const brukerState = useBrukerContext().state;

    const methods = useForm<ISituasjon>({
        defaultValues: state.dinSituasjon || {},
        shouldUnregister: true,
    });

    const {
        handleSubmit,
        formState: { errors },
        getValues,
        watch,
    } = methods;

    const lagreNeste = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: { ...deepCopy(data), erValidert: true } });
        neste!!();
    };

    const lagreTilbake = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: { ...deepCopy(data), erValidert: true } });
        forrige!!();
    };

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues();
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: { ...deepCopy(verdier), erValidert: false } });
        forrige!!();
    };

    const erValidert = state.dinSituasjon.erValidert;
    const jobbStatus = watch("jobbStatus");

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Heading size={"medium"} className={"center"}>
                        {t("dinSituasjon.tittel")}
                    </Heading>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Heading size={"small"}>{t("dinSituasjon.undertittel")}</Heading>
                    <BodyLong>{t("dinSituasjon.ingress")}</BodyLong>
                </SkjemaGruppe>

                {!brukerState.adressebeskyttelse && (
                    <>
                        <RHFCheckboksPanelGruppe
                            name={"jobbStatus"}
                            legend={t("dinSituasjon.jobbStatus")}
                            checkboxes={Object.values(JobbStatus).map((value) => {
                                return { label: t(value), value, required: true } as RadioProps;
                            })}
                        />

                        {(jobbStatus?.includes(JobbStatus.selvstendig) ||
                            jobbStatus?.includes(JobbStatus.arbeidstaker)) && <NavaerendeArbeidsforhold />}

                        {jobbStatus?.includes(JobbStatus.underUtdanning) && <UnderUtdanning />}

                        {jobbStatus?.includes(JobbStatus.ingen) && (
                            <SkjemaGruppering>
                                <SkjemaGruppe>
                                    <Heading size={"small"}>{t("dinSituasjon.ingenJobbTittel")}</Heading>
                                </SkjemaGruppe>
                                <RHFSelect
                                    name={"ingenJobbBeskrivelse"}
                                    label={t("dinSituasjon.ingenJobbBeskrivelse")}
                                    selectOptions={[
                                        { label: t("felles.velg"), value: "" },
                                        {
                                            label: t(IngenJobb.hjemmearbeidende),
                                            value: IngenJobb.hjemmearbeidende,
                                        },
                                        {
                                            label: t(IngenJobb.omsorgBarn),
                                            value: IngenJobb.omsorgBarn,
                                        },
                                        {
                                            label: t(IngenJobb.omsorgNaerstaaende),
                                            value: IngenJobb.omsorgNaerstaaende,
                                        },
                                        {
                                            label: t(IngenJobb.frivilligArbeid),
                                            value: IngenJobb.frivilligArbeid,
                                        },
                                        {
                                            label: t(IngenJobb.annet),
                                            value: IngenJobb.annet,
                                        },
                                    ]}
                                />
                            </SkjemaGruppering>
                        )}

                        <HoeyesteUtdanning />
                    </>
                )}

                <AndreYtelser />

                <Feilmeldinger errors={errors} />

                <Navigasjon
                    forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                    neste={{ onClick: handleSubmit(lagreNeste) }}
                />
            </form>
        </FormProvider>
    );
};

export default DinSituasjon;
