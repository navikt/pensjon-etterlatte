import veileder from '../assets/veileder.svg'
import { Alert, BodyLong, Button, ConfirmationPanel, Heading, Link, SpeechBubble } from '@navikt/ds-react'
import styled from 'styled-components'
import { useUserContext } from '../context/user/UserContext'
import useTranslation from '../hooks/useTranslation'

const SkjemaGruppe = styled.div`
    margin-top: 1em;
`

const Forside = () => {
    const { state: brukerState } = useUserContext()

    const innloggetBrukerNavn = `${brukerState?.fornavn} ${brukerState?.etternavn}`

    const { t } = useTranslation()

    const heiTekst = (
        <div className={!brukerState?.fornavn ? 'blur-text' : ''}>
            {t('forside:hei', { navn: innloggetBrukerNavn })}
        </div>
    )

    return (
        <div className={'forside'}>
            {/*<SkjemaGruppe>
                    <Veileder tekst={heiTekst} posisjon="høyre">
                        <img alt="veileder" src={ikon} />
                    </Veileder>
                </SkjemaGruppe>*/}

            <SpeechBubble illustration={<img alt="veileder" src={veileder} />} position="left">
                <SpeechBubble.Bubble>{heiTekst}</SpeechBubble.Bubble>
            </SpeechBubble>

            <SkjemaGruppe>
                <Alert inline={true} variant={'info'}>
                    <b>{t('forside:uthentingAvInfo.infotekst')}</b>
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading spacing size={'large'}>
                    {t('forside:tittel')}
                </Heading>

                <BodyLong spacing>{t('forside:omYtelsene.innhold')}</BodyLong>

                <Alert inline={true} variant={'warning'}>
                    <BodyLong spacing>
                        <b>
                            {t('forside:omYtelsene.papirsoeknad.innhold')}&nbsp;
                            <Link href={t('forside:omYtelsene.papirsoeknad.href')}>
                                {t('forside:omYtelsene.papirsoeknad.tekst')}
                            </Link>
                        </b>
                    </BodyLong>
                </Alert>

                <BodyLong>
                    <Link href={t('forside:omYtelsene.lenkeGjenlevende.href')}>
                        {t('forside:omYtelsene.lenkeGjenlevende.tekst')}
                    </Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('forside:omYtelsene.lenkeOvergangsstoenad.href')}>
                        {t('forside:omYtelsene.lenkeOvergangsstoenad.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside:barnepensjon.tittel')}</Heading>

                <BodyLong spacing>{t('forside:barnepensjon.innhold')}</BodyLong>
                <BodyLong>
                    <Link href={t('forside:barnepensjon.href')}>{t('forside:barnepensjon.tekst')}</Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside:uthentingAvInfo.tittel')}</Heading>

                <BodyLong>{t('forside:uthentingAvInfo.innhold')}</BodyLong>

                <ul>
                    <li>
                        <BodyLong>
                            <span dangerouslySetInnerHTML={{ __html: t('forside:uthentingAvInfo.innholdListe.li1') }} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <span dangerouslySetInnerHTML={{ __html: t('forside:uthentingAvInfo.innholdListe.li2') }} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <span dangerouslySetInnerHTML={{ __html: t('forside:uthentingAvInfo.innholdListe.li3') }} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <span dangerouslySetInnerHTML={{ __html: t('forside:uthentingAvInfo.innholdListe.li4') }} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <span dangerouslySetInnerHTML={{ __html: t('forside:uthentingAvInfo.innholdListe.li5') }} />
                        </BodyLong>
                    </li>
                </ul>

                <BodyLong>
                    <Link href={t('forside:uthentingAvInfo.lenke1.href')}>
                        {t('forside:uthentingAvInfo.lenke1.tekst')}
                    </Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('forside:uthentingAvInfo.lenke2.href')}>
                        {t('forside:uthentingAvInfo.lenke2.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>
            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside:samtykke.tittel')}</Heading>

                <BodyLong>{t('forside:samtykke.innhold')}</BodyLong>

                <ConfirmationPanel
                    checked={false}
                    onChange={() => ''}
                    label={t('forside:samtykke.bekreftelse', { navn: innloggetBrukerNavn })}
                    size="small"
                >
                    Ipsum voluptate pariatur <Link href="#123">demolink</Link> anim officia minim ut mollit voluptate
                    exercitation nulla mollit.
                </ConfirmationPanel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Button
                    size={'small'}
                    variant={'primary'}
                    onClick={() => (window.location.href = 'skjema/steg/velg-scenarie')}
                >
                    Start søknad
                </Button>
            </SkjemaGruppe>
        </div>
    )
}

export default Forside
