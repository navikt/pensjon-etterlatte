import { Alert, Button, Heading, Panel } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../../context/application/application'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { NavRow } from '../common/Navigation'

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
        { role: 'forelder', type: ActionTypes.MOCK_PARENT_APPLICATION },
        { role: 'verge', type: ActionTypes.MOCK_GUARDIAN_APPLICATION },
        { role: 'barn', type: ActionTypes.MOCK_CHILD_APPLICATION },
    ]

    return (
        <Panel>
            {applicantRoles.map((application, index) => (
                <div key={index}>
                    <Heading size="medium">{application.role.toLocaleUpperCase()}</Heading>

                    <NavRow>
                        <Button variant={'primary'} onClick={() => mockApplication(application)}>
                            Mock Søknad
                        </Button>

                        <Button variant={'danger'} onClick={resetApplication}>
                            Tilbakestill søknad
                        </Button>
                    </NavRow>
                </div>
            ))}

            {state.mocked && <Alert variant={'success'}>Søknad mocket! Tar deg til oppsummering ...</Alert>}

            {state.reset && <Alert variant={'warning'}>Søknad tilbakestilt!</Alert>}
        </Panel>
    )
}

export default Admin
