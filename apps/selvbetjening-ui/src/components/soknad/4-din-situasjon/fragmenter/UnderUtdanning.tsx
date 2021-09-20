import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";

const UnderUtdanning = () => {
    const { t } = useTranslation();

    return (
        <SkjemaGruppering>
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
        </SkjemaGruppering>
    );
};

export default UnderUtdanning;
