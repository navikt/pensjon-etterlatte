import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { AvdoedInntekt, IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { RHFFoedselsnummerInput, RHFInput, RHFValutaInput } from "../../felles/RHFInput";
import { RHFRadio, RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import BoddEllerArbeidetUtland from "./fragmenter/BoddEllerArbeidetUtland";
import Navigasjon from "../../felles/Navigasjon";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";
import { useEffectOnce } from "../../../utils/extensions";
import _ from "lodash";

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IAvdoed>({
        defaultValues: state.omDenAvdoede || {},
        shouldUnregister: true
    });

    useEffectOnce(() => {
        methods.reset(state.omDenAvdoede)
    }, (!_.isEmpty(state.omDenAvdoede)));

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const lagre = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: data });
        neste!!();
    };

    const selvstendigNaeringsdrivende = watch("selvstendigNaeringsdrivende.svar")
    const harAvtjentMilitaerTjeneste = watch("harAvtjentMilitaerTjeneste.svar")

    return (
        <FormProvider {...methods}>
            <SkjemaGruppe className={"center"}>
                <Systemtittel>
                    {t("omDenAvdoede.tittel")}
                </Systemtittel>
            </SkjemaGruppe>

            <form>
                <div className={"rad skjemagruppe"}>
                    <div className={"kolonne"}>
                        <Element>
                            {t("omDenAvdoede.fornavn")}
                        </Element>
                        <Normaltekst>
                            {state.omDegOgAvdoed.avdoed?.fornavn}
                        </Normaltekst>
                    </div>
                    <div className={"kolonne"}>
                        <Element>
                            {t("omDenAvdoede.etternavn")}
                        </Element>
                        <Normaltekst>
                            {state.omDegOgAvdoed.avdoed?.etternavn}
                        </Normaltekst>
                    </div>
                </div>

                <div className={"rad skjemagruppe"}>
                    <RHFFoedselsnummerInput
                        className={"kol-50"}
                        type={"number"}
                        name={"foedselsnummer"}
                        label={t("omDenAvdoede.foedselsnummer")}
                    />

                    <RHFInput
                        className={"kol-50"}
                        name={"statsborgerskap"}
                        label={t("omDenAvdoede.statsborgerskap")}
                    />
                </div>

                <BoddEllerArbeidetUtland />

                <RHFSpoersmaalRadio
                    name={"selvstendigNaeringsdrivende.svar"}
                    legend={t("omDenAvdoede.selvstendigNaeringsdrivende.svar")}
                    description={
                        <HvorforSpoerVi>{t("omDenAvdoede.selvstendigNaeringsdrivende.hjelpetekst")}</HvorforSpoerVi>
                    }
                    vetIkke
                />

                {/* TODO: Rename? */}
                {selvstendigNaeringsdrivende === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFValutaInput
                            name={"selvstendigNaeringsdrivende.beskrivelse"}
                            bredde={"S"}
                            label={t("omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse")}
                        />
                    </SkjemaGruppe>
                )}

                <RHFRadio
                    name={"haddePensjonsgivendeInntekt.svar"}
                    legend={t("omDenAvdoede.haddePensjonsgivendeInntekt.svar")}
                    description={"TODO: Litt informasjon rundt hva vi mener med \"selvstendig næringsdrivende\", \"arbeidstaker\", osv."}
                    radios={Object.values(AvdoedInntekt).map(value => {
                        return { label: t(value), value } as RadioProps
                    })}
                />

                <RHFSpoersmaalRadio
                    name={"harAvtjentMilitaerTjeneste.svar"}
                    legend={t("omDenAvdoede.harAvtjentMilitaerTjeneste.svar")}
                    vetIkke
                />

                {harAvtjentMilitaerTjeneste === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"harAvtjentMilitaerTjeneste.beskrivelse"}
                            bredde={"S"}
                            label={t("omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse")}
                        />
                    </SkjemaGruppe>
                )}

                <Feilmeldinger errors={errors}/>

                <Navigasjon
                    forrige={{ onClick: forrige }}
                    neste={{ onClick: handleSubmit(lagre) }}
                />
            </form>
        </FormProvider>
    );
};

export default OmDenAvdode;
