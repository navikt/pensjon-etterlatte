import { BugIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Heading, Link, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import useTranslation from '../../hooks/useTranslation'

export default function PageNotFound() {
    const location = useLocation()

    const { t } = useTranslation('pageNotFound')
    const { logEvent } = useAnalytics()

    useEffect(() => {
        logEvent(LogEvents.PAGE_NOT_FOUND, { side: location.pathname })
    }, [])

    return (
        <div>
            <VStack gap="8">
                <VStack>
                    <Heading size={'medium'} spacing>
                        {t('title')}
                    </Heading>
                    <BodyShort>{t('description')}</BodyShort>
                </VStack>
                <div>
                    <Button as={'a'} href={t('backToFrontpage.href')}>
                        {t('backToFrontpage')}
                    </Button>
                </div>
                <Link href={t('errorInLink.href')}>
                    <BugIcon fontSize={20} aria-hidden={true} />
                    {t('errorInLink')}
                </Link>
                <VStack>
                    <Heading size={'medium'} spacing>
                        {t('title.english')}
                    </Heading>
                    <BodyShort>
                        {t('description.english.part1')}
                        <Link href={t('backToFrontpage.href')} inlineText>
                            {t('backToFrontpage.english')}
                        </Link>
                        {t('description.english.part2')}
                    </BodyShort>
                </VStack>
            </VStack>
        </div>
    )
}
