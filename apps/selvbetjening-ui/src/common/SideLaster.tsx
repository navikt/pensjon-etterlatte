import { Heading, HStack, Skeleton, VStack } from '@navikt/ds-react'

export const SideLaster = () => {
    return (
        <main>
            <HStack justify="center" padding="space-8">
                <VStack gap="space-24" width="42.5rem">
                    <Skeleton variant="rectangle" width="100%" height={160} />
                    <Heading as={Skeleton} size="large">
                        Sidetittel
                    </Heading>

                    <Skeleton variant="rectangle" width="100%" height={80} />
                    <Skeleton variant="rectangle" width="100%" height={80} />
                    <Skeleton variant="rectangle" width="100%" height={60} />
                    <Skeleton variant="rectangle" width="100%" height={40} />

                    <Skeleton variant="text" width="20%" />
                </VStack>
            </HStack>
        </main>
    )
}
