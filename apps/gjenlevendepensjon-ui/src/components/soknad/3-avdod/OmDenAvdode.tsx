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
import { BodyLong, Label, Heading, Cell, Grid } from "@navikt/ds-react";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";
import SkjemaGruppering from "../../felles/SkjemaGruppering";
import { deepCopy } from "../../../utils/deepCopy";
import { RHFSelect } from "../../felles/RHFSelect";
import { useLand } from "../../../hooks/useLand";

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const { land } : { land: any } = useLand();
    const methods = useForm<IAvdoed>({
        defaultValues: { ...state.omDenAvdoede, statsborgerskap: state.omDenAvdoede.statsborgerskap } || {},
        shouldUnregister: true,
    });

    const {
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = methods;

    const lagreNeste = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: {...deepCopy(data), erValidert: true} });
        neste!!();
    };

    const lagreTilbake = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: {...deepCopy(data), erValidert: true} })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: {...deepCopy(verdier), erValidert: false} })
        forrige!!()
    }

    const erValidert = state.omDenAvdoede.erValidert;
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

                    <SkjemaGruppe>
                        <Grid style={{alignItems: "end" }}>
                            <Cell xs={12} md={6} className={"kol"}>
                                <RHFFoedselsnummerInput
                                    name={"foedselsnummer"}
                                    label={t("omDenAvdoede.foedselsnummer")}
                                    placeholder={t("felles.fnrPlaceholder")}
                                />
                            </Cell>

                            <Cell xs={12} md={6} className={"kol"}>
                                <RHFSelect
                                    name={`statsborgerskap`}
                                    label={t("omDenAvdoede.statsborgerskap")}
                                    selectOptions={land}
                                />
                            </Cell>
                        </Grid>
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

                    <SkjemaGruppe>
                        <RHFSpoersmaalRadio
                            name={"doedsfallAarsak"}
                            legend={t("omDenAvdoede.doedsfallAarsak")}
                            description={
                                <HvorforSpoerVi title="omDenAvdoede.doedsfallAarsak">{t("omDenAvdoede.doedsfallAarsakHvorfor")}</HvorforSpoerVi>}
                            vetIkke
                        />
                    </SkjemaGruppe>

                    <RHFSpoersmaalRadio
                        name={"harAvtjentMilitaerTjeneste.svar"}
                        legend={t("omDenAvdoede.harAvtjentMilitaerTjeneste.svar")}
                        description={
                            <HvorforSpoerVi title="omDenAvdoede.harAvtjentMilitaerTjeneste.svar">{t("omDenAvdoede.harAvtjentMilitaerTjeneste.hjelpetekst")}</HvorforSpoerVi>
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

                <Navigasjon
                    forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                    neste={{ onClick: handleSubmit(lagreNeste) }}
                />

            </form>
        </FormProvider>
    );
};

export default OmDenAvdode;
