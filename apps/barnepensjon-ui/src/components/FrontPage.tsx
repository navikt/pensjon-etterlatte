import { BodyLong, Button, ExpansionCard, GuidePanel, Heading, Label, List, RadioProps } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes, IApplicant } from '../context/application/application'
import { useApplicationContext } from '../context/application/ApplicationContext'
import useTranslation, { TFunction } from '../hooks/useTranslation'
import FormGroup from './common/FormGroup'
import Trans from './common/Trans'
import { LogEvents, useAmplitude } from '../hooks/useAmplitude'
import LanguageSelect from './common/LanguageSelect'
import FormElement from './common/FormElement'
import styled from 'styled-components'
import ErrorSummaryWrapper from './common/ErrorSummaryWrapper'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFRadio } from './common/rhf/RHFRadio'
import { RHFConfirmationPanel } from './common/rhf/RHFCheckboksPanelGruppe'

const ListItemWithIndent = styled(List.Item)`
    margin-left: 1rem;
`

export enum ApplicantRole {
    PARENT = 'PARENT',
    GUARDIAN = 'GUARDIAN',
    CHILD = 'CHILD',
}

export enum ApplicantSituation {
    ONE_PARENT_DECEASED = 'ONE_PARENT_DECEASED',
    BOTH_PARENTS_DECEASED = 'BOTH_PARENTS_DECEASED',
}

export default function FrontPage() {
    const navigate = useNavigate()

    const { dispatch } = useApplicationContext()

    const { t } = useTranslation('frontPage')
    const { logEvent } = useAmplitude()

    const methods = useForm<IApplicant>({
        defaultValues: {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    function next(data: IApplicant) {
        dispatch({
            type: ActionTypes.UPDATE_APPLICANT,
            payload: data,
        })

        logEvent(LogEvents.START_APPLICATION)
        logEvent(LogEvents.SELECT_SCENARIO, { type: data.applicantRole })
        logEvent(LogEvents.SELECT_SITUATION, { type: data.applicantSituation })

        if (data.applicantRole === ApplicantRole.PARENT) navigate('/skjema/forelder/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.GUARDIAN) navigate('/skjema/verge/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.CHILD) navigate('/skjema/barn/steg/om-deg')
    }

    const selectedRole = watch('applicantRole')

    return (
        <FormProvider {...methods}>
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
                <RHFRadio
                    legend={t('whoIsApplying')}
                    name={'applicantRole'}
                    children={Object.values(ApplicantRole).map((value) => {
                        return { children: t(value), value, required: true } as RadioProps
                    })}
                />
            </FormGroup>

            {ApplicantRole.PARENT === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('parentApplicantInformationLabel')}</Label>
                        <BodyLong size={'small'}>{t('parentApplicantInformation')}</BodyLong>
                        <FormElement>
                            <Trans value={t('youNeedFnrForEveryoneInThisApplicationSurvivingParent')} />
                        </FormElement>
                    </FormGroup>
                    <FormGroup>
                        <Heading size={'small'} spacing>
                            {t('aboutSurvivorsPensionTitle')}
                        </Heading>
                        <BodyLong>
                            <Trans value={t('aboutSurvivorsPensionDescription')} />
                        </BodyLong>
                    </FormGroup>
                    <ProcessingDataParentAndGuardian t={t} />
                </>
            )}

            {ApplicantRole.GUARDIAN === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('guardianApplicantInformationLabel')}</Label>
                        <BodyLong spacing size={'small'}>
                            {t('guardianApplicantInformation')}
                        </BodyLong>
                        <BodyLong size={'small'}>
                            <Trans value={t('guardiansMustSendDocumentation')} />
                        </BodyLong>
                    </FormGroup>
                    <FormGroup>
                        <RHFRadio
                            legend={t('additionalSituationDetails')}
                            name={'applicantSituation'}
                            description={t('additionalSituationDetailsDescription')}
                            children={[
                                {
                                    children: t(ApplicantSituation.ONE_PARENT_DECEASED),
                                    value: ApplicantSituation.ONE_PARENT_DECEASED,
                                    required: true,
                                },
                                {
                                    children: t(ApplicantSituation.BOTH_PARENTS_DECEASED),
                                    value: ApplicantSituation.BOTH_PARENTS_DECEASED,
                                    required: true,
                                },
                            ]}
                        />
                    </FormGroup>
                    <ProcessingDataParentAndGuardian t={t} />
                </>
            )}

            {ApplicantRole.CHILD === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('CHILD')}</Label>
                        <BodyLong size={'small'}>
                            <Trans value={t('over18WithoutFnr')} />
                        </BodyLong>
                    </FormGroup>
                    <FormGroup>
                        <RHFRadio
                            legend={t('additionalSituationDetailsOver18')}
                            name={'applicantSituation'}
                            description={t('additionalSituationDetailsOver18Description')}
                            children={[
                                {
                                    children: t(ApplicantSituation.ONE_PARENT_DECEASED),
                                    value: ApplicantSituation.ONE_PARENT_DECEASED,
                                    required: true,
                                },
                                {
                                    children: t(ApplicantSituation.BOTH_PARENTS_DECEASED),
                                    value: ApplicantSituation.BOTH_PARENTS_DECEASED,
                                    required: true,
                                },
                            ]}
                        />
                    </FormGroup>
                    <ProcessingDataChild t={t} />
                </>
            )}

            <FormGroup>
                <Heading size={'small'}>{t('consentTitle')}</Heading>

                <BodyLong>{t('consentDescription')}</BodyLong>

                <RHFConfirmationPanel name={'consent'} label={t('consentToNav')} size="medium" />
            </FormGroup>

            <ErrorSummaryWrapper errors={errors} />

            <FormGroup>
                <Button size={'medium'} variant={'primary'} onClick={handleSubmit(next)}>
                    {t('startApplication')}
                </Button>
            </FormGroup>
        </FormProvider>
    )
}

function ProcessingDataParentAndGuardian({ t }: { t: TFunction }) {
    return (
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
    )
}

function ProcessingDataChild({ t }: { t: TFunction }) {
    return (
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
    )
}
