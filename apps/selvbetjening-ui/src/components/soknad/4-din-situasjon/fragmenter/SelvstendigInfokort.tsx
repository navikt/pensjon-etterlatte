import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Panel } from "@navikt/ds-react";
import { RHFInput, RHFNumberInput } from "../../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { DeleteFilled } from "@navikt/ds-icons";
import { useFormContext } from "react-hook-form";

interface Props {
    lengde: number;
    index: number;
    fjern: (index: number) => void;
}

const SelvstendigInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation();

    const { watch } = useFormContext();
    const endretInntekt = watch(`selvstendig[${index}].forventerEndretInntekt.svar`)

    return (
        <Panel border className={"luft-under"}>

            <RHFInput
                className={"kol-75"}
                name={`selvstendig[${index}].beskrivelse` as const}
                label={t("dinSituasjon.selvstendig.beskrivelse")}
            />

            <SkjemaGruppe>
                <RHFNumberInput
                    name={`selvstendig[${index}].orgnr` as const}
                    placeholder={t("dinSituasjon.selvstendig.orgnrplaceholder")}
                    label={t("dinSituasjon.selvstendig.orgnr")}
                    maxLength={9}
                    minLength={9}
                />
            </SkjemaGruppe>

            <RHFSpoersmaalRadio
                name={`selvstendig[${index}].forventerEndretInntekt.svar` as const}
                legend={t("dinSituasjon.selvstendig.forventerEndretInntekt.svar")}
                vetIkke
            />

            {endretInntekt === IValg.JA && (
                <RHFInput
                    name={`selvstendig[${index}].forventerEndretInntekt.beskrivelse` as const}
                    bredde={"S"}
                    label={t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse")}
                    placeholder={t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelsePlaceholder")}
                    maxLength={200}
                />

            )}

            {lengde > 1 && (
                <div style={{ textAlign: "right" }}>
                    <Button variant={"secondary"} type={"button"} onClick={() => fjern(index)}>
                        <DeleteFilled/> &nbsp;{t("knapp.fjern")}
                    </Button>
                </div>
            )}

        </Panel>
    )
})

export default SelvstendigInfokort;
