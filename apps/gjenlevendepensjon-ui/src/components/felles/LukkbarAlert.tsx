import React, { forwardRef } from "react";
import { Close } from "@navikt/ds-icons";
import { Alert, Button } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const UtloggingAlertButton = styled(Button)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  padding: 0.5rem;
  
  svg {
    height: 1.5rem;
    width: 1.5rem;
  }
`

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    onClose: () => void;
}

const LukkbarAlert = forwardRef<HTMLDivElement, AlertProps>(({ children, onClose, ...rest }, ref) => {
    const { t } = useTranslation();

    return (
        <Alert {...rest} ref={ref} role={'alert'} size={'medium'} variant={'warning'}>
            <UtloggingAlertButton size="small" variant="tertiary" aria-label="lukk melding" onClick={onClose}>
                <Close title={t('brukerLoggesUt.knapp')} />
            </UtloggingAlertButton>
            <div className="navds-alert__wrapper">{children}</div>
        </Alert>
    )
});

export default LukkbarAlert;
