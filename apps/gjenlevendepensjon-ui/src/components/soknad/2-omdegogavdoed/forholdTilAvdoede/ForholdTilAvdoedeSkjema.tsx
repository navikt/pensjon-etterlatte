import { RHFRadio } from "../../../felles/rhf/RHFRadio";
import { useFormContext } from "react-hook-form";
import { ForholdTilAvdoede, ISoekerOgAvdoed } from "../../../../typer/person";
import GiftMedAvdoede from "./GiftMedAvdoede";
import SamboerMedAvdoede from "./SamboerMedAvdoede";
import SkiltFraAvdoede from "./SkiltFraAvdoede";
import TidligereSamboerMedAvdoede from "./TidligereSamboerMedAvdoede";
import { RadioProps } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

const ForholdTilAvdoedeSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const forholdTilAvdoede = watch("forholdTilAvdoede.relasjon");

    return (
        <>
            <RHFRadio
                name={"forholdTilAvdoede.relasjon"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.relasjon")}
                children={Object.values(ForholdTilAvdoede).map((value) => {
                    return { children: t(value), value, required: true } as RadioProps;
                })}
            />
            {/** Gift og Separert gir samme etterfølgende spørsmål */}
            {forholdTilAvdoede === ForholdTilAvdoede.gift && <GiftMedAvdoede />}

            {forholdTilAvdoede === ForholdTilAvdoede.separert && <GiftMedAvdoede />}

            {forholdTilAvdoede === ForholdTilAvdoede.skilt && <SkiltFraAvdoede />}

            {forholdTilAvdoede === ForholdTilAvdoede.samboer && <SamboerMedAvdoede />}

            {forholdTilAvdoede === ForholdTilAvdoede.tidligereSamboer && <TidligereSamboerMedAvdoede />}
        </>
    );
};

export default ForholdTilAvdoedeSkjema;
