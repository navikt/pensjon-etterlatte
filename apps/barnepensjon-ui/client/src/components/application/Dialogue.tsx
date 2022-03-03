import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { StepType } from '../../utils/steps'
import { BodyShort, StepIndicator } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import React, { useState } from 'react'
import { ActionTypes } from '../../context/application/application'
import { isDev } from '../../api/axios'
import PageNotFound from '../error/PageNotFound'

interface DialogueProps {
    steps: StepType[]
    pathPrefix: string
}

export interface StepProps {
    next?: () => void
    prev?: () => void
    type?: ActionTypes
}

export default function Dialogue({ steps, pathPrefix }: DialogueProps) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const currentIndex = steps.findIndex((step) => pathname.includes(step.path))

    const [visitedPaths, setVisitedPaths] = useState<StepType[]>(steps.slice(0, currentIndex + 1))
    const visitNavigate = (step: StepType) => {
        setVisitedPaths([...visitedPaths, step])
        navigate(`${pathPrefix}${step.path}`)
    }

    const next = currentIndex < steps.length - 1 ? () => visitNavigate(steps[currentIndex + 1]) : undefined

    const prev = currentIndex > 0 ? () => visitNavigate(steps[currentIndex - 1]) : undefined

    return (
        <>
            <StepIndicator activeStep={currentIndex}>
                {steps.map((step) => (
                    <StepIndicator.Step
                        key={uuid()}
                        onClick={() => isDev && visitNavigate(step)}
                        disabled={isDev && !visitedPaths.includes(step)}
                    >
                        <BodyShort>{step.label}</BodyShort>
                    </StepIndicator.Step>
                ))}
            </StepIndicator>

            <Routes>
                {steps.map((step: StepType) => (
                    <Route key={uuid()} path={step.path} element={<step.element next={next} prev={prev} />} />
                ))}

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}
