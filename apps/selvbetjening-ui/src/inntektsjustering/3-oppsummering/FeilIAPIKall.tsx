import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold } from '../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'

export const FeilIAPIKall = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringOppsummeringInnhold>('*[_type == "inntektsjusteringOppsummering"]')

    if (innholdIsLoading) {
        return <Loader />
    }
    if (innholdError) {
        return <Navigate to="/inntekt/system-utilgjengelig" />
    }
    if (!innhold?.feilIOpprettelseAvInntekt) {
        return <Navigate to="/inntekt/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <Alert variant="error">
                <Heading spacing size="small" level="3">
                    {innhold.feilIOpprettelseAvInntekt?.tittel?.[spraak]}
                </Heading>
                <SanityRikTekst text={innhold.feilIOpprettelseAvInntekt.innhold?.[spraak]} />
            </Alert>
        )
    )
}
