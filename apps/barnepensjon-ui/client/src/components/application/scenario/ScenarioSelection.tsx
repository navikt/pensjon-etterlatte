import { Alert, BodyLong, Button, Heading, Ingress, Link } from '@navikt/ds-react'
import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ActionTypes, IApplicant } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import { RHFRadio } from '../../common/rhf/RHFRadio'

export enum ApplicantRole {
    PARENT = 'PARENT',
    GUARDIAN = 'GUARDIAN',
    CHILD = 'CHILD',
}

export enum ApplicantSituation {
    BOTH_PARENTS_DECEASED = 'BOTH_PARENTS_DECEASED',
    ONE_PARENT_DECEASED = 'ONE_PARENT_DECEASED',
}

export default function ScenarioSelection() {
    const navigate = useNavigate()
    const { t } = useTranslation('selectScenario')
    const { dispatch } = useApplicationContext()

    const methods = useForm<IApplicant>({
        defaultValues: {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    function next(data: any) {
        dispatch({ type: ActionTypes.UPDATE_APPLICANT, payload: data })

        if (data.applicantRole === ApplicantRole.PARENT) navigate('/skjema/forelder/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.GUARDIAN) navigate('/skjema/verge/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.CHILD) navigate('/skjema/barn/steg/om-deg')
    }

    const selectedRole = watch('applicantRole')

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <Heading size={'medium'} className={'center'}>
                    {t('title')}
                </Heading>
            </FormGroup>

            <FormGroup>
                <Ingress>{t('ingress')}</Ingress>
            </FormGroup>

            <FormGroup>
                <RHFRadio
                    legend={'Hvem søker?'}
                    name={'applicantRole'}
                    radios={Object.values(ApplicantRole).map((value) => {
                        return { label: t(value), value, required: true } as RadioProps
                    })}
                />
            </FormGroup>

            {[ApplicantRole.GUARDIAN, ApplicantRole.CHILD].includes(selectedRole) && (
                <FormGroup>
                    <RHFRadio
                        legend={'Hva er gjeldende for situasjonen?'}
                        name={'applicantSituation'}
                        radios={Object.values(ApplicantSituation).map((value) => {
                            return { label: t(value), value, required: true } as RadioProps
                        })}
                    />
                </FormGroup>
            )}

            <FormGroup>
                <Alert inline={true} variant={'info'}>
                    <Heading size={'small'} className={'center'}>
                        {t('alert.title')}
                    </Heading>
                    <BodyLong className={'center'}>
                        {t('alert.description')}
                        <br />
                        <br />
                        {t('alert.description2')}&nbsp;
                        <Link href={t('alert.link.href')}>{t('alert.link.text')}</Link>
                    </BodyLong>
                </Alert>
            </FormGroup>

            <ErrorSummaryWrapper errors={errors} />

            <FormGroup>
                <Button onClick={handleSubmit(next)}>Fortsett</Button>
            </FormGroup>
        </FormProvider>
    )
}
