import { BodyLong, Detail, Heading, HStack, Link, List, VStack } from '@navikt/ds-react'
import ErrorStackParser from 'error-stack-parser'
import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import { logger } from './logger/logger.ts'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { Spraak } from './spraak/spraak.ts'
import { SpraakVelger } from './spraakVelger/SpraakVelger.tsx'

export const SystemUtilgjengelig = () => {
    const error = useRouteError()

    const spraak = useSpraak()

    useEffect(() => {
        if (error instanceof Error) {
            const errorStackFrames = ErrorStackParser.parse(error)

            if (errorStackFrames.length > 0) {
                const stackFrame = errorStackFrames[0]

                try {
                    logger.error({
                        lineno: stackFrame.lineNumber!,
                        columnno: stackFrame.columnNumber!,
                        message: error.message,
                        error: JSON.stringify(error),
                    })
                } catch {
                    logger.generalError({ err: error, errorInfo: error.message })
                }
            } else {
                logger.generalError({ err: error, errorInfo: error.message })
            }
        }
    }, [error])

    return (
        <main>
            <HStack justify="center" padding="8" minHeight="100vh">
                <VStack gap="6" maxWidth="42.5rem">
                    <HStack justify="end">
                        <SpraakVelger />
                    </HStack>

                    {spraak === Spraak.BOKMAAL && (
                        <div>
                            <Detail textColor="subtle">Statuskode 500</Detail>
                            <Heading level="1" size="large">
                                Beklager, noe gikk galt.
                            </Heading>
                            <BodyLong>
                                En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe
                                du gjorde.
                            </BodyLong>
                            <BodyLong>Du kan prøve å</BodyLong>
                            <List>
                                <List.Item>vente noen minutter og laste siden på nytt</List.Item>
                                <List.Item>gå tilbake til forrige side</List.Item>
                            </List>
                            <BodyLong>
                                Hvis problemet vedvarer, kan du{' '}
                                <Link href="https://www.nav.no/kontaktoss" target="_blank" rel="noopener noreferrer">
                                    kontakte oss (åpnes i ny fane)
                                </Link>
                                .
                            </BodyLong>
                        </div>
                    )}

                    {spraak === Spraak.NYNORSK && (
                        <div>
                            <Detail textColor="subtle">Statuskode 500</Detail>
                            <Heading level="1" size="large">
                                Beklagar, noko gjekk gale.
                            </Heading>
                            <BodyLong>
                                Ein teknisk feil på serverane våre gjer at sidan er utilgjengeleg. Dette kjem ikkje av
                                noko du gjorde.
                            </BodyLong>
                            <BodyLong>Du kan prøva å</BodyLong>
                            <List>
                                <List.Item>venta nokre minutt og lasta sidan på nytt</List.Item>
                                <List.Item>gå tilbake til førre side</List.Item>
                            </List>
                            <BodyLong>
                                Viss problemet held fram, kan du{' '}
                                <Link href="https://www.nav.no/kontaktoss" target="_blank" rel="noopener noreferrer">
                                    kontakta oss (blir opna i ny fane)
                                </Link>
                                .
                            </BodyLong>
                        </div>
                    )}

                    {spraak === Spraak.ENGELSK && (
                        <div>
                            <Detail textColor="subtle">Status code 500</Detail>
                            <Heading level="1" size="large">
                                Sorry, something went wrong.
                            </Heading>
                            <BodyLong>
                                A technical error on our servers means that the page is unavailable. This is not due to
                                anything you did.
                            </BodyLong>
                            <BodyLong>You can try to</BodyLong>
                            <List>
                                <List.Item>wait a few minutes and reload the page</List.Item>
                                <List.Item>return to previous page</List.Item>
                            </List>
                            <BodyLong>
                                If the problem persists, you can{' '}
                                <Link href="https://www.nav.no/kontaktoss/en" target="_blank" rel="noopener noreferrer">
                                    contact us (opens in a new tab)
                                </Link>
                                .
                            </BodyLong>
                        </div>
                    )}
                </VStack>
            </HStack>
        </main>
    )
}
