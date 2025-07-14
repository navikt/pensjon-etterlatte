import { BugIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Heading, Link } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Panel } from './felles/Panel'
import { SkjemaGruppe } from './felles/SkjemaGruppe'

const SideIkkeFunnet = () => {
    const { t } = useTranslation()
    return (
        <Panel>
            <SkjemaGruppe>
                <Box marginBlock="4">
                    <Heading size={'medium'}>{t('sideIkkeFunnet.tittel')}</Heading>
                </Box>
                <Box marginBlock="4">
                    <BodyShort>{t('sideIkkeFunnet.beskrivelse')}</BodyShort>
                </Box>
                <SkjemaGruppe>
                    <Button as={'a'} href={t('sideIkkeFunnet.gaaTilForsiden.href')}>
                        {t('sideIkkeFunnet.gaaTilForsiden')}
                    </Button>
                </SkjemaGruppe>
                <Link href={t('sideIkkeFunnet.feilILenke.href')}>
                    <BugIcon fontSize={20} aria-hidden={true} />
                    {t('sideIkkeFunnet.feilILenke')}
                </Link>
            </SkjemaGruppe>
            <Box marginBlock="4">
                <Heading size={'medium'}>{t('sideIkkeFunnet.tittel.engelsk')}</Heading>
            </Box>
            <Box marginBlock="4">
                <BodyShort>
                    {t('sideIkkeFunnet.beskrivelse.engelsk.del1')}
                    <Link href={t('sideIkkeFunnet.gaaTilForsiden.href')} inlineText>
                        {t('sideIkkeFunnet.gaaTilForsiden.engelsk')}
                    </Link>
                    {t('sideIkkeFunnet.beskrivelse.engelsk.del2')}
                </BodyShort>
            </Box>
        </Panel>
    )
}

export default SideIkkeFunnet
