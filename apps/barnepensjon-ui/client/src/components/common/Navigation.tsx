import { useUserContext } from '../../context/user/UserContext'
import { useState } from 'react'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { ActionTypes as ApplicationActionTypes } from '../../context/application/application'
import { ActionTypes as UserActionTypes } from '../../context/user/user'
import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react'
import FormGroup from './FormGroup'
import styled from 'styled-components'

const NavRow = styled.div`
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
    const { dispatch: applicationDispatch } = useApplicationContext()
    const { dispatch: userDispatch } = useUserContext()

    const [isOpen, setIsOpen] = useState(false)

    const avbrytSoeknad = () => {
        applicationDispatch({ type: ApplicationActionTypes.RESET })
        userDispatch({ type: UserActionTypes.RESET })

        window.location.href = 'https://www.nav.no/barnepensjon'
    }

    const fortsettSoknad = () => {
        setIsOpen(false)
    }

    return (
        <>
            <NavFooter>
                <NavRow>
                    {!!prev && (
                        <Button variant={'primary'} type={'button'} onClick={prev}>
                            Tilbake
                        </Button>
                    )}

                    {!!next && (
                        <Button variant={'primary'} type={'button'} onClick={next}>
                            Neste
                        </Button>
                    )}

                    {!!send && (
                        <Button variant={'primary'} type={'button'} onClick={send}>
                            Send søknad
                        </Button>
                    )}
                </NavRow>
            </NavFooter>

            <NavRow>
                <Button id={'avbryt-btn'} variant={'secondary'} type={'button'} onClick={() => setIsOpen(true)}>
                    Avbryt
                </Button>
            </NavRow>

            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="spoersmaal-modal skjul-modal-knapp ey-modal"
            >
                <FormGroup>
                    <Heading size={'medium'}>Vil du avbryte søknaden?</Heading>
                </FormGroup>

                <BodyShort className="mute avbryt-text">Litt info om å fortsette søknaden</BodyShort>

                <Button
                    id={'avbryt-nei-btn'}
                    variant={'primary'}
                    type={'button'}
                    onClick={fortsettSoknad}
                    style={{ margin: '10px' }}
                >
                    Nei, fortsett
                </Button>

                <Button
                    id={'avbryt-ja-btn'}
                    variant={'secondary'}
                    type={'button'}
                    onClick={avbrytSoeknad}
                    style={{ margin: '10px' }}
                >
                    Ja, avbryt
                </Button>

                {/*<FormGroup>
                    <a href="#" id={'slett-soeknad'} style={{ color: '#C65D4E' }} onClick={}>
                        Slett søknad
                    </a>
                </FormGroup>*/}
            </Modal>
        </>
    )
}
