import { BodyLong, Box, Button, GuidePanel, Heading } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'

export const InvalidApplicant = () => {
    const { t } = useTranslation('invalidApplicant')

    return (
        <Box paddingBlock="0 8">
            <GuidePanel>
                <Heading size={'small'} spacing>
                    {t('applicantIsTooYoung')}
                </Heading>
                <BodyLong spacing>{t('childMayBeApplicableForPension')}</BodyLong>
                <Button variant={'primary'} as={'a'} href={t('moreAboutChildrensPensionHref')}>
                    {t('moreAboutChildrensPension')}
                </Button>
            </GuidePanel>
        </Box>
    )
}
