import "./OmDeg.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { Trans, useTranslation } from "react-i18next";
import InnloggetBruker from "./InnloggetBruker";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { IValg } from "../../../typer/Spoersmaal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoeker } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import Navigasjon from "../../felles/Navigasjon";
import { emailMatcher } from "../../../utils/matchers";
import { Cell, Grid } from "@navikt/ds-react";

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

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel className={"center"}>
                <Trans i18nKey={"omDeg.tittel"} />
            </Systemtittel>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form>
                    <RHFToValgRadio
                        name={"bostedsadresseBekreftet"}
                        legend={<Trans i18nKey={"omDeg.bostedsadresseBekreftet"} />}
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
                        hjelpetekst={t("omDeg.oppholdHvorfor")}
                    />

                    {oppholderSegINorge === IValg.JA && (
                        <SkjemaGruppe>
                            <RHFKontonummerInput
                                name={"kontonummer"}
                                label={t("omDeg.kontonummer")}
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
                                    rules={{pattern: /^[\w|\s]+$/}}
                                />
                            </SkjemaGruppe>

                            <RHFToValgRadio
                                name={"medlemFolketrygdenUtland"}
                                legend={t("omDeg.medlemFolketrygdenUtland")}
                            />
                        </>
                    )}

                    {skalSjekkeFlyktningStatus && (
                        <SkjemaGruppe>
                            <RHFToValgRadio
                                name={"flyktning"}
                                legend={<Trans i18nKey={"omDeg.flyktning"} />}
                                hjelpetekst={t("omDeg.flyktningHvorfor")}
                            />
                        </SkjemaGruppe>
                    )}

                    <br />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon neste={handleSubmit(lagre)} />
                </form>
            </FormProvider>
        </>
    );
};

export default OmDeg;
