import { Skeleton, VStack } from '@navikt/ds-react'

export const KomponentLaster = () => {
    return (
        <VStack gap="space-24" maxWidth="42rem">
            <Skeleton variant="rectangle" width="100%" height={80} />
            <Skeleton variant="rectangle" width="100%" height={80} />
        </VStack>
    )
}
