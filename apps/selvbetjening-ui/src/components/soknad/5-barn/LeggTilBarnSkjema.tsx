import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BarnRelasjon, IBarn } from "../../../typer/person";
import { RHFRadio, RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from "../../felles/RHFInput";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { hentAlderFraFoedselsnummer } from "../../../utils/dato";
import { erMyndig } from "../../../utils/alder";
import { fnr } from "@navikt/fnrvalidator";
import { Button, Title } from "@navikt/ds-react";
import { RHFCheckboksPanel } from "../../felles/RHFCheckboksPanelGruppe";
import Hjelpetekst from "../../felles/Hjelpetekst";
import SkjemaGruppering from "../../felles/SkjemaGruppering";

interface Props {
    lagre: (data: IBarn) => void;
    avbryt: () => void;
}

const LeggTilBarnSkjema = ({ lagre, avbryt }: Props) => {
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
    const soekerBarnepensjon = watch("barnepensjon.soeker")
    const annetKontonummerBarnepensjon = watch("barnepensjon.kontonummer.svar")
    const forskuddstrekkBarnepensjon = watch("barnepensjon.forskuddstrekk.svar")

    const kanSoekeOmBarnepensjon = (): boolean => {
        if (foedselsnummer && (fnr(foedselsnummer).status === 'valid')) {
            const alder = hentAlderFraFoedselsnummer(foedselsnummer)
            return !erMyndig(alder)
        }

        return false
    }

    return (
        <FormProvider {...methods} >
            <form style={{ padding: "2rem 2.5rem" }}>
                <SkjemaGruppe className={"skjemagruppe-modal"}>
                    <Title size={"s"} className={"center"}>
                        {t("omBarn.tittelModal")}
                    </Title>
                </SkjemaGruppe>

                <SkjemaGruppering>
                    <SkjemaGruppe className={"rad"}>
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
                    </SkjemaGruppe>

                    <RHFFoedselsnummerInput
                        name={"foedselsnummer"}
                        bredde={"L"}
                        label={t("omBarn.foedselsnummer")}
                    />

                    <RHFInput
                        name={"statsborgerskap"}
                        placeholder={t("omBarn.statsborgerskapPlaceholder")}
                        bredde={"XL"}
                        label={t("omBarn.statsborgerskap")}
                    />
                </SkjemaGruppering>

                <SkjemaGruppering>
                    <RHFSpoersmaalRadio
                        name={"bosattUtland.svar"}
                        legend={t("omBarn.bosattUtland.svar")}
                    />

                    {bosattUtland === IValg.JA && (
                        <>
                            <RHFInput
                                name={"bosattUtland.land"}
                                bredde={"XL"}
                                label={t("omBarn.bosattUtland.land")}
                            />

                            <RHFInput
                                name={"bosattUtland.adresse"}
                                label={t("omBarn.bosattUtland.adresse")}
                            />
                        </>
                    )}
                </SkjemaGruppering>

                <SkjemaGruppering>
                    <RHFRadio
                        name={"relasjon"}
                        legend={(
                            <>
                                {t("omBarn.relasjon")}&nbsp;
                                <Hjelpetekst>{t("omBarn.relasjonHjelpetekst")} </Hjelpetekst>
                            </>
                        )}

                        radios={Object.values(BarnRelasjon).map(value => {
                            return { label: t(value), value } as RadioProps
                        })}
                    />
                </SkjemaGruppering>
                {relasjon === BarnRelasjon.fellesbarnMedAvdoede && kanSoekeOmBarnepensjon() && (
                    <>
                        <SkjemaGruppering>
                            <RHFSpoersmaalRadio
                                name={"harBarnetVerge.svar"}
                                legend={t("omBarn.harBarnetVerge.svar")}
                            />

                            {harBarnetVerge === IValg.JA && (
                                <>
                                    <RHFInput
                                        name={"harBarnetVerge.navn"}
                                        bredde={"L"}
                                        label={t("omBarn.harBarnetVerge.navn")}
                                        placeholder={t("omBarn.harBarnetVerge.navnPlaceholder")}
                                    />
                                    <RHFFoedselsnummerInput
                                        name={"harBarnetVerge.foedselsnummer"}
                                        bredde={"L"}
                                        label={t("omBarn.harBarnetVerge.foedselsnummer")}
                                        placeholder={t("omBarn.harBarnetVerge.foedselsnummerPlaceholder")}
                                    />
                                </>
                            )}
                        </SkjemaGruppering>

                        <SkjemaGruppering>
                            <RHFCheckboksPanel
                                name={"barnepensjon.soeker"}
                                legend={t("omBarn.barnepensjon.soeker")}
                                description={t("omBarn.barnepensjon.soekerInfo")}
                                valgfri={true}
                                checkbox={
                                    {
                                        label: t("omBarn.barnepensjon.soekerCheckboks"),
                                        value: IValg.JA
                                    }
                                }
                            />

                            {soekerBarnepensjon === IValg.JA && (
                                <>
                                    <RHFSpoersmaalRadio
                                        name={"barnepensjon.kontonummer.svar"}
                                        legend={t("omBarn.barnepensjon.kontonummer.svar")}
                                    />

                                    {annetKontonummerBarnepensjon === IValg.NEI && (

                                        <RHFKontonummerInput
                                            name={"barnepensjon.kontonummer.kontonummer"}
                                            bredde={"M"}
                                            label={t("omBarn.barnepensjon.kontonummer.kontonummer")}
                                            placeholder={t("omBarn.barnepensjon.kontonummer.placeholder")}
                                            description={t("omBarn.barnepensjon.kontonummer.informasjon")}
                                        />
                                    )}

                                    {annetKontonummerBarnepensjon !== IValg.VET_IKKE && (
                                        <RHFSpoersmaalRadio
                                            name={"barnepensjon.forskuddstrekk.svar"}
                                            legend={(
                                                <>
                                                    {t("omBarn.barnepensjon.forskuddstrekk.svar")}&nbsp;
                                                    <Hjelpetekst>
                                                        {t("omBarn.barnepensjon.forskuddstrekk.hjelpetekst")}
                                                    </Hjelpetekst>
                                                </>
                                            )}
                                        />
                                    )}

                                    {forskuddstrekkBarnepensjon === IValg.JA && (
                                        <RHFProsentInput
                                            bredde={"M"}
                                            name={"barnepensjon.forskuddstrekk.trekkprosent"}
                                            label={t("omBarn.barnepensjon.forskuddstrekk.trekkprosent")}
                                            placeholder={t("omBarn.barnepensjon.forskuddstrekk.placeholder")}
                                        />
                                    )}
                                </>
                            )}
                        </SkjemaGruppering>
                    </>
                )}

                {(relasjon === BarnRelasjon.avdoedesSaerkullsbarn || relasjon === BarnRelasjon.egneSaerkullsbarn) && (
                    <SkjemaGruppe className={"skjemagruppe-modal"}>
                        <RHFSpoersmaalRadio
                            name={"dagligOmsorg"}
                            legend={t("omBarn.dagligOmsorg")}
                        />
                    </SkjemaGruppe>
                )}

                <Feilmeldinger errors={errors}/>

                <div className={"navigasjon-rad bottom-spacing-none"}>
                    <Button
                        id={"leggTilBarn"}
                        variant={"action"}
                        type={"button"}
                        onClick={handleSubmit(leggTilOgLukk)}
                    >
                        {t("knapp.lagre")}
                    </Button>
                </div>
                <div className={"navigasjon-rad"}>
                    <Button
                        id={"avbrytLeggTilBarn"}
                        variant={"secondary"}
                        type={"button"}
                        onClick={avbryt}
                    >
                        {t("knapp.avbryt")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
