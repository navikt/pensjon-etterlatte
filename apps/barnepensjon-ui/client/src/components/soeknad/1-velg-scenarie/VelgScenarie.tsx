import { Alert, BodyLong, Button, Heading, Ingress } from '@navikt/ds-react'
import styled from 'styled-components'

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
    return (
        <>
            <SchemaGroup>
                <Heading size={'medium'} className={'center'}>
                    Søk barnepensjon
                </Heading>
            </SchemaGroup>

            <SchemaGroup>
                <Ingress>Velg din situasjon for å gå videre med søknaden</Ingress>
            </SchemaGroup>

            <SchemaGroup>
                <ButtonGroup>
                    <Button variant={'secondary'} type={'button'}>
                        Jeg skal søke om barnepensjon for mitt/mine barn
                    </Button>
                    <Button variant={'secondary'} type={'button'}>
                        Jeg skal søke om barnepensjon for ett eller flere barn jeg er verge til
                    </Button>
                    <Button variant={'secondary'} type={'button'}>
                        Jeg er over 18 år og søker på vegne av meg selv
                    </Button>
                </ButtonGroup>
            </SchemaGroup>

            <SchemaGroup>
                <Alert inline={true} variant={'info'}>
                    <Heading size={'small'} className={'center'}>
                        Søke gjenlevendepensjon og barnepensjon?
                    </Heading>
                    <BodyLong className={'center'}>
                        Du kan ha rettigheter som gjenlevende hvis den andre forelderen til barnet ditt dør. Da kan du
                        søke om gjenlevendepensjon og barnepensjon i en og samme søknad.
                        <br />
                        <br />
                        Gå til{' '}
                        <a href={'https://www.nav.no/gjenlevendepensjon/soknad/'}>
                            søknad om gjenlevendepensjon og barnepensjon
                        </a>
                    </BodyLong>
                </Alert>
            </SchemaGroup>
        </>
    )
}

export default VelgScenarie
