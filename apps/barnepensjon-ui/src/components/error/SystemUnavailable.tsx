import { BodyShort, Box, Button, Heading, Link } from '@navikt/ds-react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { SoeknadType } from '~api/dto/InnsendtSoeknad'
import blomstHjerteHus from '../../assets/blomstHjerteHus.svg'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import useTranslation from '../../hooks/useTranslation'
import FormElement from '../common/FormElement'
import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'

const Icon = styled.img`
    height: 4rem;
    width: 4rem;
    margin-bottom: -1.5rem;
    padding-right: 1rem;
    margin-top: 1rem;
`

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
            <FormGroup>
                <NavGuide>
                    <Heading size={'small'} spacing>
                        {t('title')}
                    </Heading>
                    <BodyShort spacing>{t('description')}</BodyShort>
                    <Button variant={'primary'} onClick={retry}>
                        {t('tryAgainButton')}
                    </Button>
                </NavGuide>
            </FormGroup>

            <FormElement>
                <Heading size={'small'} spacing>
                    {t('feedback.title')}
                </Heading>
                <Button as={'a'} variant={'secondary'} href={t('feedback.href')}>
                    {t('feedback.report')}
                </Button>
            </FormElement>

            <FormGroup>
                <FormElement>
                    <Heading size={'small'} spacing>
                        {t('moreAboutBenefits')}
                    </Heading>
                </FormElement>
                <FormGroup>
                    <Box
                        as={'a'}
                        href={t('moreAboutBenefitsHref')}
                        borderRadius="large"
                        shadow="xsmall"
                        paddingBlock={'8'}
                        paddingInline={'6 32'}
                        style={{ color: 'var(--a-text-default)', fontSize: '20px' }}
                    >
                        <Icon alt="blomstHjerteHus" src={blomstHjerteHus} />
                        {t('moreAboutBenefitsLink')}
                    </Box>
                </FormGroup>
            </FormGroup>

            <FormElement>
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
            </FormElement>
        </div>
    )
}
