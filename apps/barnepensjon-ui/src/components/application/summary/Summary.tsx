import { Accordion, Alert, BodyLong, BodyShort, Button, Heading, HStack, Loader, Modal, VStack } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendApplication } from '../../../api/api'
import { Barnepensjon, SoeknadType } from '../../../api/dto/InnsendtSoeknad'
import { mapTilBarnepensjonSoeknadListe } from '../../../api/dto/soeknadMapper'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { ActionTypes, IDeceasedParent, ILivingParent } from '../../../context/application/application'
import { Translation } from '../../../context/language/translations'
import { useUserContext } from '../../../context/user/UserContext'
import { LogEvents, useAnalytics } from '../../../hooks/useAnalytics'
import useTranslation from '../../../hooks/useTranslation'
import { ApplicantRole, ApplicantSituation } from '../../../types/applicant'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import Trans from '../../common/Trans'
import { StepProps } from '../Dialogue'
import { SummaryAboutChildren } from './fragments/SummaryAboutChildren'
import { SummaryAboutDeceasedParent } from './fragments/SummaryAboutDeceasedParent'
import { SummaryAboutLivingParent } from './fragments/SummaryAboutLivingParent'
import { SummaryAboutUnknownParent } from './fragments/SummaryAboutUknownParent'
import { SummaryAboutYou } from './fragments/SummaryAboutYou'

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
    const { logEvent } = useAnalytics()

    const { state: application, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()

    const navigate = useNavigate()

    const [error, setError] = useState<Translation>()
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const send = () => {
        const isChild = application.applicant?.applicantRole === ApplicantRole.CHILD
        const soeknader: Barnepensjon[] = mapTilBarnepensjonSoeknadListe(t, application, user, isChild)

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
                setIsOpen(false)
                logEvent(LogEvents.SEND_APPLICATION_ERROR, { type: SoeknadType.BARNEPENSJON })

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
                <Accordion>
                    <SummaryAboutYou
                        aboutYou={application.aboutYou}
                        user={user}
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

                    {application.unknownParent && (
                        <SummaryAboutUnknownParent pathPrefix={pathPrefix(application?.applicant)} />
                    )}

                    <SummaryAboutChildren
                        aboutChildren={application.aboutChildren}
                        pathPrefix={pathPrefix(application?.applicant)}
                        applicationRole={application.applicant?.applicantRole}
                        applicantSituation={application.applicant?.applicantSituation}
                        parents={{
                            firstParent: application.firstParent,
                            secondParent: application.secondParent,
                        }}
                        unknownParent={!!application.unknownParent}
                    />
                </Accordion>
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

            <Modal
                open={isOpen}
                onClose={() => {
                    if (!loading) setIsOpen(false)
                }}
                aria-label={t(loading ? 'sendingApplicationTitle' : 'sendApplicationTitle')}
            >
                <Modal.Header>
                    <Heading size={'medium'}>{t(loading ? 'sendingApplicationTitle' : 'sendApplicationTitle')}</Heading>
                </Modal.Header>

                <Modal.Body>
                    {loading ? (
                        <Loader size={'xlarge'} />
                    ) : (
                        <BodyShort textColor="subtle">{t('sendApplicationBody')}</BodyShort>
                    )}
                </Modal.Body>
                {!loading && (
                    <VStack marginBlock="0 4" align="center">
                        <HStack gap="4">
                            <Button
                                id={'avbryt-ja-btn'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={() => setIsOpen(false)}
                            >
                                {t('noButton', { ns: 'btn' })}
                            </Button>
                            <Button id={'avbryt-nei-btn'} variant={'primary'} type={'button'} onClick={send}>
                                {t('yesButton', { ns: 'btn' })}
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </Modal>
        </FormGroup>
    )
}
