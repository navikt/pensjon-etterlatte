import { Alert, BodyShort, Detail, HStack, Link, VStack } from '@navikt/ds-react'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { SystemUtilgjengelig as SystemUtilgjengeligInnhold } from './sanity.types.ts'
import { SpraakVelger } from '../inntektsjustering/components/spraakVelger/SpraakVelger.tsx'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'
import { useRouteError } from 'react-router-dom'
import { useEffect } from 'react'
import ErrorStackParser from 'error-stack-parser'
import { logger } from './logger/logger.ts'

const fallbackTekster = {
    NB: 'Skjemaet er utilgjengelig',
    NN: 'Skjemaet er utilgjengeleg',
    EN: 'The form is unavailable',
}

export const SystemUtilgjengelig = () => {
    const error = useRouteError()

    const spraak = useSpraak()

    const { innhold, isLoading } = useSanityInnhold<SystemUtilgjengeligInnhold>('*[_type == "systemUtilgjengelig"]')

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
                    {!!innhold && !isLoading ? (
                        <div>
                            <Detail textColor="subtle">{innhold.statuskodeDetail?.[spraak]}</Detail>
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                            <BodyShort>
                                {innhold.kontaktOss?.tekst?.[spraak]}{' '}
                                <Link
                                    href={innhold.kontaktOss?.lenke?.url?.[spraak]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {innhold.kontaktOss?.lenke?.tekst?.[spraak]}
                                </Link>
                            </BodyShort>
                        </div>
                    ) : (
                        <Alert variant="error">{fallbackTekster[spraak]}</Alert>
                    )}
                </VStack>
            </HStack>
        </main>
    )
}
