import { BodyShort, Box, Button, GuidePanel, Heading, Link } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import blomstHjerteHus from '../../../assets/ikoner/blomstHjerteHus.svg'
import './systemUtilgjengelig.css'

export default function SystemUtilgjengelig() {
    const { t } = useTranslation()

    const omstart = () => {
        window.location.href = '/omstillingsstonad/soknad'
    }

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <Box marginBlock="space-0 space-48">
                <GuidePanel poster>
                    <Heading size={'small'} spacing>
                        {t('systemUtilgjengelig.veileder.tittel')}
                    </Heading>
                    <BodyShort spacing>{t('systemUtilgjengelig.veileder.beskrivelse')}</BodyShort>
                    <Button variant={'primary'} onClick={omstart}>
                        {t('systemUtilgjengelig.knappProevIgjen')}
                    </Button>
                </GuidePanel>
            </Box>
            <Box marginBlock="space-16">
                <Heading size={'small'} spacing>
                    {t('systemUtilgjengelig.tilbakemelding.tittel')}
                </Heading>
                <Button as={'a'} variant={'secondary'} href={t('systemUtilgjengelig.tilbakemelding.href')}>
                    {t('systemUtilgjengelig.tilbakemelding.meldFra')}
                </Button>
            </Box>
            <Box marginBlock="space-0 space-48">
                <Box marginBlock="space-16">
                    <Heading size={'small'} spacing>
                        {t('systemUtilgjengelig.merOmYtelsene')}
                    </Heading>
                </Box>
                <Box>
                    <Box
                        as={'a'}
                        href={t('systemUtilgjengelig.merOmYtelseneHref')}
                        borderRadius="8"
                        shadow="dialog"
                        paddingBlock={'space-32'}
                        paddingInline={'space-24 space-128'}
                        style={{ color: 'var(--ax-text-neutral)', fontSize: '20px' }}
                    >
                        <img className="blomster-hus-ikon" alt="blomstHjerteHus" src={blomstHjerteHus} />
                        {t('systemUtilgjengelig.merOmYtelseneLenke')}
                    </Box>
                </Box>
            </Box>
            <Box>
                <Heading size={'small'} spacing>
                    {t('systemUtilgjengelig.tittel.engelsk')}
                </Heading>
                <BodyShort>
                    {t('systemUtilgjengelig.beskrivelse.engelsk.del1')}
                    <Link href={'/omstillingsstonad/soknad'} inlineText>
                        {t('systemUtilgjengelig.beskrivelse.engelsk.tryAgain')}
                    </Link>
                    {t('systemUtilgjengelig.beskrivelse.engelsk.del2')}
                </BodyShort>
            </Box>
        </div>
    )
}
