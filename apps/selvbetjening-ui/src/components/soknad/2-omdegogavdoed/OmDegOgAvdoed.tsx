import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoekerOgAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { FormProvider, useForm } from "react-hook-form";
import { RHFInput } from "../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import ForholdTilAvdoedeSkjema from "./forholdTilAvdoede/ForholdTilAvdoedeSkjema";
import Feilmeldinger from "../../felles/Feilmeldinger";
import Datovelger from "../../felles/Datovelger";
import { Cell, Grid, Label, Heading } from "@navikt/ds-react";
import NySivilstatus from "./nySivilstatus/NySivilstatus";
import Navigasjon from "../../felles/Navigasjon";
import { deepCopy } from "../../../utils/deepCopy";

const OmDegOgAvdoed: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<ISoekerOgAvdoed>({
        defaultValues: state.omDegOgAvdoed || {},
        shouldUnregister: true
    });

    const {
        handleSubmit,
        formState: { errors },
        getValues
    } = methods;

    const erValidert = state.omDegOgAvdoed.erValidert;

    const lagreNeste = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    };

    const lagreTilbake = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    return (
        <>
            <SkjemaGruppe>
                <Heading size={"medium"} className={"center"}>
                    {t("omDegOgAvdoed.tittel")}
                </Heading>
            </SkjemaGruppe>

            <FormProvider {...methods}>
                <form>
                    <SkjemaGruppe>
                        <Label>{t("omDegOgAvdoed.avdoed.hvem")}</Label>

                        <Grid>
                            <Cell xs={12} md={6}>
                                <RHFInput
                                    name={"avdoed.fornavn"}
                                    label={t("omDegOgAvdoed.avdoed.fornavn")}
                                />
                            </Cell>

                            <Cell xs={12} md={6}>
                                <RHFInput
                                    name={"avdoed.etternavn"}
                                    label={t("omDegOgAvdoed.avdoed.etternavn")}
                                />
                            </Cell>
                        </Grid>
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <Label>{t("omDegOgAvdoed.avdoed.datoForDoedsfallet")}</Label>

                        <Datovelger
                            name={"avdoed.datoForDoedsfallet"}
                            label={t("omDegOgAvdoed.avdoed.dato")}
                            maxDate={new Date()}
                        />
                    </SkjemaGruppe>

                    <ForholdTilAvdoedeSkjema/>

                    <NySivilstatus/>

                    <Feilmeldinger errors={errors}/>

                    <Navigasjon
                        forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                        neste={{ onClick: handleSubmit(lagreNeste) }}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default OmDegOgAvdoed;
