import { BodyLong, Button, ConfirmationPanel, Heading, Link } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../context/application/application'
import { useApplicationContext } from '../context/application/ApplicationContext'
import { useUserContext } from '../context/user/UserContext'
import useTranslation from '../hooks/useTranslation'
import FormGroup from './common/FormGroup'
import LanguageSelect from './common/LanguageSelect'
import NavGuide from './common/NavGuide'
import { InlineLink } from './common/StyledTypography'

export default function FrontPage() {
    const navigate = useNavigate()

    const { state: user } = useUserContext()
    const { state, dispatch } = useApplicationContext()

    const [consent, setConsent] = useState(state?.applicant?.consent || false)

    const { t } = useTranslation('frontPage')

    const { fornavn, etternavn } = user

    function next() {
        dispatch({
            type: ActionTypes.UPDATE_APPLICANT,
            payload: { ...state.applicant, consent },
        })
        navigate('velg-scenarie')
    }

    return (
        <>
            <FormGroup>
                <NavGuide>{t('helloUser', { fornavn, etternavn })}</NavGuide>
            </FormGroup>

            <FormGroup>
                <LanguageSelect />
            </FormGroup>

            <FormGroup>
                <Heading spacing size={'large'}>
                    {t('frontPageTitle')}
                </Heading>

                <BodyLong>
                    {t('childMayBeApplicableForPension')}
                    <InlineLink href={t('childMayBeApplicableForPensionHref')}>
                        {t('childMayBeApplicableForPensionLink')}
                    </InlineLink>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('childrenAboveLegalAge')}</Heading>

                <BodyLong>{t('aboutChildrensPensionIntro')}</BodyLong>

                <ul>
                    <li>
                        <BodyLong>{t('aboutChildrensPension_li1')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('aboutChildrensPension_li2')}</BodyLong>
                    </li>
                </ul>

                <BodyLong>
                    {t('aboutChildrensPensionOutro')}

                    <InlineLink href={t('aboutChildrensPensionHref')}>{t('aboutChildrensPensionLink')}</InlineLink>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('aboutChildrensPensionTaxTitle')}</Heading>

                <BodyLong>
                    {t('aboutChildrensPensionTax')}

                    <InlineLink href={t('aboutChildrensPensionTaxHref')}>
                        {t('aboutChildrensPensionTaxLink')}
                    </InlineLink>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('weNeedCorrectInformation')}</Heading>

                <BodyLong>{t('importantChangesMustBeNotified')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('weWillRetrieveInfo')}</Heading>

                <BodyLong>{t('infoWeRetrieve')}</BodyLong>

                <ul>
                    <li>
                        <BodyLong>{t('infoWeRetrieve_li1')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('infoWeRetrieve_li2')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('infoWeRetrieve_li3')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('infoWeRetrieve_li4')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('infoWeRetrieve_li5')}</BodyLong>
                    </li>
                </ul>

                <BodyLong>
                    <Link href={t('howWeHandleDataHref')}>{t('howWeHandleDataLink')}</Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('aboutPrivacyHref')}>{t('aboutPrivacyLink')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('aboutTheApplicationTitle')}</Heading>

                <BodyLong>{t('aboutTheApplicationDescription')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('consentTitle')}</Heading>

                <BodyLong>{t('consentDescription')}</BodyLong>

                <ConfirmationPanel
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    label={t('consentToNav', { fornavn, etternavn })}
                    size="medium"
                />
            </FormGroup>

            <FormGroup>
                <Button size={'medium'} variant={'primary'} onClick={next} disabled={!consent}>
                    {t('startApplication')}
                </Button>
            </FormGroup>
        </>
    )
}
