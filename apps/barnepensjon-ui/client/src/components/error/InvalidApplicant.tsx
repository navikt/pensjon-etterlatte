import useTranslation from '../../hooks/useTranslation'
import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import { BodyLong } from '@navikt/ds-react'
import Trans from '../common/Trans'

export const InvalidApplicant = () => {
    const { t } = useTranslation('invalidApplicant')

    return (
        <>
            <FormGroup>
                <NavGuide>{t('applicantIsTooYoung')}</NavGuide>
            </FormGroup>

            <FormGroup>
                <BodyLong spacing>
                    <Trans value={t('childMayBeApplicableForPension', { ns: 'frontPage' })} />
                </BodyLong>
                <Trans value={t('moreAboutChildrensPension', { ns: 'frontPage' })} />
            </FormGroup>
        </>
    )
}
