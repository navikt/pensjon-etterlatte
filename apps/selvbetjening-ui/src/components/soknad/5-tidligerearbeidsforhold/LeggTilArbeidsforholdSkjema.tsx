import { SkjemaGruppe } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import Datovelger from "../../felles/Datovelger";
import { ITidligereArbeidsforhold } from "../../../typer/arbeidsforhold";
import { RHFInput } from "../../felles/RHFInput";
import Feilmeldinger from "../../felles/Feilmeldinger";

interface Props {
    lagre: (data: ITidligereArbeidsforhold) => void;
}

const LeggTilArbeidsforholdSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<ITidligereArbeidsforhold>({
        shouldUnregister: true
    });

    const {
        formState: { errors },
        handleSubmit,
        watch
    } = methods;

    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }}>
                <SkjemaGruppe>
                    <RHFInput
                        name={"beskrivelse"}
                        label={t("tidligereArbeidsforhold.beskrivelse")}
                    />
                </SkjemaGruppe>

                <div className={"skjemagruppe skjemagruppe__inline"}>
                    <Datovelger
                        name={"fraDato"}
                        label={t("felles.fraDato")}
                        maxDate={watch("tilDato")}
                    />

                    <Datovelger
                        name={"tilDato"}
                        label={t("felles.tilDato")}
                        minDate={watch("fraDato")}
                    />
                </div>

                <Feilmeldinger errors={errors} />

                <section className={"navigasjon-rad"}>
                    <Hovedknapp htmlType={"button"} onClick={handleSubmit(lagre)}>
                        {t("knapp.leggTil")}
                    </Hovedknapp>
                </section>
            </form>
        </FormProvider>
    );
};

export default LeggTilArbeidsforholdSkjema;
