import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringOppsummering } from '../sanity.types.ts'
import { KomponentLaster } from '../../common/KomponentLaster.tsx'
import { Alert, Heading } from '@navikt/ds-react'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'

export const FeilIOppretelseAvEndring = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<MeldInnEndringOppsummering>('*[_type == "meldInnEndringOppsummering"]')

    if (innholdIsLoading) {
        return <KomponentLaster />
    }
    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <Alert variant="error">
                <Heading spacing size="small" level="3">
                    {innhold.feilIOppretelseAvEndring?.tittel?.[spraak]}
                </Heading>
                <SanityRikTekst text={innhold.feilIOppretelseAvEndring?.innhold?.[spraak]} />
            </Alert>
        )
    )
}
