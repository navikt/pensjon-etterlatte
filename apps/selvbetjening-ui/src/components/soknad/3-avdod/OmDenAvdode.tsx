import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import Datovelger from "../../felles/Datovelger";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import RHFInput from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import IValg from "../../../typer/IValg";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { fnr } from "@navikt/fnrvalidator";

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IAvdoed>({
        defaultValues: state.opplysningerOmDenAvdoede || {},
    });

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const lagre = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: data });
        neste!!();
    };

    const haddePensjonsgivendeInntekt = watch("haddePensjonsgivendeInntekt")
    const haddePensjonAndreLand = watch("haddePensjonAndreLand")
    const harAvtjentMilitaerTjeneste = watch("harAvtjentMilitaerTjeneste")

    return (
        <FormProvider {...methods}>
            {/* Steg 3 */}
            <Systemtittel>{t("omDenAvdoede.tittel")}</Systemtittel>

            <form onSubmit={handleSubmit(lagre)}>
                {/* 3.1 */}
                <RHFInput
                    name={"fornavn"}
                    label={t("felles.fornavn")}
                />

                <RHFInput
                    name={"etternavn"}
                    label={t("felles.etternavn")}
                />

                {/* 3.2 */}
                <RHFInput
                    type={"number"}
                    name={"foedselsnummer"}
                    label={t("felles.fnr")}
                    rules={{validate: (value) => (fnr(value).status === 'valid')}}
                />

                {/* 3.3 */}
                <Datovelger
                    name={"doedsdato"}
                    label={t("felles.doedsdato")}
                    maxDate={new Date()}
                />

                {/* 3.4 */}
                <RHFInput
                    name={"statsborgerskap"}
                    label={t("felles.statsborgerskap")}
                />

                {/* 3.5 fjernes. Ikke lenger gyldig. */}
                {/* 3.6 */}
                <RHFToValgRadio
                    name={"bosetning"}
                    legend={t("omDenAvdoede.bosattSammenhengende")}
                />

                {/* 3.7 */}
                <RHFToValgRadio
                    name={"doedsfallAarsak"}
                    legend={t("omDenAvdoede.doedsfallPgaYrkesskade")}
                />

                {/* 3.8 */}
                <RHFToValgRadio
                    name={"boddEllerJobbetUtland"}
                    legend={t("omDenAvdoede.boddEllerJobbetUtland")}
                />
                {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}

                {/* 3.10 */}
                <RHFToValgRadio
                    name={"haddePensjonsgivendeInntekt"}
                    legend={t("omDenAvdoede.haddePensjonsgivendeInntekt")}
                />

                {haddePensjonsgivendeInntekt === IValg.JA && (
                    <RHFInput
                        name={"pensjonsgivendeInntektSvar"}
                        label={t("omDenAvdoede.pensjonsgivendeInntekt")}
                    />
                )}
                {/* 3.11 Samme som over ?! */}

                {/* 3.12 */}
                <RHFToValgRadio
                    name={"haddePensjonAndreLand"}
                    legend={t("omDenAvdoede.mottokPensjonAndreLand")}
                />

                {haddePensjonAndreLand === IValg.JA && (
                    <RHFInput
                        name={"pensjonAndreLandSvar"}
                        label={t("omDenAvdoede.pensjonUtlandBruttoinntekt")}
                        rules={{pattern: /^\d+$/}}
                    />
                )}

                {/* 3.13 */}
                <RHFToValgRadio
                    name={"harAvtjentMilitaerTjeneste"}
                    legend={t("omDenAvdoede.harAvtjentMilitaerTjeneste")}
                />

                {harAvtjentMilitaerTjeneste === IValg.JA && (
                    <RHFInput
                        name={"avtjentMilitaerTjenesteSvar"}
                        label={t("omDenAvdoede.avtjentMilitaerTjenesteAarstall")}
                        rules={{pattern: /^\d{4}$/}}
                    />
                )}

                <Feilmeldinger errors={errors} />

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>
                    <Hovedknapp htmlType={"submit"}>{t("knapp.neste")}</Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default OmDenAvdode;
