import { HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'

export const InntektsjusteringOppsummering = () => {
    return (
        <HStack justify="center" padding="8">
            <VStack gap="6" maxWidth="42.5rem">
                <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" />
            </VStack>
        </HStack>
    )
}
