import { EqualsIcon } from '@navikt/aksel-icons'
import { Box, Heading, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useSpraak } from '../../../../common/spraak/SpraakContext.tsx'
import { ForventetInntektTilNesteAar } from '../../../../types/meldInnEndring.ts'
import { Alder } from '../../../../types/person.ts'

interface Props {
    forventetInntektTilNesteAar: ForventetInntektTilNesteAar
    alder: Alder
    children: ReactNode | Array<ReactNode>
}

export const SumAvOppgittInntekt = ({ forventetInntektTilNesteAar, alder, children }: Props) => {
    const spraak = useSpraak()

    const sumAvInntektStrengBygger = (forventetInntektTilNesteAar: ForventetInntektTilNesteAar): string => {
        let inntekt = 0

        if (isNaN(forventetInntektTilNesteAar.arbeidsinntekt)) inntekt += 0
        else inntekt += forventetInntektTilNesteAar.arbeidsinntekt

        if (isNaN(forventetInntektTilNesteAar.naeringsinntekt)) inntekt += 0
        else inntekt += forventetInntektTilNesteAar.naeringsinntekt

        if (isNaN(forventetInntektTilNesteAar.inntektFraUtland)) inntekt += 0
        else inntekt += forventetInntektTilNesteAar.inntektFraUtland

        if (alder === Alder.SEKSTI_TO_TIL_SEKSTI_SEKS) {
            if (!forventetInntektTilNesteAar.afpInntekt || isNaN(forventetInntektTilNesteAar.afpInntekt)) inntekt += 0
            else inntekt += forventetInntektTilNesteAar.afpInntekt
        }

        return `${new Intl.NumberFormat(spraak.toLowerCase()).format(inntekt)} kr`
    }

    return (
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
            <VStack>
                <EqualsIcon fontSize="3.5rem" aria-hidden />
                <div>{children}</div>
                <Heading size="large">{sumAvInntektStrengBygger(forventetInntektTilNesteAar)}</Heading>
            </VStack>
        </Box>
    )
}
