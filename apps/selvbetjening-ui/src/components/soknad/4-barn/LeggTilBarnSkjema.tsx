import { SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { BarnRelasjon, IBarn } from "../../../typer/person";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import { RHFInput, RHFKontonummerInput } from "../../felles/RHFInput";
import IValg from "../../../typer/IValg";
import Feilmeldinger from "../../felles/Feilmeldinger";

interface Props {
    lagre: (data: IBarn) => void;
}

const LeggTilBarnSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<IBarn>();

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

    const bosattUtland = watch("bosattUtland")
    const brukeAnnenKonto = watch("brukeAnnenKonto")


    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }}>
                <SkjemaGruppe>
                    <RHFInput
                        name={"fornavn"}
                        label={t("felles.fornavn")}
                        rules={{ pattern: /^\D+$/ }}
                    />

                    <RHFInput
                        name={"etternavn"}
                        label={t("felles.etternavn")}
                        rules={{ pattern: /^\D+$/ }}
                    />

                    <RHFInput
                        name={"foedselsnummer"}
                        label={t("felles.fnr")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"brukeAnnenKonto"}
                        legend={t("opplysningerOmBarn.brukeAnnenKonto")}
                    />

                    {brukeAnnenKonto === IValg.JA && (
                        <RHFKontonummerInput
                            name={"kontonummer"}
                            label={t("opplysningerOmBarn.barnetsKontonummer")}
                        />
                    )}
                </SkjemaGruppe>

                <RHFRadio
                    name={"foreldre"}
                    legend={"Hvilken relasjon har du til barnet?"}
                    radios={[
                        {
                            label: t("opplysningerOmBarn.fellesbarnMedAvdoed"),
                            value: BarnRelasjon.fellesbarnMedAvdoede
                        },
                        {
                            label: t("opplysningerOmBarn.avdoedesSaerkullsbarn"),
                            value: BarnRelasjon.avdoedesSaerkullsbarn
                        },
                        { label: t("opplysningerOmBarn.egneSaerkullsbarn"), value: BarnRelasjon.egneSaerkullsbarn },
                    ]}
                />

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"bosattUtland"}
                        legend={t("opplysningerOmBarn.borUtenlands")}
                    />

                    {bosattUtland === IValg.JA && (
                        <>
                            <RHFInput
                                name={"statsborgerskap"}
                                label={t("felles.statsborgerskap")}
                            />

                            <RHFInput
                                name={"land"}
                                label={t("felles.land")}
                            />
                        </>
                    )}
                </SkjemaGruppe>

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
