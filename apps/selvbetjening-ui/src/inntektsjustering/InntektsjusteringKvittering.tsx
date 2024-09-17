import { HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../common/skjemaHeader/SkjemaHeader.tsx'

export const InntektsjusteringKvittering = () => {
    return (
        <HStack justify="center" padding="8">
            <VStack gap="6" maxWidth="42.5rem">
                <SkjemaHeader aktivtSteg={4} stegLabelKey="steg4" />
            </VStack>
        </HStack>
    )
}
