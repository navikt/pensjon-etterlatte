import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BarnRelasjon, IBarn } from "../../../typer/person";
import { RHFRadio, RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput } from "../../felles/RHFInput";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { Undertittel } from "nav-frontend-typografi";
import { hentAlderFraFoedselsnummer } from "../../../utils/dato";
import { erMyndig } from "../../../utils/alder";
import { fnr } from "@navikt/fnrvalidator";
import { Button } from "@navikt/ds-react";

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
                    legend={t("omBarn.relasjon")}
                    radios={Object.values(BarnRelasjon).map(value => {
                        return { label: t(value), value } as RadioProps
                    })}
                />

                {relasjon === BarnRelasjon.fellesbarnMedAvdoede && (
                    <>
                        {kanSoekeOmBarnepensjon() && (
                            <RHFSpoersmaalRadio
                                name={"soekerBarnepensjon"}
                                legend={t("omBarn.soekerBarnepensjon")}
                            />
                        )}

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
                                            bredde={"S"}
                                            label={t("omBarn.brukeAnnenKonto.kontonummer")}
                                            placeholder={"11 siffer"}
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
                    <Button
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
