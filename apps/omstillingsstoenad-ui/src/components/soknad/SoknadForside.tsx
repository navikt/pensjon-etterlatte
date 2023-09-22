import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import { Veileder } from '../felles/Veileder'
import { Accordion, Alert, BodyLong, Button, ConfirmationPanel, Heading, Link } from '@navikt/ds-react'
import { LogEvents, useAmplitude } from '../../utils/amplitude'
import { useLanguage } from '../../hooks/useLanguage'
import { Spraakvalg } from '../felles/Spraakvalg'
import { MuligeSteg } from '../../typer/steg'
import { SkjemaGruppe } from '../felles/SkjemaGruppe'

const SoknadForside = () => {
    const navigate = useNavigate()
    const { logEvent } = useAmplitude()
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext()
    useLanguage()

    const startSoeknad = () => {
        const foersteSteg = MuligeSteg[0]
        logEvent(LogEvents.AAPNE_SOKNAD)
        navigate(`/skjema/steg/${foersteSteg.path}`)
    }

    const innloggetBrukerNavn = `${brukerState?.fornavn} ${brukerState?.etternavn}`

    const heiTekst = (
        <div className={!brukerState?.fornavn ? 'blur-text' : ''}>
            {t('forside.hei', { navn: innloggetBrukerNavn })}
        </div>
    )

    return (
        <>
            <SkjemaGruppe>
                <Veileder>{heiTekst}</Veileder>
            </SkjemaGruppe>

            <Spraakvalg />

            <SkjemaGruppe>
                <Alert inline={true} variant={'warning'}>
                    <b>
                        {t('forside.omYtelsene.papirsoeknad.innhold')}&nbsp;
                        <Link href={t('forside.omYtelsene.papirsoeknad.href')}>
                            {t('forside.omYtelsene.papirsoeknad.tekst')}
                        </Link>
                    </b>
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading spacing size={'large'}>
                    {t('forside.tittel')}
                </Heading>

                <BodyLong spacing>{t('forside.omYtelsene.innhold')}</BodyLong>

                <BodyLong>
                    <Link href={t('forside.omYtelsene.lenkeGjenlevende.href')}>
                        {t('forside.omYtelsene.lenkeGjenlevende.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside.barnepensjon.tittel')}</Heading>

                <BodyLong spacing>{t('forside.barnepensjon.innhold')}</BodyLong>
                <BodyLong>
                    <Link href={t('forside.barnepensjon.href')}>{t('forside.barnepensjon.tekst')}</Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside.omSoeknaden.tittel')}</Heading>
                <BodyLong spacing> {t('forside.omSoeknaden.innhold')}</BodyLong>

                <Accordion>
                    <Accordion.Item>
                        <Accordion.Header>{t('forside.uthentingAvInfo.tittel')}</Accordion.Header>
                        <Accordion.Content>
                            <BodyLong>{t('forside.uthentingAvInfo.innhold')}</BodyLong>

                            <ul>
                                <li>
                                    <BodyLong>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: t('forside.uthentingAvInfo.innholdListe.li1'),
                                            }}
                                        />
                                    </BodyLong>
                                </li>
                                <li>
                                    <BodyLong>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: t('forside.uthentingAvInfo.innholdListe.li2'),
                                            }}
                                        />
                                    </BodyLong>
                                </li>
                                <li>
                                    <BodyLong>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: t('forside.uthentingAvInfo.innholdListe.li3'),
                                            }}
                                        />
                                    </BodyLong>
                                </li>
                                <li>
                                    <BodyLong>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: t('forside.uthentingAvInfo.innholdListe.li4'),
                                            }}
                                        />
                                    </BodyLong>
                                </li>
                                <li>
                                    <BodyLong>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: t('forside.uthentingAvInfo.innholdListe.li5'),
                                            }}
                                        />
                                    </BodyLong>
                                </li>
                            </ul>

                            <BodyLong>
                                <Link href={t('forside.uthentingAvInfo.lenke1.href')}>
                                    {t('forside.uthentingAvInfo.lenke1.tekst')}
                                </Link>
                            </BodyLong>

                            <BodyLong>
                                <Link href={t('forside.uthentingAvInfo.lenke2.href')}>
                                    {t('forside.uthentingAvInfo.lenke2.tekst')}
                                </Link>
                            </BodyLong>
                        </Accordion.Content>
                    </Accordion.Item>

                    <Accordion.Item>
                        <Accordion.Header>{t('forside.personvern.tittel')}</Accordion.Header>
                        <Accordion.Content>
                            <BodyLong spacing> {t('forside.personvern.innhold')}</BodyLong>
                            <BodyLong>
                                <Link href={t('forside.personvern.href')}>{t('forside.personvern.tekst')}</Link>
                            </BodyLong>
                        </Accordion.Content>
                    </Accordion.Item>

                    <Accordion.Item>
                        <Accordion.Header>{t('forside.behandlingsgrunnlag.tittel')}</Accordion.Header>
                        <Accordion.Content>
                            <BodyLong spacing> {t('forside.behandlingsgrunnlag.innhold')}</BodyLong>
                            <BodyLong>
                                <Link href={t('forside.behandlingsgrunnlag.href')}>
                                    {t('forside.behandlingsgrunnlag.tekst')}
                                </Link>
                            </BodyLong>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside.soeknad.tittel')}</Heading>
                <BodyLong spacing>
                    {t('forside.soeknad.innhold')}&nbsp;
                    <Link href={t('forside.soeknad.innhold.lenke.href')}>
                        {t('forside.soeknad.innhold.lenke.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>
            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside.samtykke.tittel')}</Heading>

                <BodyLong>{t('forside.samtykke.innhold')}</BodyLong>

                <ConfirmationPanel
                    label={t('forside.samtykke.bekreftelse')}
                    checked={soknadState.harSamtykket}
                    onChange={(e) =>
                        soknadDispatch({
                            type: ActionTypes.OPPDATER_SAMTYKKE,
                            payload: (e.target as HTMLInputElement).checked,
                        })
                    }
                />
            </SkjemaGruppe>
            {soknadState.harSamtykket && !soknadState?.error && (
                <Button variant={'primary'} type={'button'} id={'start-soeknad'} onClick={startSoeknad}>
                    {t('forside.startSoeknad')}
                </Button>
            )}
        </>
    )
}

export default SoknadForside
