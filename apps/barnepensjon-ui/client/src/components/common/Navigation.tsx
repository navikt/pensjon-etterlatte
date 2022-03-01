import { useUserContext } from '../../context/user/UserContext'
import { useState } from 'react'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { ActionTypes as ApplicationActionTypes } from '../../context/application/application'
import { ActionTypes as UserActionTypes } from '../../context/user/user'
import { Button, Heading } from '@navikt/ds-react'
import FormGroup from './FormGroup'
import styled from 'styled-components'
import EyModal from './EyModal'
import { deleteDraft } from '../../api/api'
import { BodyShortMuted } from './StyledTypography'
import useTranslation from '../../hooks/useTranslation'

export const NavRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 1rem;
    margin-bottom: 2rem;

    .knapp {
        margin-bottom: 0;
    }
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

const FlatDangerButton = styled(Button)`
    color: #c65d4e;

    &:hover {
        box-shadow: inset 0 0 0 2px #c65d4e;
    }
`

export default function Navigation({
    next,
    prev,
    send,
    disabled,
}: {
    next?: () => void
    prev?: () => void
    send?: () => void
    disabled?: boolean
}) {
    const { t } = useTranslation('navigation')

    const { dispatch: applicationDispatch } = useApplicationContext()
    const { dispatch: userDispatch } = useUserContext()

    const [isOpen, setIsOpen] = useState(false)

    const cancelApplication = () => {
        applicationDispatch({ type: ApplicationActionTypes.RESET })
        userDispatch({ type: UserActionTypes.RESET })

        window.location.href = 'https://www.nav.no/barnepensjon'
    }

    const continueApplication = () => setIsOpen(false)

    const deleteApplication = () => {
        deleteDraft().then(() => cancelApplication())
    }

    return (
        <>
            <NavFooter>
                <NavRow>
                    {!!prev && (
                        <Button variant={'primary'} type={'button'} onClick={prev}>
                            {t('backButton')}
                        </Button>
                    )}

                    {!!next && (
                        <Button variant={'primary'} type={'button'} onClick={next}>
                            {t('nextButton')}
                        </Button>
                    )}

                    {!!send && (
                        <Button variant={'primary'} type={'button'} onClick={send}>
                            {t('sendApplication')}
                        </Button>
                    )}
                </NavRow>

                <NavRow>
                    <Button id={'avbryt-btn'} variant={'secondary'} type={'button'} onClick={() => setIsOpen(true)}>
                        {t('cancelButton')}
                    </Button>
                </NavRow>
            </NavFooter>

            <EyModal open={isOpen} onClose={() => setIsOpen(false)}>
                <FormGroup>
                    <Heading size={'medium'}>{t('cancelApplicationTitle')}</Heading>
                </FormGroup>

                <FormGroup>
                    <BodyShortMuted size={'small'}>{t('cancelApplicationBody')}</BodyShortMuted>
                </FormGroup>

                <NavRow>
                    <Button
                        id={'avbryt-nei-btn'}
                        variant={'primary'}
                        type={'button'}
                        onClick={continueApplication}
                        style={{ margin: '10px' }}
                    >
                        {t('continueApplicationButton')}
                    </Button>

                    <Button
                        id={'avbryt-ja-btn'}
                        variant={'secondary'}
                        type={'button'}
                        onClick={cancelApplication}
                        style={{ margin: '10px' }}
                    >
                        {t('cancelApplicationButton')}
                    </Button>
                </NavRow>

                <FormGroup>
                    <FlatDangerButton
                        id={'slett-soeknad'}
                        type={'button'}
                        variant={'tertiary'}
                        onClick={deleteApplication}
                    >
                        {t('deleteApplicationButton')}
                    </FlatDangerButton>
                </FormGroup>
            </EyModal>
        </>
    )
}
