import { BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Panel } from './felles/Panel'
import { SkjemaElement } from './felles/SkjemaElement'
import { SkjemaGruppe } from './felles/SkjemaGruppe'
import { BugIcon } from '@navikt/aksel-icons'

const SideIkkeFunnet = () => {
    const { t } = useTranslation()
    return (
        <Panel>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'medium'}>{t('sideIkkeFunnet.tittel')}</Heading>
                </SkjemaElement>
                <SkjemaElement>
                    <BodyShort>{t('sideIkkeFunnet.beskrivelse')}</BodyShort>
                </SkjemaElement>
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
            <SkjemaElement>
                <Heading size={'medium'}>{t('sideIkkeFunnet.tittel.engelsk')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <BodyShort>
                    {t('sideIkkeFunnet.beskrivelse.engelsk.del1')}
                    <Link href={t('sideIkkeFunnet.gaaTilForsiden.href')} inlineText>
                        {t('sideIkkeFunnet.gaaTilForsiden.engelsk')}
                    </Link>
                    {t('sideIkkeFunnet.beskrivelse.engelsk.del2')}
                </BodyShort>
            </SkjemaElement>
        </Panel>
    )
}

export default SideIkkeFunnet
