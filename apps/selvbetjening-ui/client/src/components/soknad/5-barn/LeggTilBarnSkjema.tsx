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
import { Button, Cell, Grid, Heading, Label, Panel } from "@navikt/ds-react";
import { RHFCheckboksPanel } from "../../felles/RHFCheckboksPanelGruppe";
import Hjelpetekst from "../../felles/Hjelpetekst";
import SkjemaGruppering from "../../felles/SkjemaGruppering";
import { RHFSelect } from "../../felles/RHFSelect";
import { useLand } from "../../../hooks/useLand";
import ikon from "../../../assets/ikoner/barn1.svg";
import "./LeggTilBarnSkjema.scss"
import { useEffect } from "react";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";

interface Props {
    avbryt: () => void;
    lagre: (data: IBarn) => void;
    barn: IBarn;
    fnrRegistrerteBarn: string[];
    fjernAvbruttNyttBarn: () => void;
}

const LeggTilBarnSkjema = ({ avbryt, lagre, barn, fnrRegistrerteBarn, fjernAvbruttNyttBarn }: Props) => {
    const { t } = useTranslation();
    const { land }: { land: any } = useLand();
    const { state: bruker } = useBrukerContext();

    const methods = useForm<IBarn>({
        defaultValues: {
            ...barn,
            statsborgerskap: barn.statsborgerskap || "Norge",
            bosattUtland: { ...barn.bosattUtland, land: barn.bosattUtland?.land || "Norge" }
        },
        shouldUnregister: true
    });

    const {
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = methods;

    const leggTilOgLukk = (data: IBarn) => {
        lagre(data);
        reset();
        window.scrollTo(0, 0)
    };

    const avbrytOgLukk = () => {
        if (barn.foedselsnummer === undefined) {
            fjernAvbruttNyttBarn()
        }
        avbryt()
        window.scrollTo(0, 0)
    }

    const bosattUtlandSvar = watch("bosattUtland.svar")
    const harBarnetVerge = watch("harBarnetVerge.svar")
    const relasjon = watch("relasjon")
    const foedselsnummer: any = watch("foedselsnummer")
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

    const visDuplikatFeilmelding = () => {
        const erDuplikat = fnrRegistrerteBarn.includes(foedselsnummer)
        const valideringVisesIkke = errors.foedselsnummer === undefined
        return erDuplikat && valideringVisesIkke
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <FormProvider {...methods} >
            <form>
                <Panel border className={"endre-barn-kort"}>
                    <div className={"endre-barn-kort__header"}>
                        <img alt="barn" className="barneikon" src={ikon}/>
                        <Heading size={"small"} className={"overskrift"}>{t("omBarn.tittelModal")}</Heading>
                    </div>
                    <br/>

                    <div className={"innhold"}>
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
                                placeholder={t("felles.fnrPlaceholder")}
                                rules={{
                                    validate: {
                                        validate: (value) => {
                                            return fnr(value).status === "valid";
                                        },
                                        duplicate: (value) => {
                                            return !fnrRegistrerteBarn.includes(value);
                                        }
                                    }
                                }}
                            />

                            {visDuplikatFeilmelding() && (
                                <SkjemaGruppe className={"skjemaelement__feilmelding"}>
                                    <p className={"typo-feilmelding"}>
                                        {t("feil.foedselsnummer.duplicate")}
                                    </p>
                                </SkjemaGruppe>
                            )}

                            <RHFSelect
                                className="kol-50"
                                name={`statsborgerskap`}
                                label={t("omBarn.statsborgerskap")}
                                value={"Norge"}
                                selectOptions={land}
                            />
                        </SkjemaGruppering>

                        <SkjemaGruppering>
                            <RHFSpoersmaalRadio
                                name={"bosattUtland.svar"}
                                legend={t("omBarn.bosattUtland.svar")}
                            />

                            {bosattUtlandSvar === IValg.JA && (
                                <>
                                    <RHFSelect
                                        name={"bosattUtland.land"}
                                        label={t("omBarn.bosattUtland.land")}
                                        value={"Norge"}
                                        selectOptions={land}
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
                                    return { label: t(value), value, required: true } as RadioProps
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
                                            <Label>{t("omBarn.harBarnetVerge.navn")}</Label>
                                            <Grid>
                                                <Cell xs={12} md={6}>
                                                    <RHFInput
                                                        name={"harBarnetVerge.fornavn"}
                                                        label={t("omBarn.harBarnetVerge.fornavn")}
                                                        rules={{ pattern: /^\D+$/ }}
                                                        valgfri={true}
                                                    />
                                                </Cell>
                                                <Cell xs={12} md={6}>
                                                    <RHFInput
                                                        name={"harBarnetVerge.etternavn"}
                                                        label={t("omBarn.harBarnetVerge.etternavn")}
                                                        rules={{ pattern: /^\D+$/ }}
                                                        valgfri={true}
                                                    />
                                                </Cell>
                                            </Grid>
                                            <RHFFoedselsnummerInput
                                                name={"harBarnetVerge.foedselsnummer"}
                                                bredde={"L"}
                                                label={t("omBarn.harBarnetVerge.foedselsnummer")}
                                                placeholder={t("omBarn.harBarnetVerge.foedselsnummerPlaceholder")}
                                                valgfri={true}
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

                                    {!bruker.adressebeskyttelse && soekerBarnepensjon === IValg.JA && (
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

                        {(relasjon === BarnRelasjon.egneSaerkullsbarn || relasjon == BarnRelasjon.avdoedesSaerkullsbarn) && (
                            <SkjemaGruppe>
                                <RHFSpoersmaalRadio
                                    name={"dagligOmsorg"}
                                    legend={t("omBarn.dagligOmsorg")}
                                />
                            </SkjemaGruppe>
                        )}

                        <Feilmeldinger errors={errors}/>

                        <div className={"navigasjon-rad bottom-spacing-none"}>
                            <Button
                                id={"avbrytLeggTilBarn"}
                                variant={"secondary"}
                                type={"button"}
                                onClick={avbrytOgLukk}
                                style={{ minWidth: "80px" }}
                            >
                                {t("knapp.avbryt")}
                            </Button>

                            <Button
                                id={"leggTilBarn"}
                                variant={"primary"}
                                type={"button"}
                                onClick={handleSubmit(leggTilOgLukk)}
                                style={{ minWidth: "80px" }}
                            >
                                {t("knapp.lagre")}
                            </Button>
                        </div>
                    </div>
                </Panel>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
