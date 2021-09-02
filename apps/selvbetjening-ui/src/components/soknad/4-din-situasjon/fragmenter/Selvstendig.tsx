import { RHFInput } from "../../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import { Title } from "@navikt/ds-react";

const Selvstendig = () => {
    const { t } = useTranslation();

    return (
        <>
            <SkjemaGruppe>
                <Title size={"s"}>
                    {t("dinSituasjon.selvstendig.tittel")}
                </Title>
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFInput
                    className={"kol-75"}
                    name={"selvstendig.beskrivelse"}
                    label={t("dinSituasjon.selvstendig.beskrivelse")}
                />

                <Datovelger
                    name={"selvstendig.startDato"}
                    label={t("dinSituasjon.selvstendig.startDato")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.type"}
                    label={t("dinSituasjon.selvstendig.type")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.endringIfmDoedsfall"}
                    label={t("dinSituasjon.selvstendig.endringIfmDoedsfall")}
                    placeholder={t("dinSituasjon.selvstendig.endringIfmDoedsfallPlaceholder")}
                />
            </SkjemaGruppe>
        </>
    );
}

export default Selvstendig;
