import Datovelger from "../../../felles/Datovelger";
import { RHFRadio, RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import SamboerSkjema from "./SamboerSkjema";
import { Alert } from "@navikt/ds-react";
import { ISoeker, OpploesningAarsak } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { SkjemaGruppe } from "nav-frontend-skjema";

const NyttSamboerskap = ({ gyldigVarighet }: { gyldigVarighet?: IValg }) => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const samboerskapOpploest = watch("nySivilstatus.samboerskap.samboerskapOpploest");
    const aarsakForOpploesningen = watch("nySivilstatus.samboerskap.aarsakForOpploesningen");
    const hattBarnEllerVaertGift = watch("nySivilstatus.samboerskap.hattBarnEllerVaertGift");

    return (
        <>
            <SkjemaGruppe>
                <Datovelger
                    name={"nySivilstatus.samboerskap.inngaattDato"}
                    label={t("omDegOgAvdoed.nySivilstatus.samboerskap.inngaattDato")}
                    maxDate={new Date()}
                />
            </SkjemaGruppe>

            <RHFSpoersmaalRadio
                name={"nySivilstatus.samboerskap.hattBarnEllerVaertGift"}
                legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift")}
            />

            {hattBarnEllerVaertGift === IValg.NEI && <SamboerSkjema />}

            {hattBarnEllerVaertGift === IValg.JA && (
                <>
                    <RHFSpoersmaalRadio
                        name={"nySivilstatus.samboerskap.samboerskapOpploest"}
                        legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.samboerskapOpploest")}
                    />
                    {/*"Er dette samboerskapet oppløst?"*/}

                    {/* TODO: Fix radio keys */}
                    {samboerskapOpploest === IValg.JA && (
                        <RHFRadio
                            name={"nySivilstatus.samboerskap.aarsakForOpploesningen"}
                            legend={t("omDegOgAvdoed.nySivilstatus.samboerskap.aarsakForOpploesningen")}
                            radios={[
                                {
                                    label: t("omDegOgAvdoed.nySivilstatus.aarsakOpploesning.dødsfall"),
                                    value: OpploesningAarsak.doedsfall,
                                },
                                {
                                    label: t("omDegOgAvdoed.nySivilstatus.aarsakOpploesning.samlivsbrudd"),
                                    value: OpploesningAarsak.samlivsbrudd,
                                },
                            ]}
                        />
                    )}
                </>
            )}

            {aarsakForOpploesningen === OpploesningAarsak.samlivsbrudd && (
                <SkjemaGruppe>
                    <Datovelger
                        name={"nySivilstatus.samboerskap.opploestDato"}
                        label={t("omDegOgAvdoed.nySivilstatus.samboerskap.opploestDato")}
                        maxDate={new Date()}
                    />
                </SkjemaGruppe>
            )}

            {gyldigVarighet === IValg.NEI && (
                <Alert variant={"warning"}>
                    {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                </Alert>
            )}
        </>
    );
};

export default NyttSamboerskap;
