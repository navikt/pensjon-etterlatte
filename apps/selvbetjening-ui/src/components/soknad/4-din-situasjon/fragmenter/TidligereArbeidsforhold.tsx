import "../../../felles/Infokort.less";
import { useTranslation } from "react-i18next";
import { Label, SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { DeleteFilled } from "@navikt/ds-icons";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { ISituasjon } from "../../../../typer/situasjon";
import { Alert, Button, Title } from "@navikt/ds-react";
import { Cell, Grid, Panel } from "@navikt/ds-react";

const TidligereArbeidsforhold = () => {
    const { t } = useTranslation();

    const { control } = useFormContext<ISituasjon>();
    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "tidligereArbeidsforhold",
        shouldUnregister: true,
    });

    return (
        <>
            {/* Steg 4 */}
            <SkjemaGruppe>
                <Title size={"s"}>
                    {t("dinSituasjon.tidligereArbeidsforhold.tittel")}
                </Title>

                <br />

                <Alert variant={"info"} className={"navds-alert--inline"}>
                    {t("dinSituasjon.tidligereArbeidsforhold.info")}
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                {fields.map((field: FieldArrayWithId, index) => (
                    <Panel border key={field.id} className={"luft-under"}>
                        <RHFInput
                            name={`tidligereArbeidsforhold[${index}].beskrivelse` as const}
                            label={t("dinSituasjon.tidligereArbeidsforhold.beskrivelse")}
                        />

                        <Grid>
                            <Cell xs={12} md={4}>
                                <Datovelger
                                    name={`tidligereArbeidsforhold[${index}].fraDato` as const}
                                    label={t("dinSituasjon.tidligereArbeidsforhold.fraDato")}
                                />
                            </Cell>

                            <Cell xs={12} md={4}>
                                <Datovelger
                                    name={`tidligereArbeidsforhold[${index}].tilDato` as const}
                                    label={t("dinSituasjon.tidligereArbeidsforhold.tilDato")}
                                />
                            </Cell>

                            <Cell xs={12} md={4}>
                                <div className={"skjemaelement"}>
                                    <Label htmlFor={""}>&nbsp; {/* Liten hack for å fikse styling */}</Label>
                                    <Button
                                        variant={"danger"}
                                        type={"button"}
                                        className={"skjemaelement"}
                                        onClick={() => remove(index)}
                                    >
                                        <DeleteFilled />
                                        &nbsp; {t("knapp.fjern")}
                                    </Button>
                                </div>
                            </Cell>
                        </Grid>
                    </Panel>
                ))}

                <Button
                    variant={"secondary"}
                    type={"button"}
                    onClick={() => append({}, { shouldFocus: true })}
                >
                    + {t("knapp.leggTil")}
                </Button>
            </SkjemaGruppe>
        </>
    );
};

export default TidligereArbeidsforhold;
