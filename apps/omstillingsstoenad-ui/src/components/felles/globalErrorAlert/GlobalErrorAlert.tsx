import './globalErrorAlert.css'
import { Alert } from '@navikt/ds-react'
import { ReactNode } from 'react'

export const GlobalErrorAlert = ({ message }: { message: ReactNode | Array<ReactNode> }) => {
    return (
        <div className="global-error-alert">
            <Alert variant="error">{message}</Alert>
        </div>
    )
}
