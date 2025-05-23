import { EqualsIcon } from '@navikt/aksel-icons'
import { Box, Heading, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { Inntekt } from '../../types/inntektsjustering.ts'
import { Alder } from '../../types/person.ts'

export const SumAvOppgittInntekt = ({
    inntektTilNesteAar,
    alder,
    children,
}: {
    inntektTilNesteAar: Inntekt
    alder: Alder
    children: ReactNode | Array<ReactNode>
}) => {
    const sumAvInntektStringBuilder = (inntektTilNesteAar: Inntekt): string => {
        let inntekt = 0

        if (isNaN(inntektTilNesteAar.arbeidsinntekt)) inntekt += 0
        else inntekt += inntektTilNesteAar.arbeidsinntekt

        if (isNaN(inntektTilNesteAar.naeringsinntekt)) inntekt += 0
        else inntekt += inntektTilNesteAar.naeringsinntekt

        if (isNaN(inntektTilNesteAar.inntektFraUtland)) inntekt += 0
        else inntekt += inntektTilNesteAar.inntektFraUtland

        if (alder === Alder.SEKSTI_TO_TIL_SEKSTI_SEKS) {
            if (!inntektTilNesteAar.afpInntekt || isNaN(inntektTilNesteAar.afpInntekt)) inntekt += 0
            else inntekt += inntektTilNesteAar.afpInntekt
        }

        return `${new Intl.NumberFormat('nb').format(inntekt)} kr`
    }

    return (
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
            <VStack>
                <EqualsIcon fontSize="3.5rem" aria-hidden />
                <div>{children}</div>
                <Heading size="large">{sumAvInntektStringBuilder(inntektTilNesteAar)}</Heading>
            </VStack>
        </Box>
    )
}
