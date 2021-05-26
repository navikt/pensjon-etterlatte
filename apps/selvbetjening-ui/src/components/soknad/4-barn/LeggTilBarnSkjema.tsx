import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { IBarn } from "../../../typer/person";
import { yupResolver } from "@hookform/resolvers/yup";
import BarnTypeSchema from "./BarnTypeSchema";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";

interface Props {
    lagre: (data: IBarn) => void;
}

const LeggTilBarnSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<IBarn>({
        mode: "onSubmit",
        resolver: yupResolver(BarnTypeSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = methods;

    const leggTilOgLukk = (data: any) => {
        lagre(data);
        reset();
    };

    const bosattUtland = watch("bosattUtland")

    return (
        <form style={{ padding: "2rem 2.5rem" }} onSubmit={handleSubmit(leggTilOgLukk)}>
            <SkjemaGruppe>
                {/* sjekkboks for INGEN BARN */}

                <Input {...register("fornavn")} label={t("felles.fornavn")} feil={errors.fornavn?.message} />

                <Input {...register("etternavn")} label={t("felles.etternavn")} feil={errors.etternavn?.message} />

                <Input {...register("foedselsnummer")} label={t("felles.fnr")} feil={errors.foedselsnummer?.message} />

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
                    <>
                        <Input
                            {...register("statsborgerskap")}
                            label={t("felles.statsborgerskap")}
                            feil={errors.statsborgerskap && "Statsborgerskap må fylles ut"}
                        />

                        <Input
                            {...register("land")}
                            label={t("felles.land")}
                            feil={errors.land && "Land må fylles ut"}
                        />
                    </>
                )}

                <section className={"navigasjon-rad"}>
                    <Hovedknapp htmlType={"submit"}>{t("knapp.leggTil")}</Hovedknapp>
                </section>
            </SkjemaGruppe>
        </form>
    );
};

export default LeggTilBarnSkjema;
