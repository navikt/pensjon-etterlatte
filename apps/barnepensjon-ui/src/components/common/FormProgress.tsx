import { isDev } from '~api/axios'
import { BodyShort, Button, Heading, Stepper } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import styled from 'styled-components'
import { useState } from 'react'
import { Collapse, Expand } from '@navikt/ds-icons'
import { StepType } from '~utils/steps'
import useTranslation from '~hooks/useTranslation'

interface Props {
    activeStep: number
    setStep: (value: number) => void
    possibleSteps: StepType[]
    visitedSteps: StepType[]
}

const ProgressBar = styled.div<{ $prosess: string; $lastStep: boolean }>`
    height: 1rem;
    background-color: var(--a-surface-neutral-subtle);
    color: var(--a-surface-alt-3);
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    box-shadow:
        inset 0 1px 3px #00000026,
        inset 0 0 1px #0003;
    span {
        background-color: var(--a-surface-alt-3);
        height: 1rem;
        display: block;
        width: ${(props) => props.$prosess};
        border-radius: inherit;
    }
`

const FlexSpaceBetween = styled.div`
    display: flex;

    button {
        width: 100%;
        padding: 0.5rem 2px 0.5rem 0;
        justify-content: space-between;
    }
`

const FormProgressHeader = styled(Heading)`
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
`

const FormProgress = ({ activeStep, setStep, possibleSteps, visitedSteps }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const { t } = useTranslation('steps')

    const activePage = activeStep + 1
    const progress = `${(100 / possibleSteps.length) * activePage}%`
    const stepName = t(possibleSteps[activeStep].label)
    const stepOverview = t('step', { activePage: String(activePage), possibleStep: String(possibleSteps.length) })

    return (
        <>
            {isDev ? (
                <FlexSpaceBetween>
                    <Button
                        variant={'tertiary-neutral'}
                        icon={isOpen ? <Collapse fontSize={24} aria-hidden /> : <Expand fontSize={24} aria-hidden />}
                        onClick={() => setIsOpen(!isOpen)}
                        iconPosition={'right'}
                        aria-label={`${stepName} - ${stepOverview} - Klikk for å ${
                            isOpen ? 'lukke' : 'åpne'
                        } oversikt over stegene`}
                    >
                        <Heading size={'small'}>{stepName}</Heading>
                    </Button>
                </FlexSpaceBetween>
            ) : (
                <FormProgressHeader size={'small'}>{stepName}</FormProgressHeader>
            )}
            <ProgressBar $prosess={progress} $lastStep={possibleSteps.length === activePage}>
                <span />
            </ProgressBar>
            <BodyShort>{stepOverview}</BodyShort>
            {isOpen && isDev && (
                <Stepper
                    activeStep={activePage}
                    onStepChange={(step) => setStep(step - 1)}
                    orientation={'vertical'}
                    interactive={true}
                >
                    {possibleSteps.map((steg, index) => (
                        <Stepper.Step
                            key={uuid()}
                            completed={index < activeStep}
                            interactive={visitedSteps.includes(steg)}
                        >
                            {t(steg.label)}
                        </Stepper.Step>
                    ))}
                </Stepper>
            )}
        </>
    )
}

export default FormProgress
