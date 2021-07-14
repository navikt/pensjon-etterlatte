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
import AlertStripe from "nav-frontend-alertstriper";
import Panel from "nav-frontend-paneler";
import { Cell, Grid } from "@navikt/ds-react";

const TidligereArbeidsforhold = () => {
    const { t } = useTranslation();

    const { control } = useFormContext<ISituasjon>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tidligereArbeidsforhold",
        shouldUnregister: true
    });

    return (
        <>
            {/* Steg 4 */}
            <SkjemaGruppe>
                <Undertittel>{t("tidligereArbeidsforhold.tittel")}</Undertittel>

                <br/>

                <AlertStripe type={"info"} form={"inline"}>
                    Dersom du de siste 10 årene har vært i arbeid (deltid, heltid, vikariat, osv) er det viktig at du
                    oppgir dette. Klikk på "Legg til" under for å legge til tidligere arbeidsforhold.
                </AlertStripe>
            </SkjemaGruppe>

            <SkjemaGruppe>
                {fields.map((field: FieldArrayWithId, index) => (
                    <Panel border key={field.id} className={"luft-under"}>
                        <RHFInput
                            name={`tidligereArbeidsforhold[${index}].beskrivelse` as const}
                            label={"Beskrivelse"}
                        />

                        <Grid>
                            <Cell xs={12} md={4}>
                                <Datovelger
                                    name={`tidligereArbeidsforhold[${index}].fraDato` as const}
                                    label={"Fra"}
                                />
                            </Cell>

                            <Cell xs={12} md={4}>
                                <Datovelger
                                    name={`tidligereArbeidsforhold[${index}].tilDato` as const}
                                    label={"Til"}
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
                                        <DeleteFilled/>&nbsp; Fjern
                                    </Fareknapp>
                                </div>
                            </Cell>
                        </Grid>
                    </Panel>
                ))}

                {/* @ts-ignore */}
                <Flatknapp htmlType={"button"} onClick={() => append({}, { shouldFocus: true })}>
                    + Legg til
                </Flatknapp>
            </SkjemaGruppe>
        </>
    );
};

export default TidligereArbeidsforhold;
