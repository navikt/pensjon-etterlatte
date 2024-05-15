import FormGroup from '../common/FormGroup'
import { BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import { useLocation } from 'react-router-dom'
import { LogEvents, useAmplitude } from '../../hooks/useAmplitude'
import { useEffect } from 'react'
import FormElement from '../common/FormElement'
import { BugIcon } from '@navikt/aksel-icons'

export default function PageNotFound() {
    const location = useLocation()

    const { t } = useTranslation('pageNotFound')
    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.PAGE_NOT_FOUND, { side: location.pathname })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <FormGroup>
                <FormElement>
                    <Heading size={'medium'}>{t('title')}</Heading>
                </FormElement>
                <FormElement>
                    <BodyShort>{t('description')}</BodyShort>
                </FormElement>
                <FormGroup>
                    <Button as={'a'} href={t('backToFrontpage.href')}>
                        {t('backToFrontpage')}
                    </Button>
                </FormGroup>
                <Link href={t('errorInLink.href')}>
                    <BugIcon fontSize={20} aria-hidden={true} />
                    {t('errorInLink')}
                </Link>
            </FormGroup>
            <FormElement>
                <Heading size={'medium'}>{t('title.english')}</Heading>
            </FormElement>
            <FormElement>
                <BodyShort>
                    {t('description.english.part1')}
                    <Link href={t('backToFrontpage.href')} inlineText>
                        {t('backToFrontpage.english')}
                    </Link>
                    {t('description.english.part2')}
                </BodyShort>
            </FormElement>
        </div>
    )
}
