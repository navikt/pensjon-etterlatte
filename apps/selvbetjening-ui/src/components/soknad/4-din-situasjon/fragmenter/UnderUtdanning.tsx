import { Undertittel } from "nav-frontend-typografi";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";

const UnderUtdanning = () => {
    const { t } = useTranslation();

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>
                    {t("dinSituasjon.utdanning.tittel")}
                </Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"utdanning.naavaerendeUtdanning.navn"}
                    label={t("dinSituasjon.utdanning.naavaerendeUtdanning.navn")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <Datovelger
                    name={"utdanning.naavaerendeUtdanning.startDato"}
                    label={t("dinSituasjon.utdanning.naavaerendeUtdanning.startDato")}
                />

                <Datovelger
                    name={"utdanning.naavaerendeUtdanning.sluttDato"}
                    label={t("dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato")}
                />
            </SkjemaGruppe>
        </>
    )
}

export default UnderUtdanning;
