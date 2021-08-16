import "./OmDeg.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { Trans, useTranslation } from "react-i18next";
import InnloggetBruker from "./InnloggetBruker";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { IValg } from "../../../typer/Spoersmaal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoeker } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from "../../felles/RHFInput";
import { RHFInlineRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import Navigasjon from "../../felles/Navigasjon";
import { emailMatcher } from "../../../utils/matchers";
import { Cell, Grid } from "@navikt/ds-react";
import React from "react";
import { BankkontoType } from "../../../typer/utbetaling";
import UtenlandskBankInfo from "./utenlandskBankInfo/UtenlandskBankInfo";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";

const OmDeg: SoknadSteg = ({ neste }) => {
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
    const bankkontoType = watch("utbetalingsInformasjon.bankkontoType")

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel className={"center"}>
                <Trans i18nKey={"omDeg.tittel"}/>
            </Systemtittel>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker/>

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form>
                    <RHFToValgRadio
                        name={"bostedsadresseBekreftet"}
                        legend={<Trans i18nKey={"omDeg.bostedsadresseBekreftet"}/>}
                    />

                    {borPaaRegistrertAdresse === IValg.NEI && (
                        <SkjemaGruppe>
                            <RHFInput
                                name={"alternativAdresse"}
                                label={<Trans i18nKey={"omDeg.alternativAdresse"}/>}
                            />
                        </SkjemaGruppe>
                    )}

                    <SkjemaGruppe>
                        <Grid>
                            <Cell xs={12} md={6} className={"kol"}>
                                <RHFTelefonInput
                                    name={"kontaktinfo.telefonnummer"}
                                    label={t("omDeg.kontaktinfo.telefonnummer")}
                                    // TODO: Validere telefon ... ?
                                />
                            </Cell>

                            <Cell xs={12} md={6} className={"kol"}>
                                <RHFInput
                                    name={"kontaktinfo.epost"}
                                    label={t("omDeg.kontaktinfo.epost")}
                                    rules={{ pattern: emailMatcher }}
                                />
                            </Cell>
                        </Grid>
                    </SkjemaGruppe>

                    {/* 2.7 */}
                    <RHFToValgRadio
                        name={"oppholderSegINorge"}
                        legend={t("omDeg.oppholderSegINorge")}
                        description={<HvorforSpoerVi>{t("omDeg.oppholdHvorfor")}</HvorforSpoerVi>}
                    />

                    {oppholderSegINorge === IValg.JA && (
                        <SkjemaGruppe>
                            <RHFKontonummerInput
                                name={"utbetalingsInformasjon.kontonummer"}
                                label={t("omDeg.utbetalingsInformasjon.kontonummer")}
                                placeholder={"11 siffer"}
                            />
                        </SkjemaGruppe>
                    )}

                    {oppholderSegINorge === IValg.NEI && (
                        <>
                            <SkjemaGruppe>
                                <RHFInput
                                    name={"oppholdsland"}
                                    label={t("omDeg.oppgiLand")}
                                    rules={{ pattern: /^[\w|\s]+$/ }}
                                />
                            </SkjemaGruppe>

                            <RHFToValgRadio
                                name={"medlemFolketrygdenUtland"}
                                legend={t("omDeg.medlemFolketrygdenUtland")}
                            />

                            <RHFInlineRadio
                                name={"utbetalingsInformasjon.bankkontoType"}
                                legend={t("omDeg.utbetalingsInformasjon.bankkontoType")}
                                radios={Object.values(BankkontoType).map(value => {
                                    return { label: t(value), value } as RadioProps
                                })}
                            />

                            {bankkontoType === BankkontoType.norsk && (
                                <SkjemaGruppe>
                                    <RHFKontonummerInput
                                        name={"utbetalingsInformasjon.kontonummer"}
                                        label={t("omDeg.utbetalingsInformasjon.kontonummer")}
                                        placeholder={"11 siffer"}
                                    />
                                </SkjemaGruppe>
                            )}

                            {bankkontoType === BankkontoType.utenlandsk && (
                                <UtenlandskBankInfo/>
                            )}
                        </>
                    )}

                    {skalSjekkeFlyktningStatus && (
                        <SkjemaGruppe>
                            <RHFToValgRadio
                                name={"flyktning"}
                                legend={<Trans i18nKey={"omDeg.flyktning"}/>}
                                description={<HvorforSpoerVi>{t("omDeg.flyktningHvorfor")}</HvorforSpoerVi>}
                            />
                        </SkjemaGruppe>
                    )}

                    <br/>

                    <Feilmeldinger errors={errors}/>

                    <Navigasjon neste={{ onClick: handleSubmit(lagre) }}/>
                </form>
            </FormProvider>
        </>
    );
};

export default OmDeg;
