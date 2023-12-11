import { BodyLong, Button, ConfirmationPanel, ExpansionCard, GuidePanel, Heading } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../context/application/application'
import { useApplicationContext } from '../context/application/ApplicationContext'
import useTranslation from '../hooks/useTranslation'
import FormGroup from './common/FormGroup'
import Trans from './common/Trans'
import { LogEvents, useAmplitude } from '../hooks/useAmplitude'
import LanguageSelect from './common/LanguageSelect'

export default function FrontPage() {
    const navigate = useNavigate()

    const { state, dispatch } = useApplicationContext()

    const [consent, setConsent] = useState(state?.applicant?.consent || false)

    const { t } = useTranslation('frontPage')
    const { logEvent } = useAmplitude()

    function next() {
        dispatch({
            type: ActionTypes.UPDATE_APPLICANT,
            payload: { ...state.applicant, consent },
        })
        logEvent(LogEvents.START_APPLICATION)
        navigate('velg-scenarie')
    }

    return (
        <>
            <FormGroup>
                <GuidePanel poster>{t('ingress')}</GuidePanel>
            </FormGroup>

            <FormGroup>
                <LanguageSelect />
            </FormGroup>

            <FormGroup>
                <Heading spacing size={'medium'}>
                    {t('frontPageTitle')}
                </Heading>

                <BodyLong>
                    <Trans value={t('childMayBeApplicableForPension')} />
                </BodyLong>
                <BodyLong as={'div'}>
                    <ul>
                        <li>
                            <Trans value={t('childMayBeApplicableForPension_li1')} />
                        </li>
                        <li>
                            <Trans value={t('childMayBeApplicableForPension_li2')} />
                        </li>
                        <li>
                            <Trans value={t('childMayBeApplicableForPension_li3')} />
                        </li>
                    </ul>
                </BodyLong>
                <BodyLong>
                    <Trans value={t('readMoreAboutChildrensPension')} />
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <ExpansionCard aria-label={t('weWillRetrieveInfoTitle')}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as={'h2'}>{t('weWillRetrieveInfoTitle')}</ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <Heading size={'small'}>{t('weWillRetrieveInfo')}</Heading>

                        <BodyLong>{t('infoWeRetrieve')}</BodyLong>

                        <ul>
                            <li>
                                <Trans value={t('infoWeRetrieve_li1')} />
                            </li>
                            <li>
                                <Trans value={t('infoWeRetrieve_li2')} />
                            </li>
                            <li>
                                <Trans value={t('infoWeRetrieve_li3')} />
                            </li>
                            <li>
                                <Trans value={t('infoWeRetrieve_li4')} />
                            </li>
                        </ul>

                        <BodyLong>
                            <Trans value={t('survivingParentInfo')} />
                            <ul>
                                <li>
                                    <Trans value={t('survivingParentInfo_li1')} />
                                </li>
                                <li>
                                    <Trans value={t('survivingParentInfo_li2')} />
                                </li>
                                <li>
                                    <Trans value={t('survivingParentInfo_li3')} />
                                </li>
                                <li>
                                    <Trans value={t('survivingParentInfo_li4')} />
                                </li>
                            </ul>
                        </BodyLong>

                        {/*
                        <BodyLong>
                            <Trans value={t('aboutPrivacy')} />
                        </BodyLong>
                        */}
                    </ExpansionCard.Content>
                </ExpansionCard>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('consentTitle')}</Heading>

                <BodyLong>{t('consentDescription')}</BodyLong>

                <ConfirmationPanel
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    label={t('consentToNav')}
                    size="medium"
                />
            </FormGroup>

            {consent && (
                <FormGroup>
                    <Button size={'medium'} variant={'primary'} onClick={next}>
                        {t('startApplication')}
                    </Button>
                </FormGroup>
            )}
        </>
    )
}
