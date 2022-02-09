import { Alert, BodyLong, Button, Link, Heading, Ingress } from '@navikt/ds-react'
import styled from 'styled-components'
import useTranslation from '../../../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'

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
    const navigate = useNavigate()
    const { t } = useTranslation('velgScenarie')
    // todo: midleridig hack for å gå videre til neste side.

    const neste = () => navigate('/skjema/steg/om-deg')

    return (
        <>
            <SchemaGroup>
                <Heading size={'medium'} className={'center'}>
                    {t('tittel')}
                </Heading>
            </SchemaGroup>

            <SchemaGroup>
                <Ingress>{t('ingress')}</Ingress>
            </SchemaGroup>

            <SchemaGroup>
                <ButtonGroup>
                    <Button variant={'secondary'} type={'button'} onClick={neste}>
                        {t('knapp.mineBarn')}
                    </Button>
                    <Button variant={'secondary'} type={'button'} onClick={neste}>
                        {t('knapp.verge')}
                    </Button>
                    <Button variant={'secondary'} type={'button'} onClick={neste}>
                        {t('knapp.megSelv')}
                    </Button>
                </ButtonGroup>
            </SchemaGroup>

            <SchemaGroup>
                <Alert inline={true} variant={'info'}>
                    <Heading size={'small'} className={'center'}>
                        {t('alert.tittel')}
                    </Heading>
                    <BodyLong className={'center'}>
                        {t('alert.beskrivelse')}
                        <br />
                        <br />
                        {t('alert.beskrivelse2')}&nbsp;
                        <Link href={t('alert.lenke.href')}>{t('alert.lenke.tekst')}</Link>
                    </BodyLong>
                </Alert>
            </SchemaGroup>
        </>
    )
}

export default VelgScenarie
