import {
    Accordion,
    Alert,
    BodyLong,
    BodyShort,
    Box,
    Button,
    Checkbox,
    GuidePanel,
    Heading,
    Link,
    List,
} from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { hentHarSoektOms, lagreKladd } from '~api/api'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import { useLanguage } from '../../hooks/useLanguage'
import { Spraakvalg } from '../felles/Spraakvalg'

const SoknadForside = () => {
    const navigate = useNavigate()
    const { logEvent } = useAnalytics()
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext()
    const [harSoektOms, setHarSoektOms] = useState<boolean>(false)
    const [lagrer, settLagrer] = useState(false)
    useLanguage()

    const startSoeknad = async () => {
        if (lagrer) return
        settLagrer(true)
        try {
            const kladd = await lagreKladd(soknadState)
            soknadDispatch({ type: ActionTypes.OPPDATER_KLADD, payload: kladd })
        } catch {
            soknadDispatch({ type: ActionTypes.SET_ERROR, payload: t('skjema.lagringFeilet') })
            settLagrer(false)
            return
        }
        // Legger til - Innlogget for å skille fra fyll ut
        logEvent(LogEvents.AAPNE_SOKNAD, {
            skjemanavn: 'Søknad om omstillingsstønad - Innlogget',
            skjemaId: 'NAV 17-01.06',
        })

        navigate('/skjema/steg')
    }

    useEffect(() => {
        if (brukerState.foedselsnummer) {
            hentHarSoektOms()
                .then((result: { harOMSSak: boolean }) => {
                    // TODO: denne skal ikke sjekke om man har søkt oms, men om man alt har søkt utvidet-oms
                    setHarSoektOms(result.harOMSSak)
                    if (result.harOMSSak) {
                        logEvent(LogEvents.ALERT_VIST, {
                            variant: 'info',
                            tekst: 'Bruker har allerede søkt om omstillingsstønad',
                        })
                    }
                })
                // Infoboksen er ikke kritisk, så vi lar bare være å vise den hvis kallet feiler
                .catch(() => setHarSoektOms(false))
        }
    }, [brukerState])

    return (
        <>
            <Box marginBlock="space-0 space-48">
                <GuidePanel poster>
                    <Heading level="2" size={'small'} spacing>
                        {t('forside.ingress.tittel', { navn: brukerState.fornavn })}
                    </Heading>
                    <BodyShort spacing>{t('forside.ingress.del1')}</BodyShort>
                    <BodyShort>
                        {t('forside.ingress.del2.del1')}
                        <Link
                            href={t('forside.ingress.del2.lenke.href')}
                            target="_blank"
                            rel="noopener noreferrer"
                            inlineText
                        >
                            {t('forside.ingress.del2.lenke.tekst')}
                        </Link>
                        {t('forside.ingress.del2.del2')}
                    </BodyShort>
                </GuidePanel>
            </Box>
            <Spraakvalg />
            {harSoektOms && (
                <Box marginBlock="space-16">
                    <Alert variant={'info'}>
                        <Heading size={'small'} spacing>
                            {t('forside.harSoektOms.tittel')}
                        </Heading>
                        <BodyLong spacing>{t('forside.harSoektOms.avsnitt')}</BodyLong>
                        <Box marginInline="space-16 space-0">
                            <List>
                                <List.Item>
                                    <Link href={t('forside.harSoektOms.innhold.li1.lenke.href')} inlineText>
                                        {t('forside.harSoektOms.innhold.li1.lenke.tekst')}
                                    </Link>{' '}
                                </List.Item>
                                <List.Item>
                                    <Link href={t('forside.harSoektOms.innhold.li2.lenke.href')} inlineText>
                                        {t('forside.harSoektOms.innhold.li2.lenke.tekst')}
                                    </Link>
                                </List.Item>
                                <List.Item>
                                    <Link href={t('forside.harSoektOms.innhold.li3.lenke.href')} inlineText>
                                        {t('forside.harSoektOms.innhold.li3.lenke.tekst')}
                                    </Link>
                                </List.Item>
                            </List>
                        </Box>
                    </Alert>
                </Box>
            )}
            <Box marginBlock="space-0 space-48">
                <Heading level="2" spacing size={'medium'}>
                    {t('forside.tittel')}
                </Heading>

                <BodyLong spacing>{t('forside.omYtelsene.innhold.del1')}</BodyLong>
                <BodyLong>
                    {t('forside.omYtelsene.innhold.del2.del1')}
                    <Link href={t('forside.omYtelsene.innhold.del2.lenke.href')}>
                        {t('forside.omYtelsene.innhold.del2.lenke.tekst')}
                    </Link>
                    {t('forside.omYtelsene.innhold.del2.del2')}
                </BodyLong>
            </Box>
            <Box marginBlock="space-0 space-48">
                <Heading level="2" size={'medium'} spacing>
                    {t('forside.foerDuSoeker.tittel')}
                </Heading>
                <BodyLong spacing>{t('forside.foerDuSoeker.innhold.del1')}</BodyLong>
                <Box marginInline="space-16 space-0">
                    <List>
                        <List.Item>{t('forside.foerDuSoeker.innhold.li1')}</List.Item>
                        <List.Item>{t('forside.foerDuSoeker.innhold.li2')}</List.Item>
                        <List.Item>{t('forside.foerDuSoeker.innhold.li3')}</List.Item>
                        <List.Item>{t('forside.foerDuSoeker.innhold.li4')}</List.Item>
                    </List>
                </Box>
                <BodyLong spacing>{t('forside.foerDuSoeker.innhold.del2')}</BodyLong>
            </Box>
            <Box marginBlock="space-0 space-48">
                <Box marginBlock="space-16">
                    <Accordion size="small">
                        <Accordion.Item>
                            <Accordion.Header>{t('forside.informasjonViHenterOmDeg.tittel')}</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong>{t('forside.uthentingAvInfo.innhold')}</BodyLong>

                                <Box marginInline="space-16 space-0">
                                    <List as={'ul'}>
                                        <List.Item>{t('forside.uthentingAvInfo.innholdListe.li1')}</List.Item>
                                        <List.Item>{t('forside.uthentingAvInfo.innholdListe.li2')}</List.Item>
                                        <List.Item>{t('forside.uthentingAvInfo.innholdListe.li3')}</List.Item>
                                        <List.Item>{t('forside.uthentingAvInfo.innholdListe.li4')}</List.Item>
                                        <List.Item>{t('forside.uthentingAvInfo.innholdListe.li5')}</List.Item>
                                        <List.Item>{t('forside.uthentingAvInfo.innholdListe.li6')}</List.Item>
                                        <List.Item>
                                            <BodyLong>{t('forside.uthentingAvInfo.innholdListe.li7')}</BodyLong>
                                        </List.Item>
                                    </List>
                                </Box>

                                <Box marginBlock="space-16">
                                    <BodyLong>{t('forside.personvern.aktivitetsplikt')}</BodyLong>
                                </Box>

                                <Box marginBlock="space-16">
                                    <BodyShort>{t('forside.personvern.tredjeperson')}</BodyShort>
                                    <Box marginInline="space-16 space-0">
                                        <List as={'ul'}>
                                            <List.Item>{t('forside.personvern.tredjeperson.li1')}</List.Item>
                                            <List.Item>{t('forside.personvern.tredjeperson.li2')}</List.Item>
                                            <List.Item>{t('forside.personvern.tredjeperson.li3')}</List.Item>
                                            <List.Item>{t('forside.personvern.tredjeperson.li4')}</List.Item>
                                        </List>
                                    </Box>
                                </Box>
                            </Accordion.Content>
                        </Accordion.Item>

                        <Accordion.Item>
                            <Accordion.Header>{t('forside.slikBehandlerVi.tittel')}</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong>{t('forside.slikBehandlerVi.innhold')}</BodyLong>

                                <Box marginBlock="space-16">
                                    <BodyLong>
                                        {`${t('forside.personvern.innhold1')} `}
                                        <Link href={t('forside.personvern.lenke.href')} target="_blank">
                                            {t('forside.personvern.lenke.tekst')}
                                        </Link>
                                        {` ${t('forside.personvern.innhold2')}`}
                                    </BodyLong>
                                </Box>
                            </Accordion.Content>
                        </Accordion.Item>

                        <Accordion.Item>
                            <Accordion.Header>{t('forside.automatiskbehandling.tittel')}</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong>{t('forside.automatiskbehandling.innhold1')}</BodyLong>
                                <Box marginBlock="space-16">
                                    <BodyLong>
                                        {t('forside.automatiskbehandling.innhold2.del1')}
                                        <Link href={t('forside.automatiskbehandling.innhold2.lenke.href')} inlineText>
                                            {t('forside.automatiskbehandling.innhold2.lenke.tekst')}
                                        </Link>
                                        {t('forside.automatiskbehandling.innhold2.del2')}
                                    </BodyLong>
                                </Box>
                                <Box marginBlock="space-16">
                                    <BodyLong>{t('forside.automatiskbehandling.innhold3')}</BodyLong>
                                </Box>
                                <Box marginBlock="space-16">
                                    <BodyLong>{t('forside.automatiskbehandling.innhold4')}</BodyLong>
                                </Box>

                                <Box marginInline="space-16 space-0">
                                    <List as={'ul'}>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li1')}</List.Item>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li2')}</List.Item>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li3')}</List.Item>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li4')}</List.Item>
                                    </List>
                                </Box>

                                <BodyLong spacing>{t('forside.automatiskbehandling.innhold5')}</BodyLong>
                            </Accordion.Content>
                        </Accordion.Item>

                        <Accordion.Item>
                            <Accordion.Header>{t('forside.utfyllingAvSoeknad.tittel')}</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong>{t('forside.utfyllingAvSoeknad.innhold')}</BodyLong>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </Box>
            </Box>
            <Box marginBlock="space-0 space-48">
                <BodyShort spacing>
                    {t('forside.samtykke.innhold.del1')}
                    <Link href={t('forside.samtykke.lenke.href')} inlineText>
                        {t('forside.samtykke.lenke.tekst')}
                    </Link>
                    {t('forside.samtykke.innhold.del2')}
                </BodyShort>

                <Checkbox
                    checked={soknadState.harSamtykket}
                    onChange={(e) =>
                        soknadDispatch({
                            type: ActionTypes.OPPDATER_SAMTYKKE,
                            payload: (e.target as HTMLInputElement).checked,
                        })
                    }
                >
                    {t('forside.samtykke.bekreftelse')}
                </Checkbox>
            </Box>
            {soknadState.harSamtykket && (
                <Button
                    variant={'primary'}
                    type={'button'}
                    id={'start-soeknad'}
                    onClick={startSoeknad}
                    loading={lagrer}
                >
                    {t('forside.startSoeknad')}
                </Button>
            )}
        </>
    )
}

export default SoknadForside
