import { Alert, BodyLong, Button, Heading, Ingress, Link } from '@navikt/ds-react'
import styled from 'styled-components'
import useTranslation from '../../../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import FormGroup from '../../common/FormGroup'

const ButtonGroup = styled.div`
    button {
        width: 100%;
        margin: 0 0 1em;
        text-align: center;
    }
`

export default function ScenarioSelection() {
    const navigate = useNavigate()
    const { t } = useTranslation('velgScenarie')
    // todo: midleridig hack for å gå videre til neste side.

    return (
        <>
            <FormGroup>
                <Heading size={'medium'} className={'center'}>
                    {t('tittel')}
                </Heading>
            </FormGroup>

            <FormGroup>
                <Ingress>{t('ingress')}</Ingress>
            </FormGroup>

            <FormGroup>
                <ButtonGroup>
                    <Button
                        variant={'secondary'}
                        type={'button'}
                        onClick={() => navigate('/skjema/forelder/steg/om-deg')}
                    >
                        {t('knapp.mineBarn')}
                    </Button>
                    <Button variant={'secondary'} type={'button'} onClick={() => navigate('/skjema/verge/steg/om-deg')}>
                        {t('knapp.verge')}
                    </Button>
                    <Button variant={'secondary'} type={'button'} onClick={() => navigate('/skjema/barn/steg/om-deg')}>
                        {t('knapp.megSelv')}
                    </Button>
                </ButtonGroup>
            </FormGroup>

            <FormGroup>
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
            </FormGroup>
        </>
    )
}
