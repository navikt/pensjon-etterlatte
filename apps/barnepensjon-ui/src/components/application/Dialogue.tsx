import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { StepType } from '../../utils/steps'
import { Stepper } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import React, { useState } from 'react'
import { ActionTypes } from '../../context/application/application'
import { isDev } from '../../api/axios'
import PageNotFound from '../error/PageNotFound'
import useTranslation from '../../hooks/useTranslation'

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
    const { t } = useTranslation('steps')

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const currentIndex = steps.findIndex((step) => pathname.includes(step.path))

    const [visitedPaths, setVisitedPaths] = useState<StepType[]>(steps.slice(0, currentIndex + 1))
    const visitNavigate = (stepIndex: number) => {
        const step = steps[stepIndex]
        setVisitedPaths([...visitedPaths, step])
        navigate(`${pathPrefix}${step.path}`)
    }

    const next = currentIndex < steps.length - 1 ? () => visitNavigate(currentIndex + 1) : undefined

    const prev = currentIndex > 0 ? () => visitNavigate(currentIndex - 1) : undefined

    return (
        <>
            <Stepper
                activeStep={currentIndex + 1}
                onStepChange={(step) => isDev && visitNavigate(step - 1)}
                orientation={'horizontal'}
            >
                {steps.map((step) => (
                    <Stepper.Step key={uuid()} interactive={visitedPaths.includes(step)}>
                        {t(step.label)}
                    </Stepper.Step>
                ))}
            </Stepper>

            <Routes>
                {steps.map((step: StepType) => (
                    <Route key={uuid()} path={step.path} element={<step.element next={next} prev={prev} />} />
                ))}

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}
