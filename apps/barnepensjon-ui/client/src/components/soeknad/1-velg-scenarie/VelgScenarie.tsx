import { Alert, BodyLong, Button, Link, Heading, Ingress } from '@navikt/ds-react'
import styled from 'styled-components'
import useTranslation from '../../../hooks/useTranslation'

const SchemaGroup = styled.div`
    margin: 0 0 1em;

    .navds-alert {
        margin-top: 3em;
    }
`
const ButtonGroup = styled.div`
    button {
        width: 100%;
        margin: 0 0 1em;
        text-align: center;
    }
`

const VelgScenarie = () => {
    const { t } = useTranslation()
    // todo: midleridig hack for å gå videre til neste side.
    const neste = () => (window.location.href = 'om-deg')

    return (
        <>
            <SchemaGroup>
                <Heading size={'medium'} className={'center'}>
                    {t('velgScenarie:tittel')}
                </Heading>
            </SchemaGroup>

            <SchemaGroup>
                <Ingress>{t('velgScenarie:ingress')}</Ingress>
            </SchemaGroup>

            <SchemaGroup>
                <ButtonGroup>
                    <Button variant={'secondary'} type={'button'} onClick={neste}>
                        {t('velgScenarie:knapp.mineBarn')}
                    </Button>
                    <Button variant={'secondary'} type={'button'} onClick={neste}>
                        {t('velgScenarie:knapp.verge')}
                    </Button>
                    <Button variant={'secondary'} type={'button'} onClick={neste}>
                        {t('velgScenarie:knapp.megSelv')}
                    </Button>
                </ButtonGroup>
            </SchemaGroup>

            <SchemaGroup>
                <Alert inline={true} variant={'info'}>
                    <Heading size={'small'} className={'center'}>
                        {t('velgScenarie:alert.tittel')}
                    </Heading>
                    <BodyLong className={'center'}>
                        {t('velgScenarie:alert.beskrivelse')}
                        <br />
                        <br />
                        {t('velgScenarie:alert.beskrivelse2')}&nbsp;
                        <Link href={t('velgScenarie:alert.lenke.href')}>{t('velgScenarie:alert.lenke.tekst')}</Link>
                    </BodyLong>
                </Alert>
            </SchemaGroup>
        </>
    )
}

export default VelgScenarie
