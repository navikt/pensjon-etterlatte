import { BodyLong, Button, GuidePanel, Heading, Label, List, RadioProps } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ActionTypes, IApplicant } from '~context/application/application'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { ApplicantRole, ApplicantSituation } from '~types/applicant'
import useTranslation from '../hooks/useTranslation'
import ErrorSummaryWrapper from './common/ErrorSummaryWrapper'
import FormElement from './common/FormElement'
import FormGroup from './common/FormGroup'
import LanguageSelect from './common/LanguageSelect'
import { ProcessingDataChild, ProcessingDataParentAndGuardian } from './common/ProcessingData'
import { RHFConfirmationPanel } from './common/rhf/RHFCheckboksPanelGruppe'
import { RHFRadio } from './common/rhf/RHFRadio'
import Trans from './common/Trans'

export const ListItemWithIndent = styled(List.Item)`
    margin-left: 1rem;
`

export default function FrontPage() {
    const navigate = useNavigate()

    const { dispatch } = useApplicationContext()

    const { t } = useTranslation('frontPage')
    const { logEvent } = useAnalytics()

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

        // Legger til - Innlogget for å skille fra fyll ut
        logEvent(LogEvents.START_APPLICATION, {
            skjemanavn: 'Søknad om barnepensjon - Innlogget',
            skjemaId: 'NAV 18-01.05',
        })
        logEvent(LogEvents.SELECT_SCENARIO, { type: data.applicantRole })
        logEvent(LogEvents.SELECT_SITUATION, { type: data.applicantSituation })

        if (data.applicantRole === ApplicantRole.PARENT) navigate('/skjema/forelder/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.GUARDIAN) navigate('/skjema/verge/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.CHILD) navigate('/skjema/barn/steg/om-deg')
    }

    const logErrors = (data: FieldErrors<IApplicant>) => {
        Object.keys(data).map((error) => logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'FrontPage', id: error }))
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
                        <BodyLong>{t('parentApplicantInformation')}</BodyLong>
                        <FormElement>
                            <Trans value={t('fnrOrBirthdateRequired')} />
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
                    <ProcessingDataParentAndGuardian t={t} isParent={true} />
                </>
            )}

            {ApplicantRole.GUARDIAN === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('guardianApplicantInformationLabel')}</Label>
                        <BodyLong spacing>{t('guardianApplicantInformation')}</BodyLong>
                        <BodyLong spacing>
                            <Trans value={t('guardiansMustSendDocumentation')} />
                        </BodyLong>
                        <BodyLong>
                            <Trans value={t('fnrOrBirthdateRequired')} />
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
                    <ProcessingDataParentAndGuardian t={t} isParent={false} />
                </>
            )}

            {ApplicantRole.CHILD === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('CHILD')}</Label>
                        <BodyLong>
                            <Trans value={t('fnrOrBirthdateRequired')} />
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
                <Button size={'medium'} variant={'primary'} onClick={handleSubmit(next, logErrors)}>
                    {t('startApplication')}
                </Button>
            </FormGroup>
        </FormProvider>
    )
}
