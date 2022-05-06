import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ISoeker, SamboerInntekt } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { RHFFoedselsnummerInput, RHFInput, RHFNumberInput } from "../../../felles/RHFInput";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { fnr } from "@navikt/fnrvalidator";
import { RHFCheckboksPanelGruppe } from "../../../felles/RHFCheckboksPanelGruppe";
import { Panel, Heading, Grid, Cell } from "@navikt/ds-react";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const harVaertGift = watch("nySivilstatus.samboerskap.hattBarnEllerVaertGift");
    const samboerHarInntekt = watch("nySivilstatus.samboerskap.samboer.harInntekt.svar");

    return (
        <Panel border>
            <SkjemaGruppe>
                <Heading size={"small"}>{t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.tittel")}</Heading>
            </SkjemaGruppe>

            <Grid>
                <Cell xs={12} md={6}>
                    <RHFInput
                        className={"kol-50"}
                        name={"nySivilstatus.samboerskap.samboer.fornavn"}
                        label={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.fornavn")}
                    />
                </Cell>
                <Cell xs={12} md={6}>
                    <RHFInput
                        className={"kol-50"}
                        name={"nySivilstatus.samboerskap.samboer.etternavn"}
                        label={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.etternavn")}
                    />
                </Cell>
            </Grid>

            <RHFFoedselsnummerInput
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
                                required: true
                            };
                        })}
                    />

                    <SkjemaGruppe>
                        <RHFNumberInput
                            name={"nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"}
                            type="tel"
                            bredde={"S"}
                            label={t(
                                "omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"
                            )}
                            placeholder={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar")}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </Panel>
    );
};

export default SamboerSkjema;
