import { BodyShort, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import useTranslation from '~hooks/useTranslation'
import ikon from '../../assets/barnHolderBlomst.svg'

export const ApplicationTitle = () => {
    const { t } = useTranslation('app')

    return (
        <VStack as="header" role="banner" align="center" padding="4" marginBlock="8 4">
            <HStack gap="4" align="center">
                <Hide below="md">
                    <img src={ikon} alt="En hånd som holder en spirende blomst ved siden av et barn" aria-hidden />
                </Hide>
                <VStack>
                    <BodyShort size="small">Nav 18-01.05</BodyShort>
                    <Heading size="xlarge">{t('applicationTitle')}</Heading>
                </VStack>
            </HStack>
        </VStack>
    )
}
