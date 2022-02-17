import { StepIndicator } from '@navikt/ds-react'
import { ParentApplicantSteps } from '../../utils/steps'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import Navigation from '../common/Navigation'
import { v4 as uuid } from 'uuid'

export default function ParentDialogue() {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const currentIndex = ParentApplicantSteps.findIndex((step) => pathname.includes(step.path))

    const next =
        currentIndex < ParentApplicantSteps.length - 1
            ? () => navigate(`/skjema/forelder/${ParentApplicantSteps[currentIndex + 1].path}`)
            : undefined

    const prev =
        currentIndex > 0 ? () => navigate(`/skjema/forelder/${ParentApplicantSteps[currentIndex - 1].path}`) : undefined

    return (
        <>
            <StepIndicator activeStep={currentIndex}>
                {ParentApplicantSteps.map((step) => (
                    <StepIndicator.Step key={uuid()}>{step.label}</StepIndicator.Step>
                ))}
            </StepIndicator>

            <Routes>
                {ParentApplicantSteps.map((step) => (
                    <Route key={uuid()} path={step.path} element={<step.element />} />
                ))}
            </Routes>

            <Navigation next={next} prev={prev} />
        </>
    )
}
