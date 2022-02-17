import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { StepType } from '../../utils/steps'
import { BodyShort, StepIndicator } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import Navigation from '../common/Navigation'
import React from 'react'

interface DialogueProps {
    steps: StepType[]
    pathPrefix: string
}

export default function Dialogue({ steps, pathPrefix }: DialogueProps) {
    const navigate = useNavigate()

    const { pathname } = useLocation()

    const currentIndex = steps.findIndex((step) => pathname.includes(step.path))

    const next =
        currentIndex < steps.length - 1 ? () => navigate(`${pathPrefix}${steps[currentIndex + 1].path}`) : undefined

    const prev = currentIndex > 0 ? () => navigate(`${pathPrefix}${steps[currentIndex - 1].path}`) : undefined

    const send = currentIndex === steps.length - 1 ? () => console.log('SEND') : undefined

    return (
        <>
            <StepIndicator activeStep={currentIndex}>
                {steps.map((step) => (
                    <StepIndicator.Step key={uuid()}>
                        <BodyShort>{step.label}</BodyShort>
                    </StepIndicator.Step>
                ))}
            </StepIndicator>

            <Routes>
                {steps.map((step: StepType) => (
                    <Route key={uuid()} path={step.path} element={<step.element />} />
                ))}
            </Routes>

            <Navigation next={next} prev={prev} send={send} />
        </>
    )
}
