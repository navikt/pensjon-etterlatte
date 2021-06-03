import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import "react-datepicker/dist/react-datepicker.css";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import Datovelger from "../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import { ISituasjon, Ytelse } from "../../../typer/ytelser";
import Feilmeldinger from "../../felles/Feilmeldinger";

const SoekerSituasjon: SoknadSteg = ({ neste }) => {
    const { t } = useTranslation();

    const { state, dispatch } = useSoknadContext();

    const methods = useForm<ISituasjon>({
        defaultValues: state.situasjon || {},
    });

    const {
        handleSubmit,
        formState: { errors },
        watch
    } = methods;

    const lagre = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_SITUASJON, payload: data });
        neste!!();
    };

    const hovedytelse = watch("valgteYtelser.hovedytelse")

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Systemtittel className={"center"}>Din situasjon</Systemtittel>
                </SkjemaGruppe>

                <RHFRadio
                    name={"valgteYtelser.hovedytelse"}
                    legend={"Jeg har mistet min ektefelle/partner/samboer og er ..."}
                    radios={[
                        {
                            label: <>... i arbeid/under utdanning/arbeidsledig og
                                søker <b>gjenlevendepensjon-/overgangsstønad</b></>,
                            value: Ytelse.etterlatte
                        },
                        {
                            label: <>... uføretrygdet og søker <b>gjenlevendetillegg i uføretrygden</b></>,
                            value: Ytelse.gjenlevendetillegg
                        },
                    ]}
                />

                {hovedytelse && (
                    <SkjemaGruppe>
                        <AlertStripe type={"advarsel"}>
                            Dersom du har gradert uføretrygd har du ikke rett på gjenlevendetillegg i uføretrygden.
                        </AlertStripe>
                    </SkjemaGruppe>
                )}

                <RHFToValgRadio
                    name={"valgteYtelser.barnepensjon"}
                    legend={"Har/hadde du barn under 18 år med avdøde og vil søke om barnepensjon i tillegg?"}
                />

                {/*
                TODO: Lenke til skjemaer

                Heter nå 17-09.01

                https://www.nav.no/soknader/nb/person/pensjon/gjenlevende-ektefelle-partner-eller-samboer#NAV151201


                Andre ytelser du kan ha krav på som gjenlevende. Stønad til barnetilsyn på grunn av arbeid.
                Du kan ha rett til stønad til barnetilsyn hvis du trenger tilsyn av barn på grunn av arbeid,
                (NAV 17-09.01).

                Stønad til skolepenger. Du kan ha rett til stønad til skolepenger ved nødvendig og hensiktsmessig
                utdanning. (NAV 17-09.01).

                */}

                <SkjemaGruppe>
                    <Datovelger
                        name={"fraDato"}
                        label={t("felles.fraDato")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <AlertStripe type="info">
                        <strong>{t("stoenadType.etterbetaling.tittel")}: </strong>
                        {t("stoenadType.etterbetaling.info")}
                    </AlertStripe>
                </SkjemaGruppe>

                <Feilmeldinger errors={errors} />

                <SkjemaGruppe className={"navigasjon-rad"}>
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

export default SoekerSituasjon;
