import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { Panel, Heading } from "@navikt/ds-react";

const UnderUtdanning = () => {
    const { t } = useTranslation();

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
                    />

                    <Datovelger
                        name={"utdanning.naavaerendeUtdanning.sluttDato"}
                        label={t("dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato")}
                    />
                </SkjemaGruppe>
            </Panel>
        </SkjemaGruppering>
    );
};

export default UnderUtdanning;
