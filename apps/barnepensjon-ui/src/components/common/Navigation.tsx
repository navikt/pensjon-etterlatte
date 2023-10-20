import { useUserContext } from '../../context/user/UserContext'
import { useState } from 'react'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { ActionTypes as ApplicationActionTypes } from '../../context/application/application'
import { ActionTypes as UserActionTypes } from '../../context/user/user'
import { Button, ButtonProps, Heading, Loader, Modal } from '@navikt/ds-react'
import FormGroup from './FormGroup'
import styled, { css } from 'styled-components'
import { deleteDraft } from '../../api/api'
import { BodyShortMuted } from './StyledTypography'
import useTranslation from '../../hooks/useTranslation'
import { EventType, LogEvents, useAmplitude } from '../../hooks/useAmplitude'

export const NavRow = styled.div<{ disabled?: boolean }>`
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 1rem;
    margin-bottom: 2rem;

    .knapp {
        margin-bottom: 0;
    }

    ${(props) => {
        if (props.disabled) {
            return css`
                opacity: 0.6;
                pointer-events: none;
            `
        }
    }}
`

const NavFooter = styled(FormGroup)`
    @media screen and (max-width: 650px) {
        .knapp {
            font-size: 1rem;
            padding: 0 1rem;
            width: 50%;
        }
    }
`

const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`

const FlatDangerButton = styled(Button)`
    color: #c65d4e;

    &:hover {
        box-shadow: inset 0 0 0 2px #c65d4e;
    }
`

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
    const { logEvent } = useAmplitude()

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
            <NavFooter>
                <NavRow disabled={loading}>
                    {!!left && (
                        <Button
                            type={'button'}
                            variant={left?.variant || 'secondary'}
                            onClick={left?.onClick}
                            disabled={left?.disabled}
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
                        >
                            {right?.label || t('nextButton', { ns: 'btn' })} {loading && <Loader />}
                        </Button>
                    )}
                </NavRow>

                {!hideCancel && (
                    <NavRow>
                        <Button id={'avbryt-btn'} variant={'tertiary'} type={'button'} onClick={() => setIsOpen(true)}>
                            {t('cancelButton', { ns: 'btn' })}
                        </Button>
                    </NavRow>
                )}
            </NavFooter>

            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>
                    <Heading size={'medium'}>{t('cancelApplicationTitle')}</Heading>
                </Modal.Header>

                <Modal.Body>
                    <BodyShortMuted style={{ textAlign: 'center' }} size={'small'}>
                        {t('cancelApplicationBody')}
                    </BodyShortMuted>
                </Modal.Body>

                <Modal.Footer>
                    <FlexCenter>
                        <Button
                            id={'avbryt-nei-btn'}
                            variant={'secondary'}
                            type={'button'}
                            onClick={continueApplication}
                            style={{ margin: '10px' }}
                        >
                            {t('continueApplicationButton')}
                        </Button>

                        <Button
                            id={'avbryt-ja-btn'}
                            variant={'primary'}
                            type={'button'}
                            onClick={cancelApplication}
                            style={{ margin: '10px' }}
                        >
                            {t('cancelApplicationButton')}
                        </Button>
                    </FlexCenter>

                    <FlexCenter>
                        <FlatDangerButton
                            id={'slett-soeknad'}
                            type={'button'}
                            variant={'tertiary'}
                            onClick={deleteApplication}
                        >
                            {t('deleteApplicationButton')}
                        </FlatDangerButton>
                    </FlexCenter>
                </Modal.Footer>
            </Modal>
        </>
    )
}
