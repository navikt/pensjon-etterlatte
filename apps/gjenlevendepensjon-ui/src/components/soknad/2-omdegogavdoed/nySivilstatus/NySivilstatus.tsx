import { RHFRadio } from "../../../felles/RHFRadio";
import { ISoeker, Sivilstatus } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BodyLong, Heading, RadioProps } from "@navikt/ds-react";
import SamboerSkjema from "./SamboerSkjema";
import { SkjemaElement } from "../../../felles/SkjemaElement";
import {SkjemaGruppe} from "../../../felles/SkjemaGruppe";

const NySivilstatus = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const sivilstatus = watch("nySivilstatus.sivilstatus");
    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={"small"}>{t("omDegOgAvdoed.nySivilstatus.sivilstatus")}</Heading>

                <BodyLong>{t("omDegOgAvdoed.nySivilstatus.beskrivelse")}</BodyLong>
            </SkjemaElement>

            <RHFRadio
                legend={''}
                name={"nySivilstatus.sivilstatus"}
                children={Object.values(Sivilstatus).map((value) => {
                    return { children: t(value), value, required: true } as RadioProps;
                })}
            />

            {sivilstatus === Sivilstatus.samboerskap && <SamboerSkjema/>}
        </SkjemaGruppe>
    );
};

export default NySivilstatus;
