import { Alert, BodyLong, Link } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { IDeceasedParent, ILivingParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useUserContext } from '../../../context/user/UserContext'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantRole, ApplicantSituation } from '../scenario/ScenarioSelection'
import { SummaryAboutChildren } from './fragments/SummaryAboutChildren'
import { SummaryAboutDeceasedParent } from './fragments/SummaryAboutDeceasedParent'
import { SummaryAboutLivingParent } from './fragments/SummaryAboutLivingParent'
import { SummeryAboutYou } from './fragments/SummaryAboutYou'
import { SummaryYourSituation } from './fragments/SummaryYourSituation'
import { mapTilBarnepensjonSoeknadListe } from '../../../api/dto/soeknadMapper'
import { sendApplication } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import { Barnepensjon } from '../../../api/dto/InnsendtSoeknad'

const pathPrefix = (applicant?: { applicantRole?: ApplicantRole }): string => {
    const prefix = {
        GUARDIAN: 'verge',
        CHILD: 'barn',
        PARENT: 'forelder',
    }
    return applicant?.applicantRole ? prefix[applicant.applicantRole] : ''
}

export default function Summary({ prev }: StepProps) {
    const { t } = useTranslation('summary')

    const { state: application } = useApplicationContext()
    const { state: user } = useUserContext()

    const navigate = useNavigate()

    const [error, setError] = useState(false)

    const send = () => {
        const soeknader: Barnepensjon[] = mapTilBarnepensjonSoeknadListe(t, application, user)

        sendApplication({ soeknader })
            .then((response) => {
                console.log(response)

                navigate('/skjema/kvittering')
            })
            .catch((e) => {
                console.error(e)
                setError(true)
            })
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

                {!isEmpty(application.firstParent) &&
                    (application.applicant?.applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED ? (
                        <SummaryAboutLivingParent
                            aboutTheParent={application.firstParent as ILivingParent}
                            pathPrefix={pathPrefix(application?.applicant)}
                        />
                    ) : (
                        <SummaryAboutDeceasedParent
                            aboutTheParent={application.firstParent as IDeceasedParent}
                            pathPrefix={pathPrefix(application?.applicant)}
                        />
                    ))}

                {!isEmpty(application.secondParent) && (
                    <SummaryAboutDeceasedParent
                        aboutTheParent={application.secondParent as IDeceasedParent}
                        pathPrefix={pathPrefix(application?.applicant)}
                    />
                )}

                {!isEmpty(application.aboutChildren) &&
                    application.aboutChildren &&
                    application.aboutChildren?.children?.length !== 0 && (
                        <SummaryAboutChildren
                            aboutChildren={application.aboutChildren}
                            pathPrefix={pathPrefix(application?.applicant)}
                            applicationRole={application.applicant?.applicantRole}
                            parents={{
                                firstParent: application.firstParent,
                                secondParent: application.secondParent,
                            }}
                        />
                    )}
            </FormGroup>

            {error && (
                <FormGroup>
                    <Alert variant={'error'}>
                        {t('errorWhenSending')}
                        <Link href={t('errorWhenSendingHref')}>{t('errorWhenSendingLink')}</Link>
                    </Alert>
                </FormGroup>
            )}

            <Navigation right={{ onClick: send, label: t('sendApplicationButton') }} left={{ onClick: prev }} />
        </FormGroup>
    )
}
