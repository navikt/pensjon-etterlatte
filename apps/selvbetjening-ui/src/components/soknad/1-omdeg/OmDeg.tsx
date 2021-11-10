import "./OmDeg.scss";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import InnloggetBruker from "./InnloggetBruker";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { IValg } from "../../../typer/Spoersmaal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoeker } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from "../../felles/RHFInput";
import { RHFInlineRadio, RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import Navigasjon from "../../felles/Navigasjon";
import { emailMatcher } from "../../../utils/matchers";
import { Cell, Grid, Heading } from "@navikt/ds-react";
import { BankkontoType } from "../../../typer/utbetaling";
import UtenlandskBankInfo from "./utenlandskBankInfo/UtenlandskBankInfo";
import HvorforSpoerVi from "../../felles/HvorforSpoerVi";
import SkjemaGruppering from "../../felles/SkjemaGruppering";
import { deepCopy } from "../../../utils/deepCopy";
import { RHFSelect } from "../../felles/RHFSelect";
import { useLand } from "../../../hooks/useLand";

const OmDeg: SoknadSteg = ({ neste }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const brukerState = useBrukerContext().state;
    const { land }: { land: any } = useLand();
    const lagre = (data: ISoeker) => {

        dispatch({ type: ActionTypes.OPPDATER_OM_DEG, payload: {...deepCopy(data), erValidert: true}} );
        neste!!();
    };

    const methods = useForm<ISoeker>({
        defaultValues: {...state.omDeg, oppholdsland: "Norge" } || {},
        shouldUnregister: true,
    });

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const skalSjekkeFlyktningStatus = brukerState.foedselsaar!! < 1960;

    const borPaaRegistrertAdresse = watch("bostedsadresseBekreftet");
    const oppholderSegINorge = watch("oppholderSegINorge");
    const bankkontoType = watch("utbetalingsInformasjon.bankkontoType");

    return (
        <>
            {/* Steg 2 */}
            <Heading size={"medium"} className={"center"}>
               {t("omDeg.tittel")}
            </Heading>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form>
                    <SkjemaGruppering>
                        <RHFSpoersmaalRadio
                            name={"bostedsadresseBekreftet"}
                            legend={t("omDeg.bostedsadresseBekreftet")}
                        />

                        {borPaaRegistrertAdresse === IValg.NEI && (
                            <SkjemaGruppe>
                                <RHFInput
                                    name={"alternativAdresse"}
                                    label={t("omDeg.alternativAdresse")}
                                />
                            </SkjemaGruppe>
                        )}

                        <SkjemaGruppe>
                            <Grid>
                                <Cell xs={12} md={3} className={"kol"}>
                                    <RHFTelefonInput
                                        bredde={"S"}
                                        name={"kontaktinfo.telefonnummer"}
                                        label={t("omDeg.kontaktinfo.telefonnummer")}
                                        placeholder={t("omDeg.kontaktinfo.telefonnummerPlaceholder")}
                                        valgfri={true}
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
                    </SkjemaGruppering>

                    {/* 2.7 */}
                    <SkjemaGruppering>
                        <RHFSpoersmaalRadio
                            name={"oppholderSegINorge"}
                            legend={t("omDeg.oppholderSegINorge")}
                            description={<HvorforSpoerVi title="omDeg.oppholderSegINorge">{t("omDeg.oppholdHvorfor")}</HvorforSpoerVi>}
                        />

                        {oppholderSegINorge === IValg.JA && (
                            <SkjemaGruppe>
                                <RHFKontonummerInput
                                    bredde={"S"}
                                    name={"utbetalingsInformasjon.kontonummer"}
                                    label={t("omDeg.utbetalingsInformasjon.kontonummer")}
                                    placeholder={"11 siffer"}
                                    description={t("omDeg.utbetalingsInformasjon.informasjon")}
                                />
                            </SkjemaGruppe>
                        )}

                        {oppholderSegINorge === IValg.NEI && (
                            <>
                                <SkjemaGruppe>
                                    <RHFSelect
                                        className="kol-50"
                                        name={`oppholdsland`}
                                        label={t("omDeg.oppholdsland")}
                                        selectOptions={land}
                                    />
                                </SkjemaGruppe>

                                <RHFSpoersmaalRadio
                                    name={"medlemFolketrygdenUtland"}
                                    legend={t("omDeg.medlemFolketrygdenUtland")}
                                />

                                <RHFInlineRadio
                                    name={"utbetalingsInformasjon.bankkontoType"}
                                    legend={t("omDeg.utbetalingsInformasjon.bankkontoType")}
                                    radios={Object.values(BankkontoType).map((value) => {
                                        return { label: t(value), value } as RadioProps;
                                    })}
                                />

                                {bankkontoType === BankkontoType.norsk && (
                                    <RHFKontonummerInput
                                        bredde={"S"}
                                        name={"utbetalingsInformasjon.kontonummer"}
                                        label={t("omDeg.utbetalingsInformasjon.kontonummer")}
                                        placeholder={"11 siffer"}
                                    />
                                )}

                                {bankkontoType === BankkontoType.utenlandsk && <UtenlandskBankInfo />}
                            </>
                        )}
                    </SkjemaGruppering>

                    {skalSjekkeFlyktningStatus && (
                        <SkjemaGruppe>
                            <RHFSpoersmaalRadio
                                name={"flyktning"}
                                legend={t("omDeg.flyktning")}
                                description={<HvorforSpoerVi title="omDeg.flyktning">{t("omDeg.flyktningHvorfor")}</HvorforSpoerVi>}
                            />
                        </SkjemaGruppe>
                    )}

                    <br />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon neste={{ onClick: handleSubmit(lagre) }} />
                </form>
            </FormProvider>
        </>
    );
};

export default OmDeg;
