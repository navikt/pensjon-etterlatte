import { Alert, Panel, Title } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

const SideIkkeFunnet = () => {
    const { t } = useTranslation();
    return (
        <Panel>
            <Title size={"m"}>{t("sideIkkeFunnet.tittel")}</Title>

            <br />
            <Alert variant={"warning"}>{t("sideIkkeFunnet.alert")}</Alert>
        </Panel>
    );
};

export default SideIkkeFunnet;
