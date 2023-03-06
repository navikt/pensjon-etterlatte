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
import { Alert, BodyShort, Button, Cell, Grid, Heading, Label, Panel, HelpText } from "@navikt/ds-react";
import { RHFCheckboksPanel } from "../../felles/RHFCheckboksPanelGruppe";
import SkjemaGruppering from "../../felles/SkjemaGruppering";
import { RHFSelect } from "../../felles/RHFSelect";
import { useLand } from "../../../hooks/useLand";
import ikon from "../../../assets/ikoner/barn1.svg";
import { useEffect } from "react";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import styled from "styled-components";
import {NavigasjonsRad, SkjemaGruppeRad, TypoFeilmelding} from "../../felles/StyledComponents";

const HelpTextLabel = styled.div`
    display: flex;
`

const EndreBarnKort = styled(Panel)`
    padding: 0;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
      max-width: 100%;
    }
`

const EndreBarnKortHeader = styled.header`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    padding: 0;
    position: relative;

    img {
      align-self: flex-end;
      flex: 0 1 auto;       
      padding-left: 3em;    
    }

    .overskrift {
      flex: 0 1 auto;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      align-self: center;
      color: white;
    }
`

const EndreBarnKortInnhold = styled.div`
    padding: 2em;
`

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
            statsborgerskap: barn.statsborgerskap,
            bosattUtland: { ...barn.bosattUtland, land: barn.bosattUtland?.land }
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
                <EndreBarnKort border>
                    <EndreBarnKortHeader>
                        <img alt="barn" src={ikon}/>
                        <Heading size={"small"} className={"overskrift"}>{t("omBarn.tittelModal")}</Heading>
                    </EndreBarnKortHeader>
                    <br/>

                    <EndreBarnKortInnhold>
                        <SkjemaGruppering>
                            <SkjemaGruppeRad>
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
                            </SkjemaGruppeRad>

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

                            {!visDuplikatFeilmelding() && (
                                <SkjemaGruppe>
                                    <TypoFeilmelding>
                                        {t("feil.foedselsnummer.duplicate")}
                                    </TypoFeilmelding>
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
                                    <HelpTextLabel>
                                        {t("omBarn.relasjon")}&nbsp;
                                        <HelpText>{t("omBarn.relasjonHjelpetekst")} </HelpText>
                                    </HelpTextLabel>
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
                                                        <HelpTextLabel>
                                                            {t("omBarn.barnepensjon.forskuddstrekk.svar")}&nbsp;
                                                            <HelpText>
                                                                {t("omBarn.barnepensjon.forskuddstrekk.hjelpetekst")}
                                                            </HelpText>
                                                        </HelpTextLabel>
                                                    )}
                                                />
                                            )}

                                            {forskuddstrekkBarnepensjon === IValg.JA && (
                                                <>
                                                    <RHFProsentInput
                                                        bredde={"M"}
                                                        name={"barnepensjon.forskuddstrekk.trekkprosent"}
                                                        label={t("omBarn.barnepensjon.forskuddstrekk.trekkprosent")}
                                                        placeholder={t("omBarn.barnepensjon.forskuddstrekk.placeholder")}
                                                    />
                                                    <Panel border>
                                                        <Alert variant={"info"} className={"navds-alert--inline"}>
                                                            <BodyShort size={"small"}>
                                                                {t("omBarn.barnepensjon.forskuddstrekk.info")}
                                                            </BodyShort>
                                                        </Alert>
                                                    </Panel>
                                                </>
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

                        <NavigasjonsRad className={"bottom-spacing-none"}>
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
                        </NavigasjonsRad>
                    </EndreBarnKortInnhold>
                </EndreBarnKort>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
