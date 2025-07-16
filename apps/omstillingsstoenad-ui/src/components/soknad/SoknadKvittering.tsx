import { Alert, BodyLong, BodyShort, Box, Button, Heading, HStack, Link } from '@navikt/ds-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'

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

            <Box marginBlock="0 12">
                <Alert variant={'success'}>{t('soeknadKvittering.mottatt')}</Alert>
            </Box>

            <Box marginBlock="0 12">
                <Heading size={'small'}>{t('soeknadKvittering.seSaken.tittel')}</Heading>

                <BodyLong>
                    {t('soeknadKvittering.seSaken.informasjon.innhold1')}{' '}
                    <Link href={t('soeknadKvittering.seSaken.informasjon.lenkeMittNAV.href')}>
                        {t('soeknadKvittering.seSaken.informasjon.lenkeMittNAV.tekst')}
                    </Link>{' '}
                    {t('soeknadKvittering.seSaken.informasjon.innhold2')}{' '}
                    <Link href={t('soeknadKvittering.seSaken.informasjon.lenkeSaksbehandlingstid.href')}>
                        {t('soeknadKvittering.seSaken.informasjon.lenkeSaksbehandlingstid.tekst')}
                    </Link>
                </BodyLong>
            </Box>

            <Box marginBlock="0 12">
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
            </Box>

            <Box marginBlock="0 12">
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
            </Box>

            <HStack marginBlock="0 18" justify="center">
                <Button
                    variant={'secondary'}
                    type={'button'}
                    onClick={() => (window.location.href = 'https://www.nav.no/omstillingsstonad')}
                >
                    {t('soeknadKvittering.spoersmaal.knapp')}
                </Button>
            </HStack>
        </>
    )
}

export default SoknadKvittering
