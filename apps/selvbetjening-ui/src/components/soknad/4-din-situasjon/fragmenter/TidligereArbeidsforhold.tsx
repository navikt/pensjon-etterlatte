import "../../../felles/Infokort.less";
import { Undertittel } from "nav-frontend-typografi";
import { Fareknapp, Flatknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { Label, SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { DeleteFilled } from "@navikt/ds-icons";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { ISituasjon } from "../../../../typer/situasjon";
import { Alert } from "@navikt/ds-react";
import Panel from "nav-frontend-paneler";
import { Cell, Grid } from "@navikt/ds-react";

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
                <Undertittel>{t("dinSituasjon.tidligereArbeidsforhold.tittel")}</Undertittel>

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
                                    <Fareknapp
                                        htmlType={"button"}
                                        className={"skjemaelement"}
                                        onClick={() => remove(index)}
                                    >
                                        <DeleteFilled />
                                        &nbsp; {t("knapp.fjern")}
                                    </Fareknapp>
                                </div>
                            </Cell>
                        </Grid>
                    </Panel>
                ))}

                <Flatknapp htmlType={"button"} onClick={() => append({}, { shouldFocus: true })}>
                    + {t("knapp.leggTil")}
                </Flatknapp>
            </SkjemaGruppe>
        </>
    );
};

export default TidligereArbeidsforhold;
