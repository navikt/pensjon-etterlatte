import { Alert, BodyLong, Button, Heading, Ingress, Link } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import FormGroup from '../../common/FormGroup'
import { RHFRadio } from '../../common/rhf/RHFRadio'
import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'

enum ApplicantRole {
    PARENT = 'PARENT',
    GUARDIAN = 'GUARDIAN',
    CHILD = 'CHILD',
}

enum ApplicantSituation {
    BOTH_PARENTS_DECEASED = 'BOTH_PARENTS_DECEASED',
    ONE_PARENT_DECEASED = 'ONE_PARENT_DECEASED',
}

export default function ScenarioSelection() {
    const navigate = useNavigate()
    const { t } = useTranslation('velgScenarie')
    // todo: midleridig hack for å gå videre til neste side.

    const methods = useForm<any>({
        defaultValues: {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    function next(data: any) {
        if (data.applicantRole === ApplicantRole.PARENT) navigate('/skjema/forelder/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.GUARDIAN) navigate('/skjema/verge/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.CHILD) navigate('/skjema/barn/steg/om-deg')
    }

    const selectedRole = watch('applicantRole')

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <Heading size={'medium'} className={'center'}>
                    {t('tittel')}
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
                        {t('alert.tittel')}
                    </Heading>
                    <BodyLong className={'center'}>
                        {t('alert.beskrivelse')}
                        <br />
                        <br />
                        {t('alert.beskrivelse2')}&nbsp;
                        <Link href={t('alert.lenke.href')}>{t('alert.lenke.tekst')}</Link>
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
