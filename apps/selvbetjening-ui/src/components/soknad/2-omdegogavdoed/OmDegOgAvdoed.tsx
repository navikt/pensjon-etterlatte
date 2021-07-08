import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoekerOgAvdoed } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { FormProvider, useForm } from "react-hook-form";
import { Element, Systemtittel } from "nav-frontend-typografi";
import { RHFInput } from "../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import ForholdTilAvdoedeSkjema from "./forholdTilAvdoede/ForholdTilAvdoedeSkjema";
import Feilmeldinger from "../../felles/Feilmeldinger";
import Datovelger from "../../felles/Datovelger";
import AlertStripe from "nav-frontend-alertstriper";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import NySivilstatus from "./forholdTilAvdoede/nySivilstatus/NySivilstatus";
import Navigasjon from "../../felles/Navigasjon";
import React from "react";

const OmDegOgAvdoed: SoknadSteg = ({ neste, forrige }) => {
    const { i18n } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const lagre = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: data })
        neste!!()
    };

    const methods = useForm<ISoekerOgAvdoed>({
        defaultValues: state.omDegOgAvdoed || {},
        shouldUnregister: true
    });

    const {
        handleSubmit,
        watch,
        formState: { errors }
    } = methods;

    const dtf = Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "long", year: "numeric" });

    const datoForDoedsfallet = watch("avdoed.datoForDoedsfallet") || undefined;

    let foersteFraDato;
    if (!!datoForDoedsfallet) {
        const dato = new Date(datoForDoedsfallet)
        foersteFraDato = dtf.format(new Date(dato.getFullYear(), dato.getMonth() + 1, 1))
    }

    return (
        <>
            {/* Steg 2 */}
            <SkjemaGruppe>
                <Systemtittel className={"center"}>
                    Om deg og avdøde
                </Systemtittel>
            </SkjemaGruppe>

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                <form>
                    <Element>Hvem er det som er død?</Element>
                    <SkjemaGruppe className={"inline"}>
                        <RHFInput
                            name={"avdoed.fornavn"}
                            label={"Fornavn"}
                            // TODO: Validere telefon ... ?
                        />

                        <RHFInput
                            name={"avdoed.etternavn"}
                            label={"Etternavn"}
                            // TODO: Validere e-post
                        />
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <Element>Når skjedde dødsfallet</Element>

                        <Datovelger
                            name={"avdoed.datoForDoedsfallet"}
                            label={"Dato"}
                        />

                        {foersteFraDato && (
                            <AlertStripe type={"info"} form={"inline"}>
                                Du kan ha rett på gjenlevendepensjon fra {foersteFraDato}
                            </AlertStripe>
                        )}
                    </SkjemaGruppe>

                    <RHFToValgRadio
                        name={"avdoed.doedsfallAarsak"}
                        legend={"Skyldes dødsfallet yrkesskade/yrkessykdom?"}
                        vetIkke
                    />

                    {/* 2.9 */}
                    <ForholdTilAvdoedeSkjema />

                    <NySivilstatus />

                    <br />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon
                        forrige={forrige}
                        neste={handleSubmit(lagre)}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default OmDegOgAvdoed;
