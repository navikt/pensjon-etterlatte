import { Accordion, Alert, BodyLong, Button, Heading, Link, Loader, Modal } from '@navikt/ds-react'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { sendSoeknad } from '../../../api/api'
import { SoeknadRequest, SoeknadType } from '../../../api/dto/InnsendtSoeknad'
import { mapTilBarnepensjonSoeknadListe, mapTilOmstillingsstoenadSoeknad } from '../../../api/mapper/soeknadMapper'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import SoknadSteg from '../../../typer/SoknadSteg'
import { LogEvents, useAmplitude } from '../../../utils/amplitude'
import Navigasjon from '../../felles/Navigasjon'
import { ActionTypes } from '../../../context/soknad/soknad'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { OppsummeringOmDeg } from './fragmenter/OppsummeringOmDeg'
import { OppsummeringOmDenAvdoede } from './fragmenter/OppsummeringOmDenAvdoede'
import { OppsummeringOmDegOgAvdoed } from './fragmenter/OppsummeringOmDegOgAvdoed'
import { OppsummeringSituasjonenDin } from './fragmenter/OppsummeringSituasjonenDin'
import { OppsummeringMerSituasjonenDin } from './fragmenter/OppsummeringMerSituasjonenDin'
import { OppsummeringInntektenDin } from './fragmenter/OppsummeringInntektenDin'
import { OppsummeringBarnepensjon } from './fragmenter/OppsummeringBarnepensjon'

const Oppsummering: SoknadSteg = ({ forrige }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { state: soeknad, dispatch } = useSoknadContext()
    const { state: bruker } = useBrukerContext()
    const { logEvent } = useAmplitude()

    const [senderSoeknad, setSenderSoeknad] = useState(false)
    const [error, setError] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

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
            <SkjemaElement>
                <Heading size={'medium'} className={'center'}>
                    {t('oppsummering.tittel')}
                </Heading>
            </SkjemaElement>

            <SkjemaElement>
                <BodyLong>{t('oppsummering.beskrivelse')}</BodyLong>
            </SkjemaElement>

            <Accordion>
                <OppsummeringOmDeg omDeg={soeknad.omDeg} bruker={bruker} senderSoeknad={senderSoeknad} />
                <OppsummeringOmDenAvdoede omDenAvdoede={soeknad.omDenAvdoede} senderSoeknad={senderSoeknad} />
                <OppsummeringOmDegOgAvdoed omDegOgAvdoed={soeknad.omDegOgAvdoed} senderSoeknad={senderSoeknad} />
                <OppsummeringSituasjonenDin situasjonenDin={soeknad.situasjonenDin} senderSoeknad={senderSoeknad} />
                <OppsummeringMerSituasjonenDin
                    merOmSituasjonenDin={soeknad.merOmSituasjonenDin}
                    senderSoeknad={senderSoeknad}
                />
                <OppsummeringInntektenDin
                    inntektenDin={soeknad.inntektenDin}
                    senderSoeknad={senderSoeknad}
                    datoforDoedsfallet={soeknad.omDenAvdoede.datoForDoedsfallet!!}
                />
                <OppsummeringBarnepensjon
                    opplysningerOmBarn={soeknad.opplysningerOmBarn}
                    senderSoeknad={senderSoeknad}
                />
            </Accordion>

            <br />

            {error && (
                <SkjemaGruppe>
                    <Alert variant={'error'}>
                        {t('oppsummering.feilVedSending')}
                        <Link href={t('oppsummering.feilVedSending.href')}>
                            {t('oppsummering.feilVedSending.tittel')}
                        </Link>
                    </Alert>
                </SkjemaGruppe>
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
                        <BodyLong size={'small'}>{t('oppsummering.sendSoeknad.innhold')}</BodyLong>
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
