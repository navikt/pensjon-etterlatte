import useTranslation from '../../hooks/useTranslation'
import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import { BodyLong, Button, Heading } from '@navikt/ds-react'

export const InvalidApplicant = () => {
    const { t } = useTranslation('invalidApplicant')

    return (
        <>
            <FormGroup>
                <NavGuide>
                    <Heading size={'small'} spacing>
                        {t('applicantIsTooYoung')}
                    </Heading>
                    <BodyLong spacing>{t('childMayBeApplicableForPension')}</BodyLong>
                    <Button variant={'primary'} as={'a'} href={t('moreAboutChildrensPensionHref')}>
                        {t('moreAboutChildrensPension')}
                    </Button>
                </NavGuide>
            </FormGroup>
        </>
    )
}
