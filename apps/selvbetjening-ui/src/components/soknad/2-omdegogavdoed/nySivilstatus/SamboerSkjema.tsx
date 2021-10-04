import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ISoeker, SamboerInntekt } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { RHFInput } from "../../../felles/RHFInput";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { fnr } from "@navikt/fnrvalidator";
import { RHFCheckboksPanelGruppe } from "../../../felles/RHFCheckboksPanelGruppe";
import { Panel, Title } from "@navikt/ds-react";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const harVaertGift = watch("nySivilstatus.samboerskap.hattBarnEllerVaertGift");
    const samboerHarInntekt = watch("nySivilstatus.samboerskap.samboer.harInntekt.svar");

    return (
        <Panel border>
            <SkjemaGruppe>
                <Title size={"s"}>{t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.tittel")}</Title>
            </SkjemaGruppe>

            <RHFInput
                name={"nySivilstatus.samboerskap.samboer.navn"}
                bredde={"XL"}
                label={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.navn")}
            />

            <RHFInput
                name={"nySivilstatus.samboerskap.samboer.foedselsnummer"}
                bredde={"S"}
                label={t("felles.fnr")}
                placeholder={t("felles.fnrPlaceholder")}
                rules={{ validate: (value) => fnr(value).status === "valid" }}
            />

            <RHFSpoersmaalRadio
                name={"nySivilstatus.samboerskap.hattBarnEllerVaertGift"}
                legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift")}
            />


            {harVaertGift === IValg.NEI && (
                <RHFSpoersmaalRadio
                    name={"nySivilstatus.samboerskap.samboer.harInntekt.svar"}
                    legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar")}
                />
            )}

            {samboerHarInntekt === IValg.JA && (
                <>
                    <RHFCheckboksPanelGruppe
                        name={"nySivilstatus.samboerskap.samboer.harInntekt.inntektstype"}
                        checkboxes={Object.values(SamboerInntekt).map((type) => {
                            return {
                                value: type,
                                label: t(type),
                            };
                        })}
                    />

                    <SkjemaGruppe>
                        <RHFInput
                            name={"nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"}
                            bredde={"S"}
                            label={t(
                                "omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"
                            )}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </Panel>

    );
};

export default SamboerSkjema;
