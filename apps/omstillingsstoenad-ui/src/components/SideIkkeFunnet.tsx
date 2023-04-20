import { Alert, Panel, Heading } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'

const SideIkkeFunnet = () => {
    const { t } = useTranslation()
    return (
        <Panel>
            <Heading size={'medium'}>{t('sideIkkeFunnet.tittel')}</Heading>

            <br />
            <Alert variant={'warning'}>{t('sideIkkeFunnet.alert')}</Alert>
        </Panel>
    )
}

export default SideIkkeFunnet
