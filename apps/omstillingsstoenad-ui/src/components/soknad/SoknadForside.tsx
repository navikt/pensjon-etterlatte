import {
    Alert,
    BodyLong,
    BodyShort,
    Box,
    Button,
    ConfirmationPanel,
    ExpansionCard,
    GuidePanel,
    Heading,
    Link,
    List,
} from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { hentHarSoektOms } from '~api/api'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import { useLanguage } from '../../hooks/useLanguage'
import { MuligeSteg } from '../../typer/steg'
import { erForGammel } from '../../utils/alder'
import { Spraakvalg } from '../felles/Spraakvalg'

const SoknadForside = () => {
    const navigate = useNavigate()
    const { logEvent } = useAnalytics()
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext()
    const [harSoektOms, setHarSoektOms] = useState<boolean>(false)
    useLanguage()

    const startSoeknad = () => {
        const foersteSteg = MuligeSteg[0]

        // Legger til - Innlogget for å skille fra fyll ut
        logEvent(LogEvents.AAPNE_SOKNAD, {
            skjemanavn: 'Søknad om omstillingsstønad - Innlogget',
            skjemaId: 'NAV 17-01.06',
        })

        navigate(`/skjema/steg/${foersteSteg.path}`)
    }

    useEffect(() => {
        if (brukerState.foedselsnummer) {
            hentHarSoektOms().then((result: { harOMSSak: boolean }) => {
                setHarSoektOms(result.harOMSSak)
                if (result.harOMSSak) {
                    logEvent(LogEvents.ALERT_VIST, {
                        variant: 'info',
                        tekst: 'Bruker har allerede søkt om omstillingsstønad',
                    })
                }
            })
        }
    }, [brukerState])

    return (
        <>
            {erForGammel(brukerState.alder!) && (
                <Box marginBlock="4">
                    <Alert variant={'info'}>
                        <Heading size={'small'} spacing>
                            {t('forside.over67.tittel')}
                        </Heading>
                        <BodyShort spacing>{t('forside.over67.avsnitt1')}</BodyShort>
                        <BodyShort spacing>
                            {t('forside.over67.avsnitt2')}
                            <Link href={t('forside.over67.avsnitt2.lenke.href')} inlineText>
                                {t('forside.over67.avsnitt2.lenke.tekst')}
                            </Link>
                        </BodyShort>
                        <BodyShort>
                            {t('forside.over67.avsnitt3.del1')}
                            <Link href={t('forside.over67.avsnitt3.lenke.href')} inlineText>
                                {t('forside.over67.avsnitt3.lenke.tekst')}
                            </Link>
                            {t('forside.over67.avsnitt3.del2')}
                        </BodyShort>
                    </Alert>
                </Box>
            )}

            <Box marginBlock="0 12">
                <GuidePanel poster>{t('forside.ingress')}</GuidePanel>
            </Box>

            <Spraakvalg />

            {harSoektOms && (
                <Box marginBlock="4">
                    <Alert variant={'info'}>
                        <Heading size={'small'} spacing>
                            {t('forside.harSoektOms.tittel')}
                        </Heading>
                        <BodyLong spacing>{t('forside.harSoektOms.avsnitt')}</BodyLong>
                        <Box marginInline="4 0">
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

            <Box marginBlock="0 12">
                <Heading spacing size={'large'}>
                    {t('forside.tittel')}
                </Heading>

                <BodyLong>{t('forside.omYtelsene.innhold')}</BodyLong>
                <Box marginInline="4 0">
                    <List>
                        <List.Item>{t('forside.omYtelsene.innhold.li1')}</List.Item>
                        <List.Item>{t('forside.omYtelsene.innhold.li2')}</List.Item>
                        <List.Item>{t('forside.omYtelsene.innhold.li3')}</List.Item>
                    </List>
                </Box>

                <BodyLong>
                    {t('forside.omYtelsene.innhold.merOmOmstillingsstoenad')}
                    <Link href={t('forside.omYtelsene.lenkeGjenlevende.href')}>
                        {t('forside.omYtelsene.lenkeGjenlevende.tekst')}
                    </Link>
                </BodyLong>
            </Box>

            <Box marginBlock="0 12">
                <Heading size={'small'}>{t('forside.barnepensjon.tittel')}</Heading>
                <BodyLong spacing>{t('forside.barnepensjon.innhold')}</BodyLong>
                <Heading size={'small'}>{t('forside.utfyllingAvSoeknad.tittel')}</Heading>
                <BodyLong spacing>{t('forside.utfyllingAvSoeknad.innhold')}</BodyLong>

                <Box marginBlock="4">
                    <ExpansionCard aria-label={t('forside.klartFoerSoeknad.tittel')} size="small">
                        <ExpansionCard.Header>
                            <ExpansionCard.Title as={'h2'} size={'small'}>
                                {t('forside.klartFoerSoeknad.tittel')}
                            </ExpansionCard.Title>
                        </ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <Heading size={'xsmall'}>{t('forside.klartFoerSoeknad.fnr.tittel')}</Heading>
                            <BodyLong spacing>{t('forside.klartFoerSoeknad.fnr.innhold')}</BodyLong>

                            <Heading size={'xsmall'}>{t('forside.klartFoerSoeknad.oppholdUtland.tittel')}</Heading>
                            <BodyLong spacing>{t('forside.klartFoerSoeknad.oppholdUtland.innhold.del1')}</BodyLong>
                            <BodyLong spacing>{t('forside.klartFoerSoeknad.oppholdUtland.innhold.del2')}</BodyLong>

                            <Heading size={'xsmall'}>{t('forside.klartFoerSoeknad.arbeidsinntekt.tittel')}</Heading>
                            <BodyLong>{t('forside.klartFoerSoeknad.arbeidsinntekt.innhold')}</BodyLong>
                        </ExpansionCard.Content>
                    </ExpansionCard>
                </Box>

                <Box marginBlock="4">
                    <ExpansionCard aria-label={t('forside.omSoeknaden.personvern')} size="small">
                        <ExpansionCard.Header>
                            <ExpansionCard.Title as={'h2'} size={'small'}>
                                {t('forside.omSoeknaden.personvern')}
                            </ExpansionCard.Title>
                        </ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <Heading size={'small'}>{t('forside.slikBehandlerVi.tittel')}</Heading>
                            <BodyLong>{t('forside.slikBehandlerVi.innhold')}</BodyLong>

                            <Box marginBlock="4">
                                <Heading size={'small'}>{t('forside.innsamlingAvInfo.tittel')}</Heading>
                                <Box marginInline="4 0">
                                    <List as={'ul'}>
                                        <List.Item>{t('forside.innsamlingAvInfo.innholdListe.li1')}</List.Item>
                                        <List.Item>{t('forside.innsamlingAvInfo.innholdListe.li2')}</List.Item>
                                        <List.Item>{t('forside.innsamlingAvInfo.innholdListe.li3')}</List.Item>
                                    </List>
                                </Box>
                            </Box>

                            <Heading size={'small'}>{t('forside.uthentingAvInfo.tittel')}</Heading>
                            <BodyLong>{t('forside.uthentingAvInfo.innhold')}</BodyLong>

                            <Box marginInline="4 0">
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

                            <Box marginBlock="4">
                                <BodyLong>{t('forside.personvern.aktivitetsplikt')}</BodyLong>
                            </Box>

                            <Box marginBlock="4">
                                <BodyShort>{t('forside.personvern.tredjeperson')}</BodyShort>

                                <Box marginInline="4 0">
                                    <List as={'ul'}>
                                        <List.Item>{t('forside.personvern.tredjeperson.li1')}</List.Item>
                                        <List.Item>{t('forside.personvern.tredjeperson.li2')}</List.Item>
                                        <List.Item>{t('forside.personvern.tredjeperson.li3')}</List.Item>
                                        <List.Item>{t('forside.personvern.tredjeperson.li4')}</List.Item>
                                    </List>
                                </Box>
                            </Box>

                            <Box marginBlock="4">
                                <Heading size={'small'}>{t('forside.utleveringAvOpplysninger.tittel')}</Heading>
                                <BodyLong>{t('forside.utleveringAvOpplysninger.innhold')}</BodyLong>
                            </Box>

                            <Box marginBlock="4">
                                <Heading size={'small'}>{t('forside.lagringstid.tittel')}</Heading>
                                <BodyLong>{t('forside.lagringstid.innhold')}</BodyLong>
                            </Box>

                            <Box marginBlock="4">
                                <Heading size={'small'}>{t('forside.automatiskbehandling.tittel')}</Heading>
                                <BodyLong>{t('forside.automatiskbehandling.innhold1')}</BodyLong>
                                <Box marginBlock="4">
                                    <BodyLong>
                                        {t('forside.automatiskbehandling.innhold2.del1')}
                                        <Link href={t('forside.automatiskbehandling.innhold2.lenke.href')} inlineText>
                                            {t('forside.automatiskbehandling.innhold2.lenke.tekst')}
                                        </Link>
                                        {t('forside.automatiskbehandling.innhold2.del2')}
                                    </BodyLong>
                                </Box>
                                <Box marginBlock="4">
                                    <BodyLong>{t('forside.automatiskbehandling.innhold3')}</BodyLong>
                                </Box>
                                <Box marginBlock="4">
                                    <BodyLong>{t('forside.automatiskbehandling.innhold4')}</BodyLong>
                                </Box>

                                <Box marginInline="4 0">
                                    <List as={'ul'}>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li1')}</List.Item>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li2')}</List.Item>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li3')}</List.Item>
                                        <List.Item>{t('forside.automatiskbehandling.innholdListe.li4')}</List.Item>
                                    </List>
                                </Box>

                                <BodyLong spacing>{t('forside.automatiskbehandling.innhold5')}</BodyLong>
                            </Box>

                            <Box marginBlock="4">
                                <Heading size={'small'}>{t('forside.personvern.tittel')}</Heading>

                                <BodyLong>
                                    {`${t('forside.personvern.innhold1')} `}
                                    <Link href={t('forside.personvern.lenke.href')} target="_blank">
                                        {t('forside.personvern.lenke.tekst')}
                                    </Link>
                                    {` ${t('forside.personvern.innhold2')}`}
                                </BodyLong>
                            </Box>
                        </ExpansionCard.Content>
                    </ExpansionCard>
                </Box>
            </Box>

            <Box marginBlock="0 12">
                <Heading size={'small'} spacing>
                    {t('forside.samtykke.tittel')}
                </Heading>

                <BodyShort spacing>{t('forside.samtykke.innhold')}</BodyShort>

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
            </Box>
            {soknadState.harSamtykket && !soknadState?.error && (
                <Button variant={'primary'} type={'button'} id={'start-soeknad'} onClick={startSoeknad}>
                    {t('forside.startSoeknad')}
                </Button>
            )}
        </>
    )
}

export default SoknadForside
