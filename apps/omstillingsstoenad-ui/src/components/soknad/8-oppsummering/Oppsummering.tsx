import { Accordion, Alert, BodyLong, Box, Button, Heading, Link, Loader, Modal } from '@navikt/ds-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { StegPath } from '~typer/steg'
import { erMellomOktoberogDesember } from '~utils/dato'
import { sendSoeknad } from '../../../api/api'
import { SoeknadRequest, SoeknadType } from '../../../api/dto/InnsendtSoeknad'
import { mapTilBarnepensjonSoeknadListe, mapTilOmstillingsstoenadSoeknad } from '../../../api/mapper/soeknadMapper'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import { LogEvents, useAnalytics } from '../../../hooks/useAnalytics'
import SoknadSteg from '../../../typer/SoknadSteg'
import Navigasjon from '../../felles/Navigasjon'
import { OppsummeringBarnepensjon } from './fragmenter/OppsummeringBarnepensjon'
import { OppsummeringInntektenDin } from './fragmenter/OppsummeringInntektenDin'
import { OppsummeringMerSituasjonenDin } from './fragmenter/OppsummeringMerSituasjonenDin'
import { OppsummeringOmDeg } from './fragmenter/OppsummeringOmDeg'
import { OppsummeringOmDegOgAvdoed } from './fragmenter/OppsummeringOmDegOgAvdoed'
import { OppsummeringOmDenAvdoede } from './fragmenter/OppsummeringOmDenAvdoede'
import { OppsummeringSituasjonenDin } from './fragmenter/OppsummeringSituasjonenDin'

const Oppsummering = ({ forrige }: SoknadSteg) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { state: soeknad, dispatch } = useSoknadContext()
    const { state: bruker } = useBrukerContext()
    const { logEvent } = useAnalytics()

    const [senderSoeknad, setSenderSoeknad] = useState(false)
    const [error, setError] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const fylltUtAarsinntektForNesteAar = () => {
        if (erMellomOktoberogDesember()) {
            const loennsinntekt = soeknad.inntektenDin.loennsinntekt
            const naeringsinntekt = soeknad.inntektenDin.loennsinntekt
            if (loennsinntekt) {
                if (
                    (loennsinntekt?.norge && loennsinntekt.norge?.inntektNesteAar?.aarsinntekt === undefined) ||
                    (loennsinntekt?.utland && loennsinntekt.utland?.inntektNesteAar?.aarsinntekt === undefined)
                ) {
                    return false
                }
            }

            if (naeringsinntekt) {
                if (
                    (naeringsinntekt?.norge && naeringsinntekt.norge?.inntektNesteAar?.aarsinntekt === undefined) ||
                    (naeringsinntekt?.utland && naeringsinntekt.utland?.inntektNesteAar?.aarsinntekt === undefined)
                ) {
                    return false
                }
            }
            return true
        }
        return true
    }

    const send = () => {
        setSenderSoeknad(true)
        setError(false)

        const omstillingsstoenad = mapTilOmstillingsstoenadSoeknad(t, soeknad, bruker)
        const barnepensjonSoeknader = mapTilBarnepensjonSoeknadListe(t, soeknad, bruker)

        const soeknadBody: SoeknadRequest = {
            soeknader: [omstillingsstoenad, ...barnepensjonSoeknader],
        }

        sendSoeknad(soeknadBody)
            .then(() => {
                logEvent(LogEvents.SEND_SOKNAD, { type: SoeknadType.OMSTILLINGSSTOENAD })

                barnepensjonSoeknader.forEach(() => {
                    logEvent(LogEvents.SEND_SOKNAD, { type: SoeknadType.BARNEPENSJON })
                })

                dispatch({ type: ActionTypes.TILBAKESTILL })
                navigate(`/skjema/sendt`)
            })
            .catch((error) => {
                setIsOpen(false)
                console.log(error)
                setSenderSoeknad(false)
                setError(true)
            })
    }

    return (
        <>
            <Box marginBlock="4">
                <Heading size={'medium'} className={'center'}>
                    {t('oppsummering.tittel')}
                </Heading>
            </Box>

            <Box marginBlock="4">
                <BodyLong>{t('oppsummering.beskrivelse')}</BodyLong>
            </Box>

            <Accordion>
                <OppsummeringOmDeg omDeg={soeknad.omDeg} bruker={bruker} senderSoeknad={senderSoeknad} />
                <OppsummeringOmDenAvdoede omDenAvdoede={soeknad.omDenAvdoede} senderSoeknad={senderSoeknad} />
                <OppsummeringOmDegOgAvdoed omDegOgAvdoed={soeknad.omDegOgAvdoed} senderSoeknad={senderSoeknad} />
                <OppsummeringSituasjonenDin situasjonenDin={soeknad.situasjonenDin} senderSoeknad={senderSoeknad} />
                <OppsummeringMerSituasjonenDin
                    merOmSituasjonenDin={soeknad.merOmSituasjonenDin}
                    senderSoeknad={senderSoeknad}
                />
                <OppsummeringInntektenDin inntektenDin={soeknad.inntektenDin} senderSoeknad={senderSoeknad} />
                <OppsummeringBarnepensjon
                    opplysningerOmBarn={soeknad.opplysningerOmBarn}
                    senderSoeknad={senderSoeknad}
                />
            </Accordion>

            <br />

            {!fylltUtAarsinntektForNesteAar() && (
                <Box marginBlock="0 12">
                    <Alert variant={'error'}>
                        {t('oppsummering.ikkeFylltUtAarsinntekt')}
                        <RouterLink to={`/skjema/steg/${StegPath.InntektenDin}`}>
                            {t('oppsummering.ikkeFylltUtAarsinntekt.tittel')}
                        </RouterLink>
                    </Alert>
                </Box>
            )}

            {error && (
                <Box marginBlock="0 12">
                    <Alert variant={'error'}>
                        {t('oppsummering.feilVedSending')}
                        <Link href={t('oppsummering.feilVedSending.href')}>
                            {t('oppsummering.feilVedSending.tittel')}
                        </Link>
                    </Alert>
                </Box>
            )}

            <Navigasjon
                forrige={{ onClick: forrige }}
                send={{ onClick: () => setIsOpen(true) }}
                disabled={senderSoeknad}
            />

            <Modal
                open={isOpen}
                onClose={() => {
                    if (!senderSoeknad) setIsOpen(false)
                }}
                data-testid={'spoersmaal-modal'}
                aria-label={t(senderSoeknad ? 'oppsummering.senderSoeknad.tittel' : 'oppsummering.sendSoeknad.tittel')}
            >
                <Modal.Header>
                    <Heading size={'medium'}>
                        {t(senderSoeknad ? 'oppsummering.senderSoeknad.tittel' : 'oppsummering.sendSoeknad.tittel')}
                    </Heading>
                </Modal.Header>

                <Modal.Body>
                    {senderSoeknad ? (
                        <Loader size={'xlarge'} />
                    ) : (
                        <BodyLong>{t('oppsummering.sendSoeknad.innhold')}</BodyLong>
                    )}
                </Modal.Body>
                {!senderSoeknad && (
                    <Modal.Footer>
                        <Button
                            id={'avbryt-nei-btn'}
                            variant={'primary'}
                            type={'button'}
                            onClick={send}
                            style={{ margin: '10px' }}
                        >
                            {t('knapp.ja')}
                        </Button>
                        <Button
                            id={'avbryt-ja-btn'}
                            variant={'secondary'}
                            type={'button'}
                            onClick={() => setIsOpen(false)}
                            style={{ margin: '10px' }}
                        >
                            {t('knapp.nei')}
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </>
    )
}

export default Oppsummering
