import { Heading, HStack, Skeleton, VStack } from '@navikt/ds-react'

export const PageLoading = () => {
    return (
        <HStack justify="center" padding="8">
            <VStack gap="6" width="42.5rem">
                <Skeleton variant="rectangle" width="100%" height={160} />
                <Heading as={Skeleton} size="large">
                    Side tittel
                </Heading>

                <Skeleton variant="rectangle" width="100%" height={80} />
                <Skeleton variant="rectangle" width="100%" height={80} />
                <Skeleton variant="rectangle" width="100%" height={60} />
                <Skeleton variant="rectangle" width="100%" height={40} />

                <Skeleton variant="text" width="20%" />
            </VStack>
        </HStack>
    )
}
