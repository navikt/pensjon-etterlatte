import { StepIndicator } from '@navikt/ds-react'
import { ChildApplicantSteps, ParentApplicantSteps } from '../../utils/steps'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import { v4 as uuid } from 'uuid'
import Navigation from '../common/Navigation'

export default function ChildDialogue() {
    const navigate = useNavigate()

    const { pathname } = useLocation()

    const currentIndex = ChildApplicantSteps.findIndex((step) => pathname.includes(step.path))

    const next =
        currentIndex < ParentApplicantSteps.length - 1
            ? () => navigate(`/skjema/barn/${ChildApplicantSteps[currentIndex + 1].path}`)
            : undefined

    const prev =
        currentIndex > 0 ? () => navigate(`/skjema/barn/${ChildApplicantSteps[currentIndex - 1].path}`) : undefined

    return (
        <>
            <StepIndicator activeStep={currentIndex}>
                {ChildApplicantSteps.map((step) => (
                    <StepIndicator.Step key={uuid()}>{step.label}</StepIndicator.Step>
                ))}
            </StepIndicator>

            <Routes>
                {ChildApplicantSteps.map((step) => (
                    <Route key={uuid()} path={step.path} element={<step.element />} />
                ))}
            </Routes>

            <Navigation next={next} prev={prev} />
        </>
    )
}
