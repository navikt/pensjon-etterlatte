import { RHFRadio } from "../../../felles/RHFRadio";
import { useFormContext } from "react-hook-form";
import { ForholdTilAvdoede, ISoekerOgAvdoed } from "../../../../typer/person";
import GiftMedAvdoede from "./GiftMedAvdoede";
import SamboerMedAvdoede from "./SamboerMedAvdoede";
import SkiltFraAvdoede from "./SkiltFraAvdoede";
import TidligereSamboerMedAvdoede from "./TidligereSamboerMedAvdoede";
import { Alert } from "@navikt/ds-react";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";

const ForholdTilAvdoedeSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const forholdTilAvdoede = watch("forholdTilAvdoede.relasjon");

    return (
        <>
            <RHFRadio
                name={"forholdTilAvdoede.relasjon"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.relasjon")}
                description={
                    <HvorforSpoerVi>
                        {t("omDegOgAvdoed.forholdTilAvdoede.relasjonHvorfor")}
                    </HvorforSpoerVi>
                }
                radios={Object.values(ForholdTilAvdoede).map(value => {
                    return { label: t(value), value } as RadioProps
                })}
            />

            {forholdTilAvdoede === ForholdTilAvdoede.gift && (
                <GiftMedAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.samboer && (
                <SamboerMedAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.skilt && (
                <SkiltFraAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.tidligereSamboer && (
                <TidligereSamboerMedAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.ingen && (
                <SkjemaGruppe>
                    <Alert variant={"warning"}>
                        {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                    </Alert>
                </SkjemaGruppe>
            )}
        </>
    )
};

export default ForholdTilAvdoedeSkjema;
