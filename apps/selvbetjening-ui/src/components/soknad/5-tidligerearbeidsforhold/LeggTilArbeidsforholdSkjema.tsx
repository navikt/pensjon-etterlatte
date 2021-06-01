import { SkjemaGruppe } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import Datovelger from "../../felles/Datovelger";
import { ITidligereArbeidsforhold } from "../../../typer/arbeidsforhold";
import RHFInput from "../../felles/RHFInput";

interface Props {
    lagre: (data: ITidligereArbeidsforhold) => void;
}

const LeggTilArbeidsforholdSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<ITidligereArbeidsforhold>();

    const { handleSubmit, watch } = methods;

    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }} onSubmit={handleSubmit(lagre, (err) => console.log(err))}>
                <SkjemaGruppe>
                    <RHFInput
                        name={"beskrivelse"}
                        label={t("tidligereArbeidsforhold.skoleKursArbeidOsv")}
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

                <section className={"navigasjon-rad"}>
                    <Hovedknapp htmlType={"submit"}>{t("knapp.leggTil")}</Hovedknapp>
                </section>
            </form>
        </FormProvider>
    );
};

export default LeggTilArbeidsforholdSkjema;
