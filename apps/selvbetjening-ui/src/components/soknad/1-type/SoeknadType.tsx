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
import { IStoenadType, Ytelse } from "../../../typer/ytelser";
import Feilmeldinger from "../../felles/Feilmeldinger";

const SoeknadType: SoknadSteg = ({ neste }) => {
    const { t } = useTranslation();

    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IStoenadType>({
        defaultValues: state.stoenadType || {},
    });

    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const lagre = (data: IStoenadType) => {
        dispatch({ type: ActionTypes.OPPDATER_VALGTE_STOENADER, payload: data });
        neste!!();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(lagre)}>
                <SkjemaGruppe>
                    <Systemtittel>{t("stoenadType.tittel")}</Systemtittel>
                </SkjemaGruppe>

                <RHFRadio
                    name={"valgteYtelser.hovedytelse"}
                    legend={"Velg hovedytelsen du vil søke om"}
                    radios={[
                        { label: t("etterlatteytelser.etterlatte"), value: Ytelse.etterlatte },
                        { label: t("etterlatteytelser.gjenlevendetillegg"), value: Ytelse.gjenlevendetillegg },
                    ]}
                />

                <RHFToValgRadio
                    name={"valgteYtelser.barnepensjon"}
                    legend={"Har du barn og vil søke om barnepensjon?"}
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
                    <Hovedknapp htmlType={"submit"}>{t("knapp.neste")}</Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default SoeknadType;
