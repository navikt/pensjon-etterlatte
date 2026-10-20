import { BodyShort, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import ikon from '../../assets/ikoner/reinParaplyBlomst.svg'

export const SkjemaTittel = () => {
    const { t } = useTranslation()

    return (
        <VStack as="header" role="banner" align="center" padding="space-16" marginBlock="space-32 space-16">
            <HStack gap="space-16" align="center">
                <Hide below="md">
                    <img src={ikon} alt="Illustrasjon av at det regner over en blomst med en paraply" aria-hidden />
                </Hide>
                <VStack>
                    <BodyShort size="small">Nav 17-01.06</BodyShort>
                    <Heading size="xlarge">{t('banner.tittel')}</Heading>
                </VStack>
            </HStack>
        </VStack>
    )
}
