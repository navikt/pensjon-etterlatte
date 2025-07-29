import { BodyShort, Box, Button, GuidePanel, Heading, Link, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { SoeknadType } from '~api/dto/InnsendtSoeknad'
import blomstHjerteHus from '../../assets/blomstHjerteHus.svg'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import useTranslation from '../../hooks/useTranslation'
import './systemUnavailable.css'

export default function SystemUnavailable() {
    const { t } = useTranslation('systemUnavailable')
    const { logEvent } = useAnalytics()

    useEffect(() => {
        logEvent(LogEvents.SYSTEM_UNAVAILABLE, { type: SoeknadType.BARNEPENSJON })
    }, [])

    const retry = () => {
        window.location.href = import.meta.env.BASE_URL
    }

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <VStack gap="8">
                <GuidePanel>
                    <Heading size={'small'} spacing>
                        {t('title')}
                    </Heading>
                    <BodyShort spacing>{t('description')}</BodyShort>
                    <Button variant={'primary'} onClick={retry}>
                        {t('tryAgainButton')}
                    </Button>
                </GuidePanel>

                <VStack>
                    <Heading size={'small'} spacing>
                        {t('feedback.title')}
                    </Heading>
                    <div>
                        <Button as={'a'} variant={'secondary'} href={t('feedback.href')}>
                            {t('feedback.report')}
                        </Button>
                    </div>
                </VStack>
                <VStack>
                    <Heading size={'small'} spacing>
                        {t('moreAboutBenefits')}
                    </Heading>
                    <Box
                        as={'a'}
                        href={t('moreAboutBenefitsHref')}
                        borderRadius="large"
                        shadow="xsmall"
                        paddingBlock={'0 8'}
                        paddingInline={'6'}
                        style={{ color: 'var(--a-text-default)', fontSize: '20px' }}
                    >
                        <img className="blomster-hjerte-hus-ikon" alt="blomstHjerteHus" src={blomstHjerteHus} />
                        {t('moreAboutBenefitsLink')}
                    </Box>
                </VStack>
                <VStack>
                    <Heading size={'small'} spacing>
                        {t('title.english')}
                    </Heading>
                    <BodyShort>
                        {t('description.english.del1')}
                        <Link href={'/barnepensjon/soknad'} inlineText>
                            {t('description.english.tryAgain')}
                        </Link>
                        {t('description.english.del2')}
                    </BodyShort>
                </VStack>
            </VStack>
        </div>
    )
}
