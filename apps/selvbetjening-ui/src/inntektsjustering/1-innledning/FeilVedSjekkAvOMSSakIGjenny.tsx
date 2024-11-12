import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInnledning } from '../../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'

export const FeilVedSjekkAvOMSSakIGjenny = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInnledning>('*[_type == "inntektsjusteringInnledning"]')

    if (innholdIsLoading) {
        return <SideLaster />
    }

    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <Alert variant="warning">
                <Heading size="small" level="3" spacing>
                    {innhold?.feilVedSjekkAvOMSSakIGjenny?.tittel?.[spraak]}
                </Heading>
                <BodyShort>{innhold?.feilVedSjekkAvOMSSakIGjenny?.innhold?.[spraak]}</BodyShort>
            </Alert>
        )
    )
}
