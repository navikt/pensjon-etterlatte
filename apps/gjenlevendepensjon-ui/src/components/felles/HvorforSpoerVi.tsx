import { FC, useState } from "react";
import { Collapse, Expand } from "@navikt/ds-icons";
import { BodyLong } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { LogEvents, useAmplitude } from "../../utils/amplitude";
import {HvorforPanelButton, HvorforPanelInnhold} from "./StyledComponents";

const HvorforSpoerVi: FC<{title: string, children: any}> = ({ title, children }) => {
    const [erApen, setErApen] = useState(false);
    const { t } = useTranslation();
    const { logEvent } = useAmplitude();

    const click = () => {
        if (!erApen) {
            logEvent(LogEvents.KLIKK, { type: "hvorfor spør vi", title });
        }
        setErApen(!erApen);
    };

    return (
        <div>
            <HvorforPanelButton
                data-testid="hvorforPanel_toggle"
                type={"button"}
                onClick={click}
                aria-expanded={erApen}
            >
                <span>{t("hvorforSpoerVi")}</span>
                <span>{erApen ? <Collapse /> : <Expand />}</span>
            </HvorforPanelButton>

            {erApen && (
                <HvorforPanelInnhold>
                    <BodyLong>{children}</BodyLong>
                </HvorforPanelInnhold>
            )}
        </div>
    );
};

export default HvorforSpoerVi;
