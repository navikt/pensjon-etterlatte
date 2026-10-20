import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { slettSoeknad } from '../../api/api'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { ActionTypes as BrukerAction } from '../../context/bruker/bruker'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes as SoknadAction } from '../../context/soknad/soknad'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import { erDato } from '../../utils/dato'

interface KnappProps {
    label?: string
    onClick?: () => void
}

const Navigasjon = ({
    neste,
    forrige,
    send,
    disabled,
    fortsettSenere,
}: {
    neste?: KnappProps
    forrige?: KnappProps
    send?: KnappProps
    disabled?: boolean
    fortsettSenere: () => Promise<boolean>
}) => {
    const { t, i18n } = useTranslation()
    const { logEvent } = useAnalytics()
    const {
        state: { sistLagretDato },
        dispatch: soknadDispatch,
    } = useSoknadContext()

    const { dispatch: brukerDispatch } = useBrukerContext()

    const dtf = Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const sistLagret = erDato(sistLagretDato) ? dtf.format(new Date(sistLagretDato!)) : undefined

    const [isOpen, setIsOpen] = useState(false)
    const [avslutter, settAvslutter] = useState(false)
    const [feil, settFeil] = useState(false)

    const avslutt = async (slett: boolean) => {
        if (avslutter) return
        settAvslutter(true)
        settFeil(false)
        try {
            if (slett) {
                await slettSoeknad()
            } else if (!(await fortsettSenere())) {
                settFeil(true)
                return
            }
            avbrytSoeknad()
        } catch {
            settFeil(true)
        } finally {
            settAvslutter(false)
        }
    }

    const avbrytSoeknad = () => {
        soknadDispatch({ type: SoknadAction.TILBAKESTILL })
        brukerDispatch({ type: BrukerAction.TILBAKESTILL })

        logEvent(LogEvents.KLIKK, { type: 'avbryt soknad', svar: 'ja' })
        window.location.href = 'https://www.nav.no/omstillingsstonad'
    }

    const fortsettSoknad = () => {
        logEvent(LogEvents.KLIKK, { type: 'avbryt soknad', svar: 'nei' })
        setIsOpen(false)
    }

    return (
        <>
            <Box marginBlock="space-0 space-48">
                <HStack gap="space-16" marginBlock="space-0 space-32" justify="center">
                    {!!forrige && (
                        <Button
                            variant={'secondary'}
                            type={'button'}
                            onClick={forrige.onClick}
                            disabled={disabled}
                            icon={<ArrowLeftIcon aria-hidden fontSize="1.5rem" />}
                        >
                            {forrige.label || t('knapp.tilbake')}
                        </Button>
                    )}

                    {!!neste && (
                        <Button
                            variant={'primary'}
                            type={'button'}
                            onClick={neste.onClick}
                            id="navigasjon-neste"
                            loading={disabled}
                            iconPosition="right"
                            icon={<ArrowRightIcon aria-hidden fontSize="1.5rem" />}
                        >
                            {neste.label || t('knapp.neste')}
                        </Button>
                    )}

                    {!!send && (
                        <Button variant={'primary'} type={'button'} onClick={send.onClick} loading={disabled}>
                            {send.label || t('knapp.sendSoeknad')}
                        </Button>
                    )}
                </HStack>

                {!!sistLagret && (
                    <HStack justify="center">
                        <BodyShort size={'small'} spacing>
                            {t('felles.sistLagret')}: {sistLagret}
                        </BodyShort>
                    </HStack>
                )}
            </Box>
            <HStack marginBlock="space-0 space-32" justify="center">
                <Button
                    id={'avbryt-btn'}
                    variant={'tertiary'}
                    type={'button'}
                    onClick={() => setIsOpen(true)}
                    disabled={disabled}
                >
                    {t('knapp.avbryt')}
                </Button>
            </HStack>
            <Modal
                open={isOpen}
                onClose={() => {
                    if (!avslutter) setIsOpen(false)
                }}
                aria-label={t('avbrytModal.spoersmaal')}
            >
                <Modal.Header>
                    <Heading size={'medium'}>{t('avbrytModal.spoersmaal')}</Heading>
                </Modal.Header>

                <Modal.Body>
                    <VStack gap="space-48" marginInline="space-32">
                        <BodyShort className="mute avbryt-text">{t('avbrytModal.informasjon')}</BodyShort>
                        {feil && <BodyShort role="alert">{t('skjema.avslutningFeilet')}</BodyShort>}
                        <HStack gap="space-16" justify="center">
                            <Button
                                id={'avbryt-nei-btn'}
                                variant={'secondary'}
                                onClick={fortsettSoknad}
                                type={'button'}
                                disabled={avslutter}
                            >
                                {t('avbrytModal.svarNei')}
                            </Button>

                            <Button
                                id={'avbryt-ja-btn'}
                                variant={'primary'}
                                onClick={() => void avslutt(false)}
                                type={'button'}
                                loading={avslutter}
                            >
                                {t('avbrytModal.svarJa')}
                            </Button>
                        </HStack>
                        <HStack justify="center">
                            <Button
                                id={'slett-soeknad'}
                                variant={'tertiary'}
                                style={{ color: 'var(--ax-bg-danger-strong)' }}
                                type={'button'}
                                onClick={() => void avslutt(true)}
                                disabled={avslutter}
                            >
                                {t('avbrytModal.svarSlett')}
                            </Button>
                        </HStack>
                    </VStack>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Navigasjon
