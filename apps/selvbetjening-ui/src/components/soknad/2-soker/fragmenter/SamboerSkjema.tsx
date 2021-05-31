import { useTranslation } from "react-i18next";
import { CheckboksPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { ISoeker, SamboerInntekt } from "../../../../typer/person";
import { Undertittel } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { Controller, useFormContext } from "react-hook-form";
import RHFInput from "../../../felles/RHFInput";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import IValg from "../../../../typer/IValg";
import { fnr } from "@navikt/fnrvalidator";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { control, watch } = useFormContext<ISoeker>();

    const samboerHarInntekt = watch("samboer.harInntekt")

    const handleSelect = (inntektstype: SamboerInntekt[], name: SamboerInntekt) => {
        return inntektstype?.includes(name)
            ? inntektstype?.filter(value => value !== name)
            : [...(inntektstype ?? []), name];
    }

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

            <RHFToValgRadio
                name={"samboer.hattBarnEllerVaertGift"}
                legend={t("omSoekeren.harHattBarnEllerVaertGiftMedSamboer")}
            />

            {/* 2.17 */}
            <RHFToValgRadio
                name={"samboer.harInntekt"}
                legend={t("omSoekeren.harSamboerInntekt.tittel")}
            />

            {samboerHarInntekt === IValg.JA && (
                <>
                    <SkjemaGruppe className={"inputPanelGruppe"}>
                        <Controller
                            name={"samboer.inntektstype"}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <CheckboksPanelGruppe
                                    checkboxes={Object.values(SamboerInntekt).map((type) => {
                                        return {
                                            name: type,
                                            label: t(`omSoekeren.harSamboerInntekt.${type}`),
                                            checked: (value as SamboerInntekt[])?.includes(type)
                                        }
                                    })}
                                    onChange={(e) => onChange(
                                        handleSelect(value, ((e.target as HTMLInputElement).name as SamboerInntekt))
                                    )}
                                />
                            )}
                        />
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <RHFInput
                            name={"samboer.samletBruttoinntektPrAar"}
                            label={t("omSoekeren.harSamboerInntekt.bruttoinntekt")}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </Panel>
    );
};

export default SamboerSkjema;
