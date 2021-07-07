import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ISoeker, SamboerInntekt } from "../../../../../typer/person";
import { Undertittel } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { useFormContext } from "react-hook-form";
import { RHFInput } from "../../../../felles/RHFInput";
import { RHFToValgRadio } from "../../../../felles/RHFRadio";
import { IValg } from "../../../../../typer/Spoersmaal";
import { fnr } from "@navikt/fnrvalidator";
import { RHFCheckboksPanelGruppe } from "../../../../felles/RHFCheckboksPanelGruppe";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const samboerHarInntekt = watch("samboer.harInntekt.svar")

    return (
        <Panel border>
            <Undertittel>Opplysninger om samboer</Undertittel>

            <br/>

            {/* 2.16 */}
            <SkjemaGruppe>
                <RHFInput
                    name={"samboer.navn"}
                    label={t("omSoekeren.oppgiNavnSamboer")}
                />

                <RHFInput
                    name={"samboer.foedselsnummer"}
                    label={t("felles.fnr")}
                    rules={{ validate: (value) => (fnr(value).status === 'valid') }}
                />
            </SkjemaGruppe>

            {/* 2.17 */}
            <RHFToValgRadio
                name={"samboer.harInntekt.svar"}
                legend={t("omSoekeren.harSamboerInntekt.tittel")}
            />

            {samboerHarInntekt === IValg.JA && (
                <>
                    <RHFCheckboksPanelGruppe
                        name={"samboer.harInntekt.inntektstype"}
                        checkboxes={Object.values(SamboerInntekt).map((type) => {
                            return {
                                value: type,
                                label: t(`omSoekeren.harSamboerInntekt.${type}`),
                            }
                        })}
                    />

                    <SkjemaGruppe>
                        <RHFInput
                            name={"samboer.harInntekt.samletBruttoinntektPrAar"}
                            label={t("omSoekeren.harSamboerInntekt.bruttoinntekt")}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </Panel>
    );
};

export default SamboerSkjema;
