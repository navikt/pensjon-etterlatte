import "../../../App.less";
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
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import AlertStripe from "nav-frontend-alertstriper";
import { RHFRadio } from "../../felles/RHFRadio";
import { IValg } from "../../../typer/Spoersmaal";
import NySivilstatus from "./forholdTilAvdoede/nySivilstatus/NySivilstatus";

const OmDegOgAvdoed: SoknadSteg = ({ neste, forrige }) => {
    const { t, i18n } = useTranslation();
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
            <Systemtittel className={"center"}>
                Om deg og avdøde
            </Systemtittel>

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                <form>
                    <Element>Hvem er det som er død?</Element>
                    <div className={"rad skjemagruppe"}>
                        <div className={"kol-50"}>
                            <RHFInput
                                name={"avdoed.fornavn"}
                                label={"Fornavn"}
                                // TODO: Validere telefon ... ?
                            />
                        </div>

                        <div className={"kol-50"}>
                            {/* 2.5 */}
                            <RHFInput
                                name={"avdoed.etternavn"}
                                label={"Etternavn"}
                                // TODO: Validere e-post
                            />
                        </div>
                    </div>

                    <SkjemaGruppe>
                        <Element>Når skjedde dødsfallet</Element>

                        <Datovelger
                            name={"avdoed.datoForDoedsfallet"}
                            label={"Dato"}
                        />

                        {foersteFraDato && (
                            <AlertStripe
                                type={"info"}
                                form={"inline"}
                            >
                                Du kan ha rett på gjenlevendepensjon fra {foersteFraDato}
                            </AlertStripe>
                        )}
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <RHFRadio
                            name={"avdoed.doedsfallAarsak"}
                            legend={"Skyldes dødsfallet yrkesskade/yrkessykdom?"}
                            radios={[
                                { label: IValg.JA, value: IValg.JA },
                                { label: IValg.NEI, value: IValg.NEI },
                                { label: IValg.VET_IKKE, value: IValg.VET_IKKE }
                            ]}
                        />
                    </SkjemaGruppe>

                    {/* 2.9 */}
                    <ForholdTilAvdoedeSkjema />

                    <NySivilstatus />

                    <br />

                    <Feilmeldinger errors={errors} />

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
        </>
    );
};

export default OmDegOgAvdoed;
