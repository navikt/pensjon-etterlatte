import { StepIndicator } from '@navikt/ds-react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import { GuardianApplicantSteps, ParentApplicantSteps } from '../../utils/steps'
import { v4 as uuid } from 'uuid'
import Navigation from '../common/Navigation'

export default function GuardianDialogue() {
    const navigate = useNavigate()

    const { pathname } = useLocation()

    const currentIndex = GuardianApplicantSteps.findIndex((step) => pathname.includes(step.path))

    const next =
        currentIndex < ParentApplicantSteps.length - 1
            ? () => navigate(`/skjema/verge/${GuardianApplicantSteps[currentIndex + 1].path}`)
            : undefined

    const prev =
        currentIndex > 0 ? () => navigate(`/skjema/verge/${GuardianApplicantSteps[currentIndex - 1].path}`) : undefined

    return (
        <>
            <StepIndicator activeStep={currentIndex}>
                {GuardianApplicantSteps.map((step) => (
                    <StepIndicator.Step key={uuid()}>{step.label}</StepIndicator.Step>
                ))}
            </StepIndicator>

            <Routes>
                {GuardianApplicantSteps.map((step) => (
                    <Route key={uuid()} path={step.path} element={<step.element />} />
                ))}
            </Routes>

            <Navigation next={next} prev={prev} />
        </>
    )
}
