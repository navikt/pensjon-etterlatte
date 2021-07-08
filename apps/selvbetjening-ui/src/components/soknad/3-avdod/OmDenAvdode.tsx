import { SkjemaGruppe } from "nav-frontend-skjema";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { RHFFoedselsnummerInput, RHFInput } from "../../felles/RHFInput";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import BoddEllerArbeidetUtland from "./fragmenter/BoddEllerArbeidetUtland";
import Navigasjon from "../../felles/Navigasjon";
import React from "react";

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

    const selvstendigNaeringsdrivende = watch("selvstendigNaeringsdrivende.svar")
    const mottokPensjonAndreLand = watch("mottokPensjonAndreLand.svar")
    const harAvtjentMilitaerTjeneste = watch("harAvtjentMilitaerTjeneste.svar")

    return (
        <FormProvider {...methods}>
            <SkjemaGruppe className={"center"}>
                <Systemtittel>
                    Om avdøde
                </Systemtittel>
            </SkjemaGruppe>

            <form>
                <div className={"rad skjemagruppe"}>
                    <div className={"kolonne"}>
                        <Element>
                            Fornavn
                        </Element>
                        <Normaltekst>
                            {state.omDegOgAvdoed.avdoed?.fornavn}
                        </Normaltekst>
                    </div>
                    <div className={"kolonne"}>
                        <Element>
                            Etternavn
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

                <RHFToValgRadio
                    name={"medlemFolketrygdUtland"}
                    legend={"Var han/hun medlem av folketrygden under oppholdet i et annet land?"}
                    vetIkke
                />

                <RHFToValgRadio
                    name={"mottokPensjonAndreLand.svar"}
                    legend={"Fikk han/hun pensjon fra andre land enn Norge?"}
                    vetIkke
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

                <RHFToValgRadio
                    name={"selvstendigNaeringsdrivende.svar"}
                    legend={"Var han/hun selvstendig næringsdrivende året før dødsfallet?"}
                    vetIkke
                />

                {selvstendigNaeringsdrivende === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"haddePensjonsgivendeInntekt.beskrivelse"}
                            label={"Oppgi næringsinntekt fra kalenderåret før dødsfallet"}
                        />
                    </SkjemaGruppe>
                )}

                <RHFRadio
                    name={"haddePensjonsgivendeInntekt.svar"}
                    legend={"Hadde han/hun inntekt når dødsfallet skjedde?"}
                    description={"TODO: Litt informasjon rundt hva vi mener med \"selvstendig næringsdrivende\", \"arbeidstaker\", osv."}
                    radios={[
                        { label: "Ja, inntekt som selvstendig næringsdrivende", value: "Ja, inntekt som selvstendig næringsdrivende" },
                        { label: "Ja, inntekt som arbeidstaker", value: "Ja, inntekt som arbeidstaker" },
                        { label: "Ja, begge deler", value: "Ja, begge deler" },
                        { label: "Nei, ingen inntekt", value: "Nei, ingen inntekt" }
                    ]}
                />

                <RHFToValgRadio
                    name={"harAvtjentMilitaerTjeneste.svar"}
                    legend={"Gjennomførte han/hun militær eller sivil førstegangstjeneste som varte minst 30 dager?"}
                    vetIkke
                />

                {harAvtjentMilitaerTjeneste === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"harAvtjentMilitaerTjeneste.beskrivelse"}
                            label={"Hvilke(t) år?"}
                        />
                    </SkjemaGruppe>
                )}

                <Feilmeldinger errors={errors}/>

                <Navigasjon
                    forrige={forrige}
                    neste={handleSubmit(lagre)}
                />
            </form>
        </FormProvider>
    );
};

export default OmDenAvdode;
