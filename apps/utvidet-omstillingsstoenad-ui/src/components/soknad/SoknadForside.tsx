import { ArrowRightIcon } from '@navikt/aksel-icons'
import {
    Accordion,
    BodyLong,
    BodyShort,
    Box,
    Button,
    Checkbox,
    GuidePanel,
    Heading,
    HStack,
    InfoCard,
    Link,
    List,
    VStack,
} from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { hentHarOmsSak, lagreKladd } from '~api/api'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { useSoknadContext } from '~context/soknad/SoknadContext'
import { ActionTypes } from '~context/soknad/soknad'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { useLanguage } from '~hooks/useLanguage'
import { Spraakvalg } from '../felles/Spraakvalg'

const SoknadForside = () => {
    const navigate = useNavigate()
    const { logEvent } = useAnalytics()
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext()
    const [harOmsSak, setHarOmsSak] = useState<boolean>(true)
    const [henterOmsSakstatus, setHenterOmsSakstatus] = useState<boolean>(false)
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
            skjemanavn: 'Søknad om utvidet omstillingsstønad - Innlogget',
            skjemaId: 'NAV 17-01.06', // TODO: bytt skjemaId
        })

        navigate('/skjema/steg')
    }

    useEffect(() => {
        if (brukerState.foedselsnummer) {
            setHenterOmsSakstatus(true)
            hentHarOmsSak()
                .then((result: { harOMSSak: boolean }) => {
                    setHarOmsSak(result.harOMSSak)
                })
                .catch(() => navigate('/system-utilgjengelig'))
                .finally(() => setHenterOmsSakstatus(false))
        }
    }, [brukerState.foedselsnummer, navigate])

    if (henterOmsSakstatus) return null

    if (!harOmsSak) {
        return (
            <VStack align="center" gap="space-24">
                <Spraakvalg />
                <VStack gap="space-24" style={{ width: '100%', maxWidth: '36rem' }}>
                    <InfoCard data-color="warning" as="section" aria-labelledby="har-ikke-oms-title">
                        <InfoCard.Header>
                            <InfoCard.Title as="h2" id="har-ikke-oms-title">
                                {t('forside.harIkkeOms.tittel')}
                            </InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>
                            <BodyLong>{t('forside.harIkkeOms.beskrivelse')}</BodyLong>
                        </InfoCard.Content>
                    </InfoCard>
                    <VStack gap="space-16">
                        <Heading level="2" spacing size="medium">
                            {t('forside.harIkkeOms.omOmstillingsstoenad.tittel')}
                        </Heading>
                        <BodyLong spacing>{t('forside.harIkkeOms.omOmstillingsstoenad.beskrivelse')}</BodyLong>
                        <VStack gap="space-8">
                            <Box
                                as="a"
                                href={t('forside.harIkkeOms.omOmstillingsstoenad.lesMer.href')}
                                borderRadius="8"
                                borderWidth="1"
                                paddingBlock="space-16"
                                paddingInline="space-16"
                                style={{ color: 'var(--ax-text-neutral)', textDecoration: 'none' }}
                            >
                                <HStack justify="space-between" align="center">
                                    <BodyLong style={{ textDecoration: 'underline' }}>
                                        {t('forside.harIkkeOms.omOmstillingsstoenad.lesMer.tekst')}
                                    </BodyLong>
                                    <ArrowRightIcon aria-hidden />
                                </HStack>
                            </Box>
                            <Box
                                as="a"
                                href={t('forside.harIkkeOms.omOmstillingsstoenad.soek.href')}
                                borderRadius="8"
                                borderWidth="1"
                                paddingBlock="space-16"
                                paddingInline="space-16"
                                style={{ color: 'var(--ax-text-neutral)', textDecoration: 'none' }}
                            >
                                <HStack justify="space-between" align="center">
                                    <BodyLong style={{ textDecoration: 'underline' }}>
                                        {t('forside.harIkkeOms.omOmstillingsstoenad.soek.tekst')}
                                    </BodyLong>
                                    <ArrowRightIcon aria-hidden />
                                </HStack>
                            </Box>
                        </VStack>
                    </VStack>
                </VStack>
            </VStack>
        )
    }

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
                                    <List>
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
                                        <List>
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
                                    <List>
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
                    iconPosition="right"
                    icon={<ArrowRightIcon aria-hidden fontSize="1.5rem" />}
                >
                    {t('forside.startSoeknad')}
                </Button>
            )}
        </>
    )
}

export default SoknadForside
