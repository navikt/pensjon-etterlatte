import { Alert, BodyShort, Detail, HStack, Link, VStack } from '@navikt/ds-react'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { SystemUtilgjengelig as SystemUtilgjengeligInnhold } from '../sanity.types.ts'
import { SpraakVelger } from './spraak/SpraakVelger.tsx'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'
import { useRouteError } from 'react-router-dom'
import { useEffect } from 'react'

export const SystemUtilgjengelig = () => {
    const error = useRouteError()

    const spraak = useSpraak()

    const { innhold, isLoading } = useSanityInnhold<SystemUtilgjengeligInnhold>('*[_type == "systemUtilgjengelig"]')

    useEffect(() => {
        if (error) {
            console.error(error)
        }
    }, [error])

    return (
        <main>
            <HStack justify="center" padding="8">
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
                        <Alert variant="error">Selvbetjening er nede...</Alert>
                    )}
                </VStack>
            </HStack>
        </main>
    )
}
