import { SkjemaGruppe } from "nav-frontend-skjema";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Title } from "@navikt/ds-react";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import ArbeidstakerInfokort from "./ArbeidstakerInfokort"
import { useEffect } from "react";


const Arbeidstaker = () => {
    const { t } = useTranslation();

    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "dinSituasjon.arbeidsforhold",
        shouldUnregister: true,
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({});
        }
    });

    return (
        <SkjemaGruppering>
            <SkjemaGruppe>
                <Title size={"s"}>{t("dinSituasjon.arbeidsforhold.tittel")}</Title>
            </SkjemaGruppe>

            {fields.map((field: FieldArrayWithId, index: number) => (
                <ArbeidstakerInfokort key={field.id} lengde={fields.length} index={index} fjern={remove}/>
            ))}

            <Button variant={"secondary"} type={"button"} onClick={() => append({}, { shouldFocus: true })}>
                + {t("knapp.leggTil")}
            </Button>
        </SkjemaGruppering>
    );
};

export default Arbeidstaker;
