import { Alert, Button, Heading, HGrid, Panel } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../../context/application/application'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import FormGroup from '../common/FormGroup'
import { GridColumns, GridGap } from '../../utils/grid'

const Admin = () => {
    const navigate = useNavigate()

    const { dispatch } = useApplicationContext()

    const [state, setState] = useState<{
        mocked: boolean
        reset: boolean
    }>({
        mocked: false,
        reset: false,
    })

    const mockApplication = (application: { role: string; type: ActionTypes }) => {
        dispatch({ type: application.type })

        setState({ ...state, mocked: true })

        setTimeout(() => {
            navigate(`/skjema/${application.role}/steg/oppsummering`)
        }, 3500)
    }

    const resetApplication = () => {
        dispatch({ type: ActionTypes.RESET })

        setState({ ...state, reset: true })

        setTimeout(() => {
            setState({ ...state, reset: false })
        }, 3500)
    }

    const applicantRoles = [
        { title: 'Forelder', role: 'forelder', type: ActionTypes.MOCK_PARENT_APPLICATION },
        { title: 'Verge', role: 'verge', type: ActionTypes.MOCK_GUARDIAN_APPLICATION },
        { title: 'Barn - En forelder død', role: 'barn', type: ActionTypes.MOCK_CHILD_SINGLE_DEAD_APPLICATION },
        {
            title: 'Barn - Begge foreldre død',
            role: 'barn',
            type: ActionTypes.MOCK_CHILD_BOTH_DEAD_APPLICATION,
        },
    ]

    return (
        <Panel>
            {applicantRoles.map((application, index) => (
                <FormGroup key={index}>
                    <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
                        <Heading size="medium">{application.title.toLocaleUpperCase()}</Heading>
                        <Button variant={'primary'} onClick={() => mockApplication(application)}>
                            Mock Søknad
                        </Button>
                    </HGrid>
                </FormGroup>
            ))}
            <Button variant={'danger'} onClick={resetApplication}>
                Tilbakestill søknad
            </Button>

            {state.mocked && <Alert variant={'success'}>Søknad mocket! Tar deg til oppsummering ...</Alert>}

            {state.reset && <Alert variant={'warning'}>Søknad tilbakestilt!</Alert>}
        </Panel>
    )
}

export default Admin
