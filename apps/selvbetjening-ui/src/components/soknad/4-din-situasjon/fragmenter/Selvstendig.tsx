import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { Button, Heading } from "@navikt/ds-react";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { useEffect } from "react";
import SelvstendigInfokort from "./SelvstendigInfokort";

const Selvstendig = () => {
    const { t } = useTranslation();
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "selvstendig",
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
                <Heading size={"small"}>{t("dinSituasjon.selvstendig.tittel")}</Heading>
            </SkjemaGruppe>

            {fields.map((field: FieldArrayWithId, index: number) => (
                <SelvstendigInfokort key={field.id} lengde={fields.length} index={index} fjern={remove}/>
            ))}

            <Button variant={"secondary"} type={"button"} onClick={() => append({}, { shouldFocus: true })}>
                + {t("knapp.leggTilNaeringer")}
            </Button>
        </SkjemaGruppering>
    );
};

export default Selvstendig;
