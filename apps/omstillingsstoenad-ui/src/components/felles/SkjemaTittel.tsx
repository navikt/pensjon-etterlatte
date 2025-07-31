import { BodyShort, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import ikon from '../../assets/ikoner/reinParaplyBlomst.svg'

export const SkjemaTittel = () => {
    const { t } = useTranslation()

    return (
        <VStack align="center" padding="4" marginBlock="8 4">
            <HStack gap="4" align="center">
                <Hide below="md">
                    <img src={ikon} alt="Illustrasjon av at det regner over en blomst med en paraply" aria-hidden />
                </Hide>
                <VStack>
                    <BodyShort size="small">Nav 17-01.06</BodyShort>
                    <Heading size="xlarge" level="1">
                        {t('banner.tittel')}
                    </Heading>
                </VStack>
            </HStack>
        </VStack>
    )
}
