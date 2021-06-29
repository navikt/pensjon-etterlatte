import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import "react-datepicker/dist/react-datepicker.css";
import { Element, Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import Datovelger from "../../felles/Datovelger";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import { IOmSoeknaden } from "../../../typer/ytelser";
import Feilmeldinger from "../../felles/Feilmeldinger";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import { PopoverOrientering } from "nav-frontend-popover";

const OmSoeknaden: SoknadSteg = ({ neste }) => {
    const { t } = useTranslation();

    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IOmSoeknaden>({
        defaultValues: state.omSoeknaden || {},
        shouldUnregister: true
    });

    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    // TODO: Alertstripe med info om når de vil kunne motta støtte
    // const doedsdato = watch("datoForDoedsfallet")

    const lagre = (data: IOmSoeknaden) => {
        dispatch({ type: ActionTypes.OPPDATERT_OM_SOEKNADEN, payload: data });
        neste!!();
    };

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Systemtittel className={"center"}>
                        Om søknaden
                    </Systemtittel>
                </SkjemaGruppe>

                <Element>Når skjedde dødsfallet?</Element>
                <Datovelger
                    name={"datoForDoedsfallet"}
                    label={"Dato"}
                />

                <RHFToValgRadio
                    name={"barnepensjon"}
                    legend={<div style={{display: "flex"}}>
                        Har/hadde du barn felles barn med avdøde som du ønsker å søke barnepensjon for?
                        <Hjelpetekst type={PopoverOrientering.Over}>
                            Denne vil åpnes over knappen.
                        </Hjelpetekst>
                    </div>}
                />

                <SkjemaGruppe>
                    <AlertStripe type="info">
                        <strong>{t("situasjon.etterbetaling.tittel")}: </strong>
                        {t("situasjon.etterbetaling.info")}
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

export default OmSoeknaden;
