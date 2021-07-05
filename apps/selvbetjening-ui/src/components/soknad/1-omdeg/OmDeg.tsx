import "./OmDeg.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import InnloggetBruker from "./InnloggetBruker";
import { Hovedknapp } from "nav-frontend-knapper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { IValg } from "../../../typer/Spoersmaal";
import AlertStripe from "nav-frontend-alertstriper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoeker } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import React from "react";

const OmDeg: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const brukerState = useBrukerContext().state;

    const lagre = (data: ISoeker) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG, payload: data })
        neste!!()
    };

    const methods = useForm<ISoeker>({
        defaultValues: state.omDeg || {},
        shouldUnregister: true
    });

    const {
        handleSubmit,
        watch,
        formState: { errors }
    } = methods;

    const skalSjekkeFlyktningStatus = brukerState.foedselsaar!! < 1960;

    const borPaaRegistrertAdresse = watch("bostedsadresseBekreftet")
    const oppholderSegINorge = watch("oppholderSegINorge")

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel className={"center"}>
                {t("omSoekeren.tittel")}
            </Systemtittel>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form>
                    <RHFToValgRadio
                        name={"bostedsadresseBekreftet"}
                        legend={t("omSoekeren.borPaaAdresse")}
                    />

                    {borPaaRegistrertAdresse === IValg.NEI && (
                        <SkjemaGruppe>
                            <AlertStripe type="advarsel">{t("omSoekeren.infoFolkeregisteret")}</AlertStripe>
                        </SkjemaGruppe>
                    )}

                    <div className={"rad skjemagruppe"}>
                        <div className={"kol-50"}>
                            <RHFTelefonInput
                                name={"kontaktinfo.telefonnummer"}
                                label={t("omSoekeren.kontaktinfo.telefon")}
                                // TODO: Validere telefon ... ?
                            />
                        </div>

                        <div className={"kol-50"}>
                            {/* 2.5 */}
                            <RHFInput
                                name={"kontaktinfo.epost"}
                                label={t("omSoekeren.kontaktinfo.epost")}
                                // TODO: Validere e-post
                            />
                        </div>
                    </div>

                    {/* 2.7 */}
                    <RHFToValgRadio
                        name={"oppholderSegINorge"}
                        legend={t("omSoekeren.oppholderSegINorge")}
                    />

                    {oppholderSegINorge === IValg.JA && (
                        <SkjemaGruppe>
                            <RHFKontonummerInput
                                name={"kontonummer"}
                                label={t("Oppgi norsk kontonummer for utbetaling")}
                                rules={{pattern: /^\d{4}\.\d{2}\.\d{5}$/}}
                                placeholder={"11 siffer"}
                            />
                        </SkjemaGruppe>
                    )}

                    {oppholderSegINorge === IValg.NEI && (
                        <>
                            <SkjemaGruppe>
                                <RHFInput
                                    name={"oppholdsland"}
                                    label={t("omSoekeren.oppgiLand")}
                                    rules={{pattern: /^[\w|\s]+$/}}
                                />
                            </SkjemaGruppe>

                            <RHFToValgRadio
                                name={"medlemFolketrygdenUtland"}
                                legend={t("omSoekeren.medlemFolketrygdenUtland")}
                            />
                        </>
                    )}


                    {skalSjekkeFlyktningStatus && (
                        <SkjemaGruppe>
                            <RHFToValgRadio
                                name={"flyktning"}
                                legend={<>Har du status som flyktning? <i>(gjelder alle født før 1960)</i></>}
                            />
                        </SkjemaGruppe>
                    )}

                    <br />

                    <Feilmeldinger errors={errors} />

                    <SkjemaGruppe className={"navigasjon-rad"}>
                        <Hovedknapp htmlType={"button"} onClick={handleSubmit(lagre)}>
                            {t("knapp.neste")}
                        </Hovedknapp>
                    </SkjemaGruppe>
                </form>
            </FormProvider>
        </>
    );
};

export default OmDeg;
