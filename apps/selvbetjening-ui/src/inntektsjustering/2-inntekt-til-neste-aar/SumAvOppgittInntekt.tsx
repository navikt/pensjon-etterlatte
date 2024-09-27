import { InntektTilNesteAarSkjema } from './InntektsjusteringInntektTilNesteAar.tsx'
import { Box, Heading, VStack } from '@navikt/ds-react'
import { EqualsIcon } from '@navikt/aksel-icons'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'

export const SumAvOppgittInntekt = ({ inntektTilNesteAar }: { inntektTilNesteAar: InntektTilNesteAarSkjema }) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const sumAvInntektStringBuilder = (inntektTilNesteAar: InntektTilNesteAarSkjema): string => {
        let inntekt = 0

        if (isNaN(inntektTilNesteAar.arbeidsinntektINorge)) inntekt += 0
        else inntekt += inntektTilNesteAar.arbeidsinntektINorge

        if (isNaN(inntektTilNesteAar.naeringsinntekt)) inntekt += 0
        else inntekt += inntektTilNesteAar.naeringsinntekt

        if (isNaN(inntektTilNesteAar.AFPInntekt)) inntekt += 0
        else inntekt += inntektTilNesteAar.AFPInntekt

        if (isNaN(inntektTilNesteAar.alleInntekterIUtland)) inntekt += 0
        else inntekt += inntektTilNesteAar.alleInntekterIUtland

        return `${inntekt} kr`
    }

    return (
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
            <VStack gap="4">
                <EqualsIcon fontSize="3.5rem" aria-hidden />
                <Heading size="small">{innhold?.sumAvInntekt?.[spraak]}</Heading>
                {/* Hvis input er NaN, bare gjøre det om til 0*/}
                <Heading size="large">{sumAvInntektStringBuilder(inntektTilNesteAar)}</Heading>
            </VStack>
        </Box>
    )
}
