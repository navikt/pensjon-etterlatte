import { Box, Heading, VStack } from '@navikt/ds-react'
import { EqualsIcon } from '@navikt/aksel-icons'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Inntekt } from '../../types/inntektsjustering.ts'
import { Alder } from '../../types/person.ts'

export const SumAvOppgittInntekt = ({ inntektTilNesteAar, alder }: { inntektTilNesteAar: Inntekt; alder: Alder }) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const sumAvInntektStringBuilder = (inntektTilNesteAar: Inntekt): string => {
        let inntekt = 0

        if (isNaN(inntektTilNesteAar.arbeidsinntekt)) inntekt += 0
        else inntekt += inntektTilNesteAar.arbeidsinntekt

        if (isNaN(inntektTilNesteAar.naeringsinntekt)) inntekt += 0
        else inntekt += inntektTilNesteAar.naeringsinntekt

        if (isNaN(inntektTilNesteAar.inntektFraUtland)) inntekt += 0
        else inntekt += inntektTilNesteAar.inntektFraUtland

        if (alder === Alder.FEMTI_SYV_TIL_SEKSTI_SEKS) {
            if (!inntektTilNesteAar.AFPInntekt || isNaN(inntektTilNesteAar.AFPInntekt)) inntekt += 0
            else inntekt += inntektTilNesteAar.AFPInntekt
        }

        return `${inntekt} kr`
    }

    return (
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
            <VStack gap="4">
                <EqualsIcon fontSize="3.5rem" aria-hidden />
                <Heading size="small">{innhold?.sumAvInntekt?.[spraak]}</Heading>
                <Heading size="large">{sumAvInntektStringBuilder(inntektTilNesteAar)}</Heading>
            </VStack>
        </Box>
    )
}
