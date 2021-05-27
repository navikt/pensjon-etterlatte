import { SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { IBarn } from "../../../typer/person";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import RHFInput from "../../felles/RHFInput";

interface Props {
    lagre: (data: IBarn) => void;
}

const LeggTilBarnSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<IBarn>();

    const {
        handleSubmit,
        reset,
        watch,
    } = methods;

    const leggTilOgLukk = (data: any) => {
        lagre(data);
        reset();
    };

    const bosattUtland = watch("bosattUtland")

    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }} onSubmit={handleSubmit(leggTilOgLukk)}>
                <SkjemaGruppe>
                    <RHFInput
                        name={"fornavn"}
                        label={t("felles.fornavn")}
                    />

                    <RHFInput
                        name={"etternavn"}
                        label={t("felles.etternavn")}
                    />

                    <RHFInput
                        name={"foedselsnummer"}
                        label={t("felles.fnr")}
                    />

                    <RHFRadio
                        name={"foreldre"}
                        legend={"Hvilken relasjon har du til barnet?"}
                        radios={[
                            { label: t("opplysningerOmBarn.fellesbarnMedAvdoed"), value: "Fellesbarn m/avdøde" },
                            { label: t("opplysningerOmBarn.avdoedesSaerkullsbarn"), value: "Avdødes særkullsbarn" },
                            { label: t("opplysningerOmBarn.egneSaerkullsbarn"), value: "Egne særkullsbarn" },
                        ]}
                    />

                    <RHFToValgRadio
                        name={"bosattUtland"}
                        legend={t("opplysningerOmBarn.borUtenlands")}
                    />

                    {bosattUtland && (
                        <SkjemaGruppe>
                            <RHFInput
                                name={"statsborgerskap"}
                                label={t("felles.statsborgerskap")}
                            />

                            <RHFInput
                                name={"land"}
                                label={t("felles.land")}
                            />
                        </SkjemaGruppe>
                    )}

                    <section className={"navigasjon-rad"}>
                        <Hovedknapp htmlType={"submit"}>{t("knapp.leggTil")}</Hovedknapp>
                    </section>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
