import React, { forwardRef } from "react";
import cl from "classnames";
import { Close, InformationFilled } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";


export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    onClose: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({ children, onClose, className, ...rest }, ref) => {
  const { t } = useTranslation();
  
  return (
    <div {...rest} ref={ref} className={cl(className, "navds-alert", `navds-alert--warning`, `navds-alert--medium`)}>
        <Button
            className={"utlogging-alert__button"}
            size="small"
            variant="tertiary"
            aria-label="lukk melding"
            onClick={onClose}
        >
            <Close title={t("brukerLoggesUt.knapp")} />
        </Button>
        <InformationFilled title={`warning-ikon`} className="navds-alert__icon" />
        <div className="navds-alert__wrapper">{children}</div>
    </div>
)});

export default Alert;
