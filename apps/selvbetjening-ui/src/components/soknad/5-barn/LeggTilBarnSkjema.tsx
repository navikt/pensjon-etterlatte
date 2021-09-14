import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BarnRelasjon, IBarn } from "../../../typer/person";
import { RHFRadio, RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { RHFFoedselsnummerInput, RHFInput } from "../../felles/RHFInput";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { hentAlderFraFoedselsnummer } from "../../../utils/dato";
import { erMyndig } from "../../../utils/alder";
import { fnr } from "@navikt/fnrvalidator";
import { Button, Title } from "@navikt/ds-react";
import { RHFCheckboksPanel } from "../../felles/RHFCheckboksPanelGruppe";
import Hjelpetekst from "../../felles/Hjelpetekst";
import "./LeggTilBarnSkjema.scss"

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
    const harBarnetVerge = watch("harBarnetVerge.svar")
    const relasjon = watch("relasjon")
    const foedselsnummer = watch("foedselsnummer")
    const soekerBarnepensjon = watch("soekerBarnepensjon")

    const kanSoekeOmBarnepensjon = (): boolean => {
        if (foedselsnummer && (fnr(foedselsnummer).status === 'valid')) {
            const alder = hentAlderFraFoedselsnummer(foedselsnummer)
            return !erMyndig(alder)
        }

        return false
    }

    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }}>
                <SkjemaGruppe>
                    <Title size={"s"} className={"center"}>
                        Legg til barn
                    </Title>
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
                        bredde={"S"}
                        label={t("omBarn.foedselsnummer")}
                    />

                    <RHFInput
                        name={"statsborgerskap"}
                        bredde={"XL"}
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
                            bredde={"XL"}
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
                    legend={(
                            <span className={"hjelpetekst-container"}>
                                {t("omBarn.relasjon") }&nbsp;
                                <Hjelpetekst eventType={"onHover"}>{t("omBarn.relasjonHjelpetekst")} </Hjelpetekst>
                            </span>
                        )}

                    radios={Object.values(BarnRelasjon).map(value => {
                        return { label: t(value), value } as RadioProps
                    })}
                />

                {relasjon === BarnRelasjon.fellesbarnMedAvdoede && (
                    <>
                        <>
                            <RHFSpoersmaalRadio
                                name={"harBarnetVerge.svar"}
                                legend={t("omBarn.harBarnetVerge.svar")}
                            />

                            {harBarnetVerge === IValg.JA && (
                                <SkjemaGruppe>
                                    <RHFInput
                                        name={"harBarnetVerge.navn"}
                                        bredde={"S"}
                                        label={t("omBarn.harBarnetVerge.navn")}
                                        placeholder={t("omBarn.harBarnetVerge.navnPlaceholder")}
                                    />
                                    <RHFFoedselsnummerInput
                                        name={"harBarnetVerge.foedselsnummer"}
                                        bredde={"S"}
                                        label={t("omBarn.harBarnetVerge.foedselsnummer")}
                                        placeholder={t("omBarn.harBarnetVerge.foedselsnummerPlaceholder")}
                                    />
                                </SkjemaGruppe>
                            )}
                        </>


                        {kanSoekeOmBarnepensjon() && (
                            <RHFCheckboksPanel
                                name={"soekerBarnepensjon"}
                                legend={t("omBarn.soekerBarnepensjon")}
                                description={t("omBarn.soekerBarnepensjonInfo")}
                                valgfri={true}
                                checkbox={
                                    {
                                        label: t("omBarn.soekerBarnepensjonCheckboks"),
                                        value: IValg.JA
                                    }
                                }
                            />
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
                    <Button
                        id={"leggTilBarn"}
                        variant={"action"}
                        type={"button"}
                        onClick={handleSubmit(leggTilOgLukk)}
                    >
                        {t("knapp.leggTil")}
                    </Button>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
