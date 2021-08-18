import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { BarnRelasjon, IBarn } from "../../../typer/person";
import { RHFRadio, RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput } from "../../felles/RHFInput";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { Undertittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";

interface Props {
    lagre: (data: IBarn) => void;
}

const LeggTilBarnSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<IBarn>({
        shouldUnregister: true
    });

    const {
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = methods;

    const leggTilOgLukk = (data: any) => {
        lagre(data);
        reset();
    };

    const bosattUtland = watch("bosattUtland.svar")
    const brukeAnnenKonto = watch("brukeAnnenKonto.svar")
    const relasjon = watch("relasjon")
    const soekerBarnepensjon = watch("soekerBarnepensjon")

    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }}>
                <SkjemaGruppe>
                    <Undertittel className={"center"}>
                        Legg til barn
                    </Undertittel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <div className={"rad"}>
                        <div className={"kol-50"}>
                            <RHFInput
                                name={"fornavn"}
                                label={t("omBarn.fornavn")}
                                rules={{ pattern: /^\D+$/ }}
                            />
                        </div>

                        <div className={"kol-50"}>
                            <RHFInput
                                name={"etternavn"}
                                label={t("omBarn.etternavn")}
                                rules={{ pattern: /^\D+$/ }}
                            />
                        </div>
                    </div>

                    <RHFFoedselsnummerInput
                        name={"foedselsnummer"}
                        label={t("omBarn.foedselsnummer")}
                    />

                    <RHFInput
                        name={"statsborgerskap"}
                        label={t("omBarn.statsborgerskap")}
                    />
                </SkjemaGruppe>

                <RHFSpoersmaalRadio
                    name={"bosattUtland.svar"}
                    legend={t("omBarn.bosattUtland.svar")}
                />

                {bosattUtland === IValg.JA && (
                    <SkjemaGruppe>
                        <RHFInput
                            name={"bosattUtland.land"}
                            label={t("omBarn.bosattUtland.land")}
                        />

                        <RHFInput
                            name={"bosattUtland.adresse"}
                            label={t("omBarn.bosattUtland.adresse")}
                        />
                    </SkjemaGruppe>
                )}

                <RHFRadio
                    name={"relasjon"}
                    legend={t("omBarn.relasjon")}
                    radios={Object.values(BarnRelasjon).map(value => {
                        return { label: t(value), value } as RadioProps
                    })}
                />

                {relasjon === BarnRelasjon.fellesbarnMedAvdoede && (
                    <>
                        <RHFSpoersmaalRadio
                            name={"soekerBarnepensjon"}
                            legend={t("omBarn.soekerBarnepensjon")}
                            description={
                                <AlertStripe type={"advarsel"} form={"inline"}>
                                    {t("omBarn.soekerBarnepensjonInfo")}
                                </AlertStripe>
                            }
                        />

                        {soekerBarnepensjon === IValg.JA && (
                            <>
                                <RHFSpoersmaalRadio
                                    name={"brukeAnnenKonto.svar"}
                                    legend={t("omBarn.brukeAnnenKonto.svar")}
                                />

                                {brukeAnnenKonto === IValg.JA && (
                                    <SkjemaGruppe>
                                        <RHFKontonummerInput
                                            name={"brukeAnnenKonto.kontonummer"}
                                            label={t("omBarn.brukeAnnenKonto.kontonummer")}
                                        />
                                    </SkjemaGruppe>
                                )}
                            </>
                        )}
                    </>
                )}

                {(relasjon === BarnRelasjon.avdoedesSaerkullsbarn || relasjon === BarnRelasjon.egneSaerkullsbarn) && (
                    <RHFSpoersmaalRadio
                        name={"dagligOmsorg"}
                        legend={t("omBarn.dagligOmsorg")}
                    />
                )}

                <Feilmeldinger errors={errors}/>

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Hovedknapp htmlType={"button"} onClick={handleSubmit(leggTilOgLukk)}>
                        {t("knapp.leggTil")}
                    </Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
