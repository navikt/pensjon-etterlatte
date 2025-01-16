import { HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'

export const MeldInnEndringOppsummering = () => {
    return (
        <main>
            <HStack justify="center" padding="8" minHeight="100vh">
                <VStack gap="6" maxWidth="42.5rem">
                    <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" skjemaNavn="meld-inn-endring" />
                </VStack>
            </HStack>
        </main>
    )
}
