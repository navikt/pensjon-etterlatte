import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "../../../felles/SkjemaGruppe";
import { ISoeker, SamboerInntekt } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { RHFFoedselsnummerInput, RHFInput, RHFNumberInput } from "../../../felles/rhf/RHFInput";
import { RHFSpoersmaalRadio } from "../../../felles/rhf/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { fnr } from "@navikt/fnrvalidator";
import {RHFCheckboksGruppe} from "../../../felles/rhf/RHFCheckboksPanelGruppe";
import { Panel, Heading, Grid, Cell } from "@navikt/ds-react";
import { SkjemaElement } from "../../../felles/SkjemaElement";
import Bredde from "../../../../typer/bredde";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const harVaertGift = watch("nySivilstatus.samboerskap.hattBarnEllerVaertGift");
    const samboerHarInntekt = watch("nySivilstatus.samboerskap.samboer.harInntekt.svar");

    return (
        <Panel border>
            <SkjemaElement>
                <Heading size={"small"}>{t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.tittel")}</Heading>
            </SkjemaElement>

            <SkjemaElement>
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
            </SkjemaElement>

            <SkjemaElement>
                <RHFFoedselsnummerInput
                    name={"nySivilstatus.samboerskap.samboer.foedselsnummer"}
                    htmlSize={Bredde.S}
                    label={t("felles.fnr")}
                    placeholder={t("felles.fnrPlaceholder")}
                    rules={{ validate: (value) => fnr(value).status === "valid" }}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={"nySivilstatus.samboerskap.hattBarnEllerVaertGift"}
                    legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift")}
                />
            </SkjemaElement>

            {harVaertGift === IValg.NEI && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={"nySivilstatus.samboerskap.samboer.harInntekt.svar"}
                        legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar")}
                    />
                </SkjemaElement>
            )}

            {samboerHarInntekt === IValg.JA && (
                <>
                    <RHFCheckboksGruppe
                        legend={''}
                        name={"nySivilstatus.samboerskap.samboer.harInntekt.inntektstype"}
                        checkboxes={Object.values(SamboerInntekt).map((type) => {
                            return {
                                value: type,
                                children: t(type),
                                required: true
                            };
                        })}
                    />

                    <SkjemaElement>
                        <RHFNumberInput
                            name={"nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"}
                            type="tel"
                            htmlSize={Bredde.S}
                            label={t(
                                "omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"
                            )}
                            placeholder={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar")}
                        />
                    </SkjemaElement>
                </>
            )}
        </Panel>
    );
};

export default SamboerSkjema;
