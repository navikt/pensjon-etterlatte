import { FC, useState } from "react";
import { Collapse, Expand } from "@navikt/ds-icons";
import { BodyLong } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { LogEvents, useAmplitude } from "../../utils/amplitude";
import styled from "styled-components";

const ToggleButton = styled.button`
    color: #0067c5;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0.2rem 0;
    min-height: 0;
    margin: 0;
    cursor: pointer;
    border-radius: 0.25rem;
`

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
            <ToggleButton
                data-testid="hvorforPanel_toggle"
                type={"button"}
                onClick={click}
                aria-expanded={erApen}
            >
                <span>{t("hvorforSpoerVi")}</span>
                <span>{erApen ? <Collapse /> : <Expand />}</span>
            </ToggleButton>

            {erApen && (
                <BodyLong>{children}</BodyLong>
            )}
        </div>
    );
};

export default HvorforSpoerVi;
