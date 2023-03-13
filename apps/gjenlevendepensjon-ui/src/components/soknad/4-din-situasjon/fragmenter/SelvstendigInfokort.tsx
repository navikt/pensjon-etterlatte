import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Panel } from "@navikt/ds-react";
import { RHFInput, RHFNumberInput } from "../../../felles/rhf/RHFInput";
import { RHFSpoersmaalRadio } from "../../../felles/rhf/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { DeleteFilled } from "@navikt/ds-icons";
import { useFormContext } from "react-hook-form";
import { SkjemaElement } from "../../../felles/SkjemaElement";
import Bredde from "../../../../typer/bredde";

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

            <SkjemaElement>
                <RHFNumberInput
                    name={`selvstendig[${index}].orgnr` as const}
                    placeholder={t("dinSituasjon.selvstendig.orgnrplaceholder")}
                    label={t("dinSituasjon.selvstendig.orgnr")}
                    maxLength={9}
                    minLength={9}
                    htmlSize={Bredde.S}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`selvstendig[${index}].forventerEndretInntekt.svar` as const}
                    legend={t("dinSituasjon.selvstendig.forventerEndretInntekt.svar")}
                    vetIkke
                />
            </SkjemaElement>

            {endretInntekt === IValg.JA && (
                <SkjemaElement>
                    <RHFInput
                        name={`selvstendig[${index}].forventerEndretInntekt.beskrivelse` as const}
                        label={t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse")}
                        placeholder={t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelsePlaceholder")}
                        maxLength={200}
                    />
                </SkjemaElement>
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
