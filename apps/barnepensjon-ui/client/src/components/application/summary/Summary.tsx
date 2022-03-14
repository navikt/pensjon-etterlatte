import { Alert, BodyLong, Link } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { IDeceasedParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useUserContext } from '../../../context/user/UserContext'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantRole } from '../scenario/ScenarioSelection'
import { SummaryAboutChildren } from './fragments/SummaryAboutChildren'
import { SummaryAboutParent } from './fragments/SummaryAboutParent'
import { SummeryAboutYou } from './fragments/SummaryAboutYou'
import { SummaryYourSituation } from './fragments/SummaryYourSituation'

const pathPrefix = (applicant?: { applicantRole?: ApplicantRole }): string => {
    const prefix = {
        GUARDIAN: 'verge',
        CHILD: 'barn',
        PARENT: 'forelder',
    }
    return applicant?.applicantRole ? prefix[applicant.applicantRole] : ''
}

export default function Summary({ prev }: StepProps) {
    const { state: application } = useApplicationContext()
    const { state: user } = useUserContext()

    const { t } = useTranslation('summary')

    const [error] = useState(false)

    const send = () => {
        // TODO: Map to InnsendSoeknad and send to backend
        /* sendApplication({})
            .then((response) => {
                console.log(response)

                navigate('/skjema/kvittering')
            })
            .catch((e) => {
                console.error(e)
                setError(true)
            })*/
    }

    return (
        <FormGroup>
            <StepHeading>{t('summaryTitle')}</StepHeading>
            <FormGroup>
                <BodyLong>{t('readTheSummaryBeforeSending')}</BodyLong>
            </FormGroup>

            <FormGroup>
                {!isEmpty(application.aboutYou) && !isEmpty(user) && (
                    <SummeryAboutYou
                        aboutYou={application.aboutYou}
                        user={user}
                        pathPrefix={pathPrefix(application?.applicant)}
                    />
                )}

                {!isEmpty(application.yourSituation) && application.yourSituation && (
                    <SummaryYourSituation
                        yourSituation={application.yourSituation}
                        pathPrefix={pathPrefix(application?.applicant)}
                    />
                )}

                {!isEmpty(application.firstParent) && application.firstParent && (
                    <SummaryAboutParent
                        aboutTheParent={application.firstParent as IDeceasedParent}
                        typeOfParent={application.applicant?.applicantSituation}
                        pathPrefix={pathPrefix(application?.applicant)}
                    />
                )}

                {!isEmpty(application.secondParent) && application.secondParent && (
                    <SummaryAboutParent
                        aboutTheParent={application.secondParent as IDeceasedParent}
                        pathPrefix={pathPrefix(application?.applicant)}
                    />
                )}

                {!isEmpty(application.aboutChildren) && application.aboutChildren && (
                    <SummaryAboutChildren
                        aboutChildren={application.aboutChildren}
                        pathPrefix={pathPrefix(application?.applicant)}
                    />
                )}
            </FormGroup>

            {error && (
                <FormGroup>
                    <Alert variant={'error'}>
                        {t('oppsummering.feilVedSending')}
                        <Link href={t('oppsummering.feilVedSending.href')}>
                            {t('oppsummering.feilVedSending.tittel')}
                        </Link>
                    </Alert>
                </FormGroup>
            )}

            <Navigation right={{ onClick: send }} left={{ onClick: prev }} />
        </FormGroup>
    )
}
