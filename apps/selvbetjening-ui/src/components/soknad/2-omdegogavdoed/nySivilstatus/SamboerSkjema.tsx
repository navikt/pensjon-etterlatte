import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ISoeker, SamboerInntekt } from "../../../../typer/person";
import { Undertittel } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { useFormContext } from "react-hook-form";
import { RHFInput } from "../../../felles/RHFInput";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { fnr } from "@navikt/fnrvalidator";
import { RHFCheckboksPanelGruppe } from "../../../felles/RHFCheckboksPanelGruppe";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const samboerHarInntekt = watch("nySivilstatus.samboerskap.samboer.harInntekt.svar")

    return (
        <Panel border>
            <Undertittel>{t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.tittel")}</Undertittel>

            <br/>

            {/* 2.16 */}
            <SkjemaGruppe>
                <RHFInput
                    name={"nySivilstatus.samboerskap.samboer.navn"}
                    bredde={"XL"}
                    label={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.navn")}
                />

                <RHFInput
                    name={"nySivilstatus.samboerskap.samboer.foedselsnummer"}
                    bredde={"S"}
                    label={t("felles.fnr")}
                    rules={{ validate: (value) => (fnr(value).status === 'valid') }}
                />
            </SkjemaGruppe>

            {/* 2.17 */}
            <RHFSpoersmaalRadio
                name={"nySivilstatus.samboerskap.samboer.harInntekt.svar"}
                legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar")}
            />

            {samboerHarInntekt === IValg.JA && (
                <>
                    <RHFCheckboksPanelGruppe
                        name={"nySivilstatus.samboerskap.samboer.harInntekt.inntektstype"}
                        checkboxes={Object.values(SamboerInntekt).map((type) => {
                            return {
                                value: type,
                                label: t(type),
                            }
                        })}
                    />

                    <SkjemaGruppe>
                        <RHFInput
                            name={"nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"}
                            bredde={"S"}
                            label={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar")}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </Panel>
    );
};

export default SamboerSkjema;
