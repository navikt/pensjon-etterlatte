import { SkjemaGruppe } from "nav-frontend-skjema";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { RHFFoedselsnummerInput, RHFInput, RHFValutaInput } from "../../felles/RHFInput";
import { RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import BoddEllerArbeidetUtland from "./fragmenter/BoddEllerArbeidetUtland";
import Navigasjon from "../../felles/Navigasjon";
import useEffectOnce from "../../../hooks/useEffectOnce";
import { isEmpty } from "lodash";
import { BodyLong, Label, Heading } from "@navikt/ds-react";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";
import SkjemaGruppering from "../../felles/SkjemaGruppering";

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IAvdoed>({
        defaultValues: state.omDenAvdoede || {},
        shouldUnregister: true,
    });

    useEffectOnce(() => {
        methods.reset(state.omDenAvdoede);
    }, !isEmpty(state.omDenAvdoede));

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const lagre = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: data });
        neste!!();
    };

    const selvstendigNaeringsdrivende = watch("selvstendigNaeringsdrivende.svar");
    const harAvtjentMilitaerTjeneste = watch("harAvtjentMilitaerTjeneste.svar");

    return (
        <FormProvider {...methods}>
            <SkjemaGruppe className={"center"}>
                <Heading size={"medium"}>{t("omDenAvdoede.tittel")}</Heading>
            </SkjemaGruppe>

            <form>
                <SkjemaGruppering>
                    <SkjemaGruppe className={"rad"}>
                        <div className={"kolonne"}>
                            <Label>{t("omDenAvdoede.fornavn")}</Label>
                            <BodyLong>{state.omDegOgAvdoed.avdoed?.fornavn || ""}</BodyLong>
                        </div>
                        <div className={"kolonne"}>
                            <Label>{t("omDenAvdoede.etternavn")}</Label>
                            <BodyLong>{state.omDegOgAvdoed.avdoed?.etternavn || ""}</BodyLong>
                        </div>
                    </SkjemaGruppe>

                    <SkjemaGruppe className={"rad"}>
                        <RHFFoedselsnummerInput
                            className={"kol-50"}
                            name={"foedselsnummer"}
                            label={t("omDenAvdoede.foedselsnummer")}
                            placeholder={t("felles.fnrPlaceholder")}
                        />

                        <RHFInput
                            className={"kol-50"}
                            name={"statsborgerskap"}
                            label={t("omDenAvdoede.statsborgerskap")}
                            placeholder={t("omDenAvdoede.statsborgerskapPlaceholder")}
                        />
                    </SkjemaGruppe>
                </SkjemaGruppering>

                <BoddEllerArbeidetUtland datoForDoedsfallet={state.omDegOgAvdoed.avdoed?.datoForDoedsfallet}/>

                <SkjemaGruppering>
                    <SkjemaGruppe className="ingress">
                        <Heading size="small">{t("omDenAvdoede.selvstendigNaeringsdrivende.tittel")}</Heading>
                        <BodyLong>{t("omDenAvdoede.selvstendigNaeringsdrivende.ingress")}</BodyLong>
                    </SkjemaGruppe>

                    <RHFSpoersmaalRadio
                        name={"selvstendigNaeringsdrivende.svar"}
                        legend={t("omDenAvdoede.selvstendigNaeringsdrivende.svar")}
                        vetIkke
                    />

                    {/* TODO: Rename? */}
                    {selvstendigNaeringsdrivende === IValg.JA && (
                        <>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={"selvstendigNaeringsdrivende.beskrivelse"}
                                    bredde={"L"}
                                    valgfri
                                    type="tel"
                                    placeholder={t("omDenAvdoede.selvstendigNaeringsdrivende.placeholder")}
                                    label={t("omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse")}
                                />
                            </SkjemaGruppe>

                            <RHFSpoersmaalRadio
                                name={"haddePensjonsgivendeInntekt.svar"}
                                legend={t("omDenAvdoede.haddePensjonsgivendeInntekt.svar")}
                                vetIkke
                            />
                        </>
                    )}
                </SkjemaGruppering>

                <SkjemaGruppering>
                    <SkjemaGruppe className="ingress">
                        <Heading size="small">{t("omDenAvdoede.annenOpptjening.tittel")}</Heading>
                    </SkjemaGruppe>

                    <RHFSpoersmaalRadio
                        name={"harAvtjentMilitaerTjeneste.svar"}
                        legend={t("omDenAvdoede.harAvtjentMilitaerTjeneste.svar")}
                        description={
                            <HvorforSpoerVi>{t("omDenAvdoede.harAvtjentMilitaerTjeneste.hjelpetekst")}</HvorforSpoerVi>
                        }
                        vetIkke
                    />

                    {harAvtjentMilitaerTjeneste === IValg.JA && (
                        <SkjemaGruppe>
                            <RHFInput
                                name={"harAvtjentMilitaerTjeneste.beskrivelse"}
                                bredde={"S"}
                                valgfri
                                label={t("omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse")}
                            />
                        </SkjemaGruppe>
                    )}
                </SkjemaGruppering>

                <Feilmeldinger errors={errors}/>

                <Navigasjon forrige={{ onClick: forrige }} neste={{ onClick: handleSubmit(lagre) }}/>
            </form>
        </FormProvider>
    );
};

export default OmDenAvdode;
