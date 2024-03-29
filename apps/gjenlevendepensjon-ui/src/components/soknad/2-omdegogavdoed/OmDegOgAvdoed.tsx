import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoekerOgAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { FormProvider, useForm } from "react-hook-form";
import { RHFInput } from "../../felles/rhf/RHFInput";
import { SkjemaGruppe } from "../../felles/SkjemaGruppe";
import ForholdTilAvdoedeSkjema from "./forholdTilAvdoede/ForholdTilAvdoedeSkjema";
import Feilmeldinger from "../../felles/Feilmeldinger";
import Datovelger from "../../felles/Datovelger";
import { Cell, Grid, Label, Heading, Alert, Link } from "@navikt/ds-react";
import NySivilstatus from "./nySivilstatus/NySivilstatus";
import Navigasjon from "../../felles/Navigasjon";
import { deepCopy } from "../../../utils/deepCopy";
import {SkjemaElement} from "../../felles/SkjemaElement";

const OmDegOgAvdoed: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<ISoekerOgAvdoed>({
        defaultValues: state.omDegOgAvdoed || {},
        shouldUnregister: true,
    });

    const {
        handleSubmit,
        formState: { errors },
        getValues,
        watch
    } = methods;

    const erValidert = state.omDegOgAvdoed.erValidert;

    const datoForDoedsfallet = watch("avdoed.datoForDoedsfallet")

    const lagreNeste = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } });
        neste!!();
    };

    const lagreTilbake = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } });
        forrige!!();
    };

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues();
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(verdier), erValidert: false } });
        forrige!!();
    };

    const doedsfallEtterNovember2023 = (dato: any): boolean => {
        if (!dato) return false

        const doedsfallDato = new Date(dato)
        doedsfallDato.setHours(0, 0, 0, 0)

        return doedsfallDato > new Date(2023, 10, 30)
    }

    return (
        <>
            <SkjemaElement>
                <Heading size={"medium"} className={"center"}>
                    {t("omDegOgAvdoed.tittel")}
                </Heading>
            </SkjemaElement>

            <FormProvider {...methods}>
                <form>
                    <SkjemaGruppe>
                        <Label>{t("omDegOgAvdoed.avdoed.hvem")}</Label>

                        <Grid>
                            <Cell xs={12} md={6}>
                                <RHFInput name={"avdoed.fornavn"} label={t("omDegOgAvdoed.avdoed.fornavn")} />
                            </Cell>

                            <Cell xs={12} md={6}>
                                <RHFInput name={"avdoed.etternavn"} label={t("omDegOgAvdoed.avdoed.etternavn")} />
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

                        <br/>
                        {doedsfallEtterNovember2023(datoForDoedsfallet) && (
                                <Alert variant='warning'>
                                    {t('omDegOgAvdoed.avdoed.dato.etterNovember')}
                                    <Link href={t('omDegOgAvdoed.avdoed.dato.etterNovember.href')}>
                                        {t('omDegOgAvdoed.avdoed.dato.etterNovember.link')}
                                    </Link>
                                </Alert>
                        )}
                    </SkjemaGruppe>

                    <ForholdTilAvdoedeSkjema />

                    <NySivilstatus />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon
                        forrige={{
                            onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering,
                        }}
                        neste={{ onClick: handleSubmit(lagreNeste) }}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default OmDegOgAvdoed;
