import { Box, GuidePanel, Heading } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { SpraakvalgUtvidet } from '~components/utvidet/SpraakvalgUtvidet'
import { useHentBrukerContext } from '~context/utvidet/HentBrukerContext'

export const UtvidetForside = () => {
    const { t } = useTranslation()
    const { bruker } = useHentBrukerContext()

    return (
        <Box marginBlock="space-16">
            <SpraakvalgUtvidet />
            <Box marginBlock="space-0 space-48">
                <GuidePanel poster>
                    <Heading size="small">{t('utvidet.forside.ingress.tittel', { navn: bruker?.fornavn })}</Heading>
                    <p>{t('utvidet.forside.ingress')}</p>
                    <p>{t('utvidet.forside.ingress2')}</p>
                </GuidePanel>
            </Box>
            <Heading spacing size={'large'}>
                {t('utvidet.forside.omSoeknad.tittel')}
            </Heading>
        </Box>
    )
}
