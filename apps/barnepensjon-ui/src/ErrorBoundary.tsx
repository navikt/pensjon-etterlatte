import { Alert, Box, HStack, VStack } from '@navikt/ds-react'
import ErrorStackParser from 'error-stack-parser'
import React, { ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { logger } from '~utils/logger'

type Props = {
    children: React.JSX.Element
}

class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const stackFrames = ErrorStackParser.parse(error)
        if (stackFrames.length > 0) {
            const stackFrame = stackFrames[0]
            try {
                logger.error({
                    lineno: stackFrame.lineNumber!,
                    columnno: stackFrame.columnNumber!,
                    message: error.message,
                    error: JSON.stringify(error),
                })
            } catch {
                logger.generalError({ err: error, errorInfo })
            }
        } else {
            logger.generalError({ err: error, errorInfo })
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <HStack justify="center" marginBlock="8">
                    <VStack gap="4" maxWidth="fit-content">
                        <Alert variant="error">En feil har oppstått og blitt logget.</Alert>
                        <Link to="/" onClick={() => this.setState({ hasError: false })}>
                            Gå til hovedskjermen
                        </Link>
                    </VStack>
                </HStack>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
