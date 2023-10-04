import { SkjemaGruppe } from "../../felles/SkjemaGruppe";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { RHFFoedselsnummerInput, RHFInput, RHFValutaInput } from "../../felles/rhf/RHFInput";
import { RHFSpoersmaalRadio } from "../../felles/rhf/RHFRadio";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import BoddEllerArbeidetUtland from "./fragmenter/BoddEllerArbeidetUtland";
import Navigasjon from "../../felles/Navigasjon";
import { BodyLong, Label, Heading, Cell, Grid } from "@navikt/ds-react";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";
import { deepCopy } from "../../../utils/deepCopy";
import { RHFSelect } from "../../felles/rhf/RHFSelect";
import { useLand } from "../../../hooks/useLand";
import {SkjemaGruppeIngress, SkjemaGruppeRad} from "../../felles/StyledComponents";
import {SkjemaElement} from "../../felles/SkjemaElement";
import Bredde from "../../../typer/bredde";

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const { land } : { land: any } = useLand();
    const methods = useForm<IAvdoed>({
        defaultValues: { ...state.omDenAvdoede, statsborgerskap: state.omDenAvdoede.statsborgerskap },
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
            <SkjemaElement>
                <Heading className={"center"} size={"medium"}>{t("omDenAvdoede.tittel")}</Heading>
            </SkjemaElement>

            <form>
                <SkjemaGruppe>
                    <SkjemaGruppeRad>
                        <div className={"kol"}>
                            <Label>{t("omDenAvdoede.fornavn")}</Label>
                            <BodyLong>{state.omDegOgAvdoed.avdoed?.fornavn || ""}</BodyLong>
                        </div>
                        <div className={"kol"}>
                            <Label>{t("omDenAvdoede.etternavn")}</Label>
                            <BodyLong>{state.omDegOgAvdoed.avdoed?.etternavn || ""}</BodyLong>
                        </div>
                    </SkjemaGruppeRad>

                    <SkjemaElement>
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
                    </SkjemaElement>
                </SkjemaGruppe>

                <BoddEllerArbeidetUtland datoForDoedsfallet={state.omDegOgAvdoed.avdoed?.datoForDoedsfallet}/>

                <SkjemaGruppe>
                    <SkjemaGruppeIngress>
                        <Heading size="small">{t("omDenAvdoede.selvstendigNaeringsdrivende.tittel")}</Heading>
                        <BodyLong>{t("omDenAvdoede.selvstendigNaeringsdrivende.ingress")}</BodyLong>
                    </SkjemaGruppeIngress>

                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={"selvstendigNaeringsdrivende.svar"}
                            legend={t("omDenAvdoede.selvstendigNaeringsdrivende.svar")}
                            vetIkke
                        />
                    </SkjemaElement>

                    {selvstendigNaeringsdrivende === IValg.JA && (
                        <>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={"selvstendigNaeringsdrivende.beskrivelse"}
                                    htmlSize={Bredde.S}
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
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <SkjemaGruppeIngress>
                        <Heading size="small">{t("omDenAvdoede.annenOpptjening.tittel")}</Heading>
                    </SkjemaGruppeIngress>

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
                            <SkjemaElement>
                                <RHFInput
                                    name={"harAvtjentMilitaerTjeneste.beskrivelse"}
                                    htmlSize={Bredde.S}
                                    valgfri
                                    label={t("omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse")}
                                />
                            </SkjemaElement>
                        )}

                </SkjemaGruppe>

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
