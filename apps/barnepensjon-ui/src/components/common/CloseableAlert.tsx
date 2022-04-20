import { Close } from '@navikt/ds-icons'
import { Alert, Button } from '@navikt/ds-react'
import React from 'react'
import styled from 'styled-components'
import useTranslation from '../../hooks/useTranslation'

const LogOutAlertButton = styled(Button)`
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

const AlertContent = styled.div`
    margin: 0 2rem 0 0.2rem;
`

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    onClose: () => void
}

export default function CloseableAlert({ children, onClose, ...rest }: AlertProps) {
    const { t } = useTranslation('logOutUser')

    return (
        <Alert size={'medium'} variant={'warning'} {...rest}>
            <LogOutAlertButton size="small" variant="tertiary" aria-label="lukk melding" onClick={onClose}>
                <Close title={t('btn')} />
            </LogOutAlertButton>

            <AlertContent>{children}</AlertContent>
        </Alert>
    )
}
