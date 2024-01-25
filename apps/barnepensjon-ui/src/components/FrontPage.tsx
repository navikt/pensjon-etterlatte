import { BodyLong, Button, ConfirmationPanel, ExpansionCard, GuidePanel, Heading, List } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../context/application/application'
import { useApplicationContext } from '../context/application/ApplicationContext'
import useTranslation from '../hooks/useTranslation'
import FormGroup from './common/FormGroup'
import Trans from './common/Trans'
import { LogEvents, useAmplitude } from '../hooks/useAmplitude'
import LanguageSelect from './common/LanguageSelect'
import FormElement from './common/FormElement'
import styled from 'styled-components'

const ListItemWithIndent = styled(List.Item)`
    margin-left: 1rem;
`

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

                <List as={'ul'}>
                    <ListItemWithIndent>{t('childMayBeApplicableForPension_li1')}</ListItemWithIndent>
                    <ListItemWithIndent>{t('childMayBeApplicableForPension_li2')}</ListItemWithIndent>
                    <ListItemWithIndent>{t('childMayBeApplicableForPension_li3')}</ListItemWithIndent>
                </List>

                <BodyLong>
                    <Trans value={t('readMoreAboutChildrensPension')} />
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <ExpansionCard aria-label={t('weWillRetrieveInfoTitle')}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as={'h2'} size={'small'}>
                            {t('weWillRetrieveInfoTitle')}
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <FormElement>
                            <Heading size={'xsmall'}>{t('howWeProcessDataTitle')}</Heading>
                            <BodyLong>{t('howWeProcessDataContent')}</BodyLong>
                        </FormElement>

                        <FormElement>
                            <Heading size={'xsmall'}>{t('collectAndProcessTitle')}</Heading>

                            <List as={'ul'} size={'small'}>
                                <ListItemWithIndent>{t('collectAndProcess_li1')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('collectAndProcess_li2')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('collectAndProcess_li3')}</ListItemWithIndent>
                            </List>
                        </FormElement>

                        <FormElement>
                            <Heading size={'xsmall'}>{t('weWillRetrieveInfo')}</Heading>
                            <BodyLong>{t('infoWeRetrieve')}</BodyLong>

                            <List as={'ul'} size={'small'}>
                                <ListItemWithIndent>{t('infoWeRetrieve_li1')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('infoWeRetrieve_li2')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('infoWeRetrieve_li3')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('infoWeRetrieve_li4')}</ListItemWithIndent>
                            </List>

                            <BodyLong>
                                <Trans value={t('survivingParentInfo')} />
                                <List as={'ul'} size={'small'}>
                                    <ListItemWithIndent>{t('survivingParentInfo_li1')}</ListItemWithIndent>
                                    <ListItemWithIndent>{t('survivingParentInfo_li2')}</ListItemWithIndent>
                                    <ListItemWithIndent>{t('survivingParentInfo_li3')}</ListItemWithIndent>
                                    <ListItemWithIndent>{t('survivingParentInfo_li4')}</ListItemWithIndent>
                                    <ListItemWithIndent>{t('survivingParentInfo_li5')}</ListItemWithIndent>
                                </List>
                            </BodyLong>
                        </FormElement>

                        <FormElement>
                            <Heading size={'xsmall'}>{t('disclosureOfInformationTitle')}</Heading>
                            <BodyLong>{t('disclosureOfInformationContent')}</BodyLong>
                        </FormElement>

                        <FormElement>
                            <Heading size={'xsmall'}>{t('durationDataIsStoredTitle')}</Heading>
                            <BodyLong>{t('durationDataIsStoredContent')}</BodyLong>
                        </FormElement>

                        <FormElement>
                            <Heading size={'xsmall'}>{t('automaticProcessingTitle')}</Heading>
                            <BodyLong>{t('automaticProcessingContent1')}</BodyLong>
                            <FormElement>
                                <BodyLong>
                                    <Trans value={t('automaticProcessingContent2')} />
                                </BodyLong>
                            </FormElement>
                            <FormElement>
                                <BodyLong>{t('automaticProcessingContent3')}</BodyLong>
                            </FormElement>
                            <BodyLong>{t('automaticProcessingContent4')}</BodyLong>

                            <List as={'ul'} size={'small'}>
                                <ListItemWithIndent>{t('automaticProcessingContent_li1')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('automaticProcessingContent_li2')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('automaticProcessingContent_li3')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('automaticProcessingContent_li4')}</ListItemWithIndent>
                            </List>
                            <BodyLong>{t('automaticProcessingContent5')}</BodyLong>
                        </FormElement>

                        <Heading size={'xsmall'}>{t('aboutPrivacyTitle')}</Heading>
                        <BodyLong>
                            <Trans value={t('aboutPrivacy')} />
                        </BodyLong>
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
