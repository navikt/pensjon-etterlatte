import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { ActionTypes, IDeceasedParent, ILivingParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useUserContext } from '../../../context/user/UserContext'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import Navigation, { NavRow } from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantRole, ApplicantSituation } from '../scenario/ScenarioSelection'
import { SummaryAboutChildren } from './fragments/SummaryAboutChildren'
import { SummaryAboutDeceasedParent } from './fragments/SummaryAboutDeceasedParent'
import { SummaryAboutLivingParent } from './fragments/SummaryAboutLivingParent'
import { SummaryAboutYou } from './fragments/SummaryAboutYou'
import { SummaryYourSituation } from './fragments/SummaryYourSituation'
import { mapTilBarnepensjonSoeknadListe } from '../../../api/dto/soeknadMapper'
import { sendApplication } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import { Barnepensjon, SoeknadType } from '../../../api/dto/InnsendtSoeknad'
import { LogEvents, useAmplitude } from '../../../hooks/useAmplitude'
import Trans from '../../common/Trans'
import { Translation } from '../../../context/language/translations'
import EyModal from '../../common/EyModal'
import FormElement from '../../common/FormElement'
import { BodyShortMuted } from '../../common/StyledTypography'

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
    const { logEvent } = useAmplitude()

    const { state: application, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()

    const navigate = useNavigate()

    const [error, setError] = useState<Translation>()
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const send = () => {
        const soeknader: Barnepensjon[] = mapTilBarnepensjonSoeknadListe(t, application, user)

        setIsOpen(false)
        setLoading(true)

        sendApplication({ soeknader })
            .then(() => {
                soeknader.forEach(() => logEvent(LogEvents.SEND_APPLICATION, { type: SoeknadType.BARNEPENSJON }))
                dispatch({ type: ActionTypes.RESET })
                setLoading(false)
                navigate('/skjema/kvittering')
            })
            .catch((e: Error) => {
                setLoading(false)
                logEvent(LogEvents.SEND_APPLICATION_ERROR)

                if (e.message === 'FERDIGSTILT') setError(t('errorFromConflict'))
                else setError(t('errorWhenSending'))
            })
    }

    const openModal = () => setIsOpen(true)

    return (
        <FormGroup>
            <StepHeading>{t('summaryTitle')}</StepHeading>
            <FormGroup>
                <BodyLong>{t('readTheSummaryBeforeSending')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <SummaryAboutYou
                    aboutYou={application.aboutYou}
                    user={user}
                    pathPrefix={pathPrefix(application?.applicant)}
                />

                <SummaryYourSituation
                    yourSituation={application.yourSituation}
                    pathPrefix={pathPrefix(application?.applicant)}
                />

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

                <SummaryAboutDeceasedParent
                    aboutTheParent={application.secondParent as IDeceasedParent}
                    pathPrefix={pathPrefix(application?.applicant)}
                />

                <SummaryAboutChildren
                    aboutChildren={application.aboutChildren}
                    pathPrefix={pathPrefix(application?.applicant)}
                    applicationRole={application.applicant?.applicantRole}
                    parents={{
                        firstParent: application.firstParent,
                        secondParent: application.secondParent,
                    }}
                />
            </FormGroup>

            {error && (
                <FormGroup>
                    <Alert variant={'error'}>
                        <Trans value={error} />
                    </Alert>
                </FormGroup>
            )}

            <Navigation
                right={{ onClick: openModal, label: t('sendApplicationButton') }}
                left={{ onClick: prev }}
                loading={loading}
            />

            <EyModal open={isOpen} onClose={() => setIsOpen(false)}>
                <FormElement>
                    <Heading size={'medium'}>{t('sendApplicationTitle')}</Heading>
                </FormElement>

                <FormGroup>
                    <BodyShortMuted size={'small'}>{t('sendApplicationBody')}</BodyShortMuted>
                </FormGroup>
                <NavRow>
                    <Button
                        id={'avbryt-ja-btn'}
                        variant={'secondary'}
                        type={'button'}
                        onClick={() => setIsOpen(false)}
                        style={{ margin: '10px' }}
                    >
                        {t('noButton', { ns: 'btn' })}
                    </Button>
                    <Button
                        id={'avbryt-nei-btn'}
                        variant={'primary'}
                        type={'button'}
                        onClick={send}
                        style={{ margin: '10px' }}
                    >
                        {t('yesButton', { ns: 'btn' })}
                    </Button>
                </NavRow>
            </EyModal>
        </FormGroup>
    )
}
