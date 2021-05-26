import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Datovelger from "../../felles/Datovelger";
import TidligereArbeidsforholdSchema from "./TidligereArbeidsforholdSchema";
import { ITidligereArbeidsforhold } from "../../../typer/arbeidsforhold";

interface Props {
    lagre: (data: ITidligereArbeidsforhold) => void;
}

const LeggTilArbeidsforholdSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<ITidligereArbeidsforhold>({
        mode: "onSubmit",
        resolver: yupResolver(TidligereArbeidsforholdSchema),
    });

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }} onSubmit={handleSubmit(lagre)}>
                <SkjemaGruppe>
                    <Input
                        {...register("beskrivelse")}
                        label={t("tidligereArbeidsforhold.skoleKursArbeidOsv")}
                        feil={errors?.beskrivelse?.message}
                    />
                </SkjemaGruppe>

                <div className={"skjemagruppe skjemagruppe__inline"}>
                    <Datovelger
                        name={"fraDato"}
                        control={control}
                        label={t("felles.fraDato")}
                        feil={errors?.fraDato?.message}
                    />

                    <Datovelger
                        name={"tilDato"}
                        control={control}
                        label={t("felles.tilDato")}
                        feil={errors?.tilDato?.message}
                    />
                </div>

                <section className={"navigasjon-rad"}>
                    <Hovedknapp htmlType={"submit"}>{t("knapp.leggTil")}</Hovedknapp>
                </section>
            </form>
        </FormProvider>
    );
};

export default LeggTilArbeidsforholdSkjema;
