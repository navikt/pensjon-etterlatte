import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { RHFFoedselsnummerInput, RHFInput } from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IAvdoed>({
        defaultValues: state.omDenAvdoede || {},
        shouldUnregister: true
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

    const haddePensjonsgivendeInntekt = watch("haddePensjonsgivendeInntekt.svar")
    const mottokPensjonAndreLand = watch("mottokPensjonAndreLand.svar")
    const harAvtjentMilitaerTjeneste = watch("harAvtjentMilitaerTjeneste.svar")

    return (
        <FormProvider {...methods}>
            {/* Steg 3 */}
            <SkjemaGruppe>
                <Systemtittel className={"center"}>{t("omDenAvdoede.tittel")}</Systemtittel>
            </SkjemaGruppe>

            <form>
                {/* 3.1 */}
                <div className={"rad skjemagruppe"}>
                    <RHFInput
                        className={"kol-50"}
                        name={"fornavn"}
                        label={t("omDenAvdoede.fornavn")}
                    />

                    <RHFInput
                        className={"kol-50"}
                        name={"etternavn"}
                        label={t("omDenAvdoede.etternavn")}
                    />
                </div>

                <div className={"rad skjemagruppe"}>
                    {/* 3.2 */}
                    <RHFFoedselsnummerInput
                        className={"kol-50"}
                        type={"number"}
                        name={"foedselsnummer"}
                        label={t("omDenAvdoede.foedselsnummer")}
                    />

                    {/* 3.4 */}
                    <RHFInput
                        className={"kol-50"}
                        name={"statsborgerskap"}
                        label={t("omDenAvdoede.statsborgerskap")}
                    />
                </div>

                {/* 3.5 fjernes. Ikke lenger gyldig. */}
                {/* 3.6 */}
                <RHFToValgRadio
                    name={"bosetning"}
                    legend={t("omDenAvdoede.bosetning")}
                />

                {/* 3.7 */}
                <RHFToValgRadio
                    name={"doedsfallAarsak"}
                    legend={t("omDenAvdoede.doedsfallAarsak")}
                />

                {/* 3.8 */}
                <RHFToValgRadio
                    name={"boddEllerJobbetUtland"}
                    legend={t("omDenAvdoede.boddEllerJobbetUtland")}
                />
                {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}

                {/* 3.10 */}
                <RHFToValgRadio
                    name={"haddePensjonsgivendeInntekt.svar"}
                    legend={t("omDenAvdoede.haddePensjonsgivendeInntekt.svar")}
                />

                {haddePensjonsgivendeInntekt === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"haddePensjonsgivendeInntekt.beskrivelse"}
                            label={t("omDenAvdoede.haddePensjonsgivendeInntekt.beskrivelse")}
                        />
                    </SkjemaGruppe>
                )}
                {/* 3.11 Samme som over ?! */}

                {/* 3.12 */}
                <RHFToValgRadio
                    name={"mottokPensjonAndreLand.svar"}
                    legend={t("omDenAvdoede.mottokPensjonAndreLand.svar")}
                />

                {mottokPensjonAndreLand === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"mottokPensjonAndreLand.beskrivelse"}
                            label={t("omDenAvdoede.mottokPensjonAndreLand.beskrivelse")}
                            rules={{ pattern: /^\d+$/ }}
                        />
                    </SkjemaGruppe>
                )}

                {/* 3.13 */}
                <RHFToValgRadio
                    name={"harAvtjentMilitaerTjeneste.svar"}
                    legend={t("omDenAvdoede.harAvtjentMilitaerTjeneste.svar")}
                />

                {harAvtjentMilitaerTjeneste === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"harAvtjentMilitaerTjeneste.beskrivelse"}
                            label={t("omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse")}
                            rules={{ pattern: /^\d{4}$/ }}
                        />
                    </SkjemaGruppe>
                )}

                <Feilmeldinger errors={errors}/>

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Knapp htmlType={"button"} onClick={forrige}>
                        {t("knapp.tilbake")}
                    </Knapp>

                    <Hovedknapp htmlType={"button"} onClick={handleSubmit(lagre)}>
                        {t("knapp.neste")}
                    </Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default OmDenAvdode;
