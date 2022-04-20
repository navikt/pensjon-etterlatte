import { FC, useState } from "react";
//import { v4 as uuid } from "uuid";
import { Collapse, Expand } from "@navikt/ds-icons";
import { BodyLong } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { LogEvents, useAmplitude } from "../../utils/amplitude";

const HvorforSpoerVi: FC<{title: string, children: any}> = ({ title, children }) => {
    //const id = uuid();
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
        <div className={"hvorforPanel"} /*id={id}*/>
            <button
                data-testid="hvorforPanel_toggle"
                type={"button"}
                className={"hvorforPanel__toggle"}
                onClick={click}
                aria-expanded={erApen}
            >
                <span>{t("hvorforSpoerVi")}</span>
                <span>{erApen ? <Collapse /> : <Expand />}</span>
            </button>

            {erApen && (
                <div className={"hvorforPanel__innhold"}>
                    <BodyLong>{children}</BodyLong>
                </div>
            )}
        </div>
    );
};

export default HvorforSpoerVi;
