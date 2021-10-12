import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { Heading, Panel } from "@navikt/ds-react";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";

const UnderUtdanning = () => {
    const { t } = useTranslation();
    const { state } = useBrukerContext();

    return (
        <SkjemaGruppering>

            <SkjemaGruppe>
                <Heading size={"small"}>{t("dinSituasjon.utdanning.tittel")}</Heading>
            </SkjemaGruppe>

            <Panel border>
                <RHFInput
                    name={"utdanning.naavaerendeUtdanning.navn"}
                    label={t("dinSituasjon.utdanning.naavaerendeUtdanning.navn")}
                    placeholder={t("dinSituasjon.utdanning.naavaerendeUtdanning.navnPlaceholder")}
                />

                <SkjemaGruppe className={"rad"}>
                    <Datovelger
                        name={"utdanning.naavaerendeUtdanning.startDato"}
                        label={t("dinSituasjon.utdanning.naavaerendeUtdanning.startDato")}
                        minDate={state.foedselsdato}
                        maxDate={new Date()}
                    />

                    <Datovelger
                        name={"utdanning.naavaerendeUtdanning.sluttDato"}
                        label={t("dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato")}
                        minDate={new Date()}
                    />
                </SkjemaGruppe>
            </Panel>
        </SkjemaGruppering>
    );
};

export default UnderUtdanning;
