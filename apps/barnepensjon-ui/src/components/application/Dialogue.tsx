import { FormProgress } from '@navikt/ds-react'
import React, { useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { ActionTypes } from '~context/application/application'
import { StepType } from '~utils/steps'
import useTranslation from '../../hooks/useTranslation'
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
            <FormProgress
                totalSteps={steps.length}
                activeStep={currentIndex + 1}
                onStepChange={(step) => visitNavigate(step - 1)}
                interactiveSteps={false}
                translations={{
                    step: t('Step', { activePage: String(currentIndex + 1), totalPages: String(steps.length) }),
                    showAllSteps: t('showAllSteps'),
                    hideAllSteps: t('hideAllSteps'),
                }}
            >
                {steps.map((step: StepType, index) => (
                    <FormProgress.Step key={uuid()} completed={index < currentIndex}>
                        {t(step.label)}
                    </FormProgress.Step>
                ))}
            </FormProgress>

            <Routes>
                {steps.map((step: StepType) => (
                    <Route key={uuid()} path={step.path} element={<step.element next={next} prev={prev} />} />
                ))}

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}
