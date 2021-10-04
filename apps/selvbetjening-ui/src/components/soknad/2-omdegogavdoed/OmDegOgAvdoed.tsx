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
import { Cell, Grid, Label, Title } from "@navikt/ds-react";
import { RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import NySivilstatus from "./nySivilstatus/NySivilstatus";
import Navigasjon from "../../felles/Navigasjon";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";
import { isEmpty } from "lodash";
import useEffectOnce from "../../../hooks/useEffectOnce";

const OmDegOgAvdoed: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const lagre = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: data })
        neste!!()
    };

    const methods = useForm<ISoekerOgAvdoed>({
        defaultValues: state.omDegOgAvdoed || {},
        shouldUnregister: true
    });

    useEffectOnce(() => {
        methods.reset(state.omDegOgAvdoed);
    }, !isEmpty(state.omDegOgAvdoed));

    const {
        handleSubmit,
        formState: { errors }
    } = methods;

    return (
        <>
            {/* Steg 2 */}
            <SkjemaGruppe>
                <Title size={"m"} className={"center"}>
                    {t("omDegOgAvdoed.tittel")}
                </Title>
            </SkjemaGruppe>

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
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

                    <RHFSpoersmaalRadio
                        name={"avdoed.doedsfallAarsak"}
                        legend={t("omDegOgAvdoed.avdoed.doedsfallAarsak")}
                        description={
                            <HvorforSpoerVi>{t("omDegOgAvdoed.avdoed.doedsfallAarsakHvorfor")}</HvorforSpoerVi>}
                        vetIkke
                    />

                    {/* 2.9 */}
                    <ForholdTilAvdoedeSkjema/>

                    <NySivilstatus/>

                    <Feilmeldinger errors={errors}/>

                    <Navigasjon
                        forrige={{ onClick: forrige }}
                        neste={{ onClick: handleSubmit(lagre) }}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default OmDegOgAvdoed;
