import React, { useEffect } from 'react'
import { SkjemaGruppe } from '../felles/SkjemaGruppe'
import { Alert, BodyLong, BodyShort, Button, Link, Heading } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { NavigasjonsRadSection } from '../felles/StyledComponents'

const SoknadKvittering = () => {
    const { t } = useTranslation()
    useLanguage()

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener('popstate', () => {
            window.history.pushState(null, document.title, window.location.href)
        })
    }, [])

    return (
        <>
            <Heading className={'center'} size={'medium'} spacing={true}>
                {t('soeknadKvittering.tittel')}
            </Heading>

            <SkjemaGruppe>
                <Alert variant={'success'}>{t('soeknadKvittering.mottatt')}</Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('soeknadKvittering.seSaken.tittel')}</Heading>

                <BodyLong>
                    {t('soeknadKvittering.seSaken.informasjon.innhold1')}&nbsp;
                    <Link href={t('soeknadKvittering.seSaken.informasjon.lenkeMittNAV.href')}>
                        {t('soeknadKvittering.seSaken.informasjon.lenkeMittNAV.tekst')}
                    </Link>
                    &nbsp;
                    {t('soeknadKvittering.seSaken.informasjon.innhold2')}&nbsp;
                    <Link href={t('soeknadKvittering.seSaken.informasjon.lenkeSaksbehandlingstid.href')}>
                        {t('soeknadKvittering.seSaken.informasjon.lenkeSaksbehandlingstid.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Alert variant={'info'}>
                    <Heading size={'small'}>{t('soeknadKvittering.endring.tittel')}</Heading>

                    <BodyLong>{t('soeknadKvittering.endring.informasjon')}</BodyLong>

                    <ul>
                        <li>
                            <BodyShort>{t('soeknadKvittering.endring.endringsListe.sivilstatus')}</BodyShort>
                        </li>
                        <li>
                            <BodyShort>{t('soeknadKvittering.endring.endringsListe.inntekt')}</BodyShort>
                        </li>
                        <li>
                            <BodyShort>{t('soeknadKvittering.endring.endringsListe.bosted')}</BodyShort>
                        </li>
                    </ul>
                    <BodyLong>
                        {t('soeknadKvittering.endring.rettigheter.informasjon')}&nbsp;
                        <Link href={t('soeknadKvittering.endring.rettigheter.lenke.href')}>
                            {t('soeknadKvittering.endring.rettigheter.lenke.tekst')}
                        </Link>
                    </BodyLong>
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('soeknadKvittering.andreStoenader.tittel')}</Heading>

                <BodyLong>{t('soeknadKvittering.andreStoenader.informasjon')}</BodyLong>

                <ul>
                    <li>
                        <BodyShort>{t('soeknadKvittering.andreStoenader.stoenadListe.skolepenger.tekst')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('soeknadKvittering.andreStoenader.stoenadListe.barnetilsyn.tekst')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('soeknadKvittering.andreStoenader.stoenadListe.barnetrygd.tekst')}</BodyShort>
                    </li>
                </ul>

                <BodyShort spacing={true}>
                    {t('soeknadKvittering.andreStoenader.andreInformasjon')}
                    <Link href={t('soeknadKvittering.andreStoenader.stoenadListe.tillegg.href')}>
                        {t('soeknadKvittering.andreStoenader.stoenadListe.tillegg.tekst')}
                    </Link>
                </BodyShort>

                <br />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <NavigasjonsRadSection>
                    <Button
                        variant={'secondary'}
                        type={'button'}
                        onClick={() => (window.location.href = 'https://www.nav.no/omstillingsstonad')}
                    >
                        {t('soeknadKvittering.spoersmaal.knapp')}
                    </Button>
                </NavigasjonsRadSection>
            </SkjemaGruppe>
        </>
    )
}

export default SoknadKvittering
