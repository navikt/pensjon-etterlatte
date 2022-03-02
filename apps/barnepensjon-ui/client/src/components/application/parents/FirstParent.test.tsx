import { render } from '@testing-library/react'
import FirstParent from './FirstParent'
import { ApplicationContext } from '../../../context/application/ApplicationContext'
import { ApplicantRole, ApplicantSituation } from '../scenario/ScenarioSelection'
import { IApplication } from '../../../context/application/application'

const dispatch = () => {}
const getState = (situation: ApplicantSituation): IApplication => {
    return {
        applicant: {
            applicantSituation: situation,
            applicantRole: ApplicantRole.CHILD,
            consent: true,
        },
    }
}

describe('Should render the correct parent components based on input', () => {
    it('Should render the surviving parent component', () => {
        const state = getState(ApplicantSituation.ONE_PARENT_DECEASED)
        const { container } = render(
            <ApplicationContext.Provider value={{ state, dispatch }}>
                <FirstParent />
            </ApplicationContext.Provider>
        )
        expect(container.querySelector('h1')?.textContent).toBe('Om den gjenlevende')
    })

    it('Should render the deceased parent component', () => {
        const state = getState(ApplicantSituation.BOTH_PARENTS_DECEASED)
        const { container } = render(
            <ApplicationContext.Provider value={{ state, dispatch }}>
                <FirstParent />
            </ApplicationContext.Provider>
        )
        expect(container.querySelector('h1')?.textContent).toBe('Om den avdøde')
    })
})
