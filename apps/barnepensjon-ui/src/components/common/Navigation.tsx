import { BodyShort, Box, Button, ButtonProps, Heading, HStack, Modal, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { deleteDraft } from '../../api/api'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { ActionTypes as ApplicationActionTypes } from '../../context/application/application'
import { useUserContext } from '../../context/user/UserContext'
import { ActionTypes as UserActionTypes } from '../../context/user/user'
import { EventType, LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import useTranslation from '../../hooks/useTranslation'

interface NavButtonProps extends Pick<ButtonProps, 'variant' | 'disabled'> {
    label?: string
    onClick?: () => void
}

interface NavigationProps {
    right?: NavButtonProps
    left?: NavButtonProps
    hideCancel?: boolean
    loading?: boolean
}

export default function Navigation({ right, left, hideCancel, loading }: NavigationProps) {
    const { t } = useTranslation('navigation')
    const { logEvent } = useAnalytics()

    const { dispatch: applicationDispatch } = useApplicationContext()
    const { dispatch: userDispatch } = useUserContext()

    const [isOpen, setIsOpen] = useState(false)

    const cancelApplication = () => {
        logEvent(LogEvents.CLICK, { type: EventType.CANCEL_APPLICATION, svar: 'ja' })

        applicationDispatch({ type: ApplicationActionTypes.RESET })
        userDispatch({ type: UserActionTypes.RESET })

        window.location.href = 'https://www.nav.no/barnepensjon'
    }

    const continueApplication = () => {
        logEvent(LogEvents.CLICK, { type: EventType.CANCEL_APPLICATION, svar: 'nei' })

        setIsOpen(false)
    }

    const deleteApplication = () => {
        deleteDraft().then(() => cancelApplication())
    }

    return (
        <>
            <Box marginBlock="0 8">
                <VStack marginBlock="0 4" align="center">
                    <HStack gap="4">
                        {!!left && (
                            <Button
                                type={'button'}
                                variant={left?.variant || 'secondary'}
                                onClick={left?.onClick}
                                disabled={left?.disabled}
                                loading={loading}
                            >
                                {left?.label || t('backButton', { ns: 'btn' })}
                            </Button>
                        )}

                        {!!right && (
                            <Button
                                type={'button'}
                                variant={right?.variant || 'primary'}
                                onClick={right?.onClick}
                                disabled={right?.disabled}
                                loading={loading}
                            >
                                {right?.label || t('nextButton', { ns: 'btn' })}
                            </Button>
                        )}
                    </HStack>
                </VStack>
                {!hideCancel && (
                    <VStack marginBlock="0 4" align="center">
                        <Button id={'avbryt-btn'} variant={'tertiary'} type={'button'} onClick={() => setIsOpen(true)}>
                            {t('cancelButton', { ns: 'btn' })}
                        </Button>
                    </VStack>
                )}
            </Box>

            <Modal open={isOpen} onClose={() => setIsOpen(false)} aria-label={t('cancelApplicationTitle')}>
                <Modal.Header>
                    <Heading size={'medium'}>{t('cancelApplicationTitle')}</Heading>
                </Modal.Header>

                <Modal.Body>
                    <BodyShort textColor="subtle">{t('cancelApplicationBody')}</BodyShort>
                </Modal.Body>

                <Modal.Footer>
                    <VStack align="center" width="100%">
                        <HStack gap="4" wrap={false}>
                            <Button
                                id={'avbryt-nei-btn'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={continueApplication}
                            >
                                {t('continueApplicationButton')}
                            </Button>

                            <Button
                                id={'avbryt-ja-btn'}
                                variant={'primary'}
                                type={'button'}
                                onClick={cancelApplication}
                            >
                                {t('cancelApplicationButton')}
                            </Button>
                        </HStack>
                    </VStack>

                    <VStack align="center" width="100%">
                        <div>
                            <Button id={'slett-soeknad'} type={'button'} variant={'danger'} onClick={deleteApplication}>
                                {t('deleteApplicationButton')}
                            </Button>
                        </div>
                    </VStack>
                </Modal.Footer>
            </Modal>
        </>
    )
}
