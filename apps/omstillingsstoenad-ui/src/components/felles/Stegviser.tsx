import { isDev } from '../../api/axios'
import { BodyShort, Button, Heading, Stepper } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import { IStegElement } from '../../typer/steg'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useState } from 'react'
import { Collapse, Expand } from '@navikt/ds-icons'

interface Props {
    aktivtSteg: number
    settSteg: (value: number) => void
    muligeSteg: IStegElement[]
    besoekteSteg: IStegElement[]
}

const ProgressBar = styled.div<{ $prosess: string; $lastStep: boolean }>`
    height: 1rem;
    background-color: #cce2f0;
    color: #66a3c4;
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    span {
        background-color: #66a3c4;
        height: 1rem;
        display: block;
        width: ${(props) => props.$prosess};
        border-radius: ${(props) => (props.$lastStep ? '1rem' : '1rem 0 0 1rem')};
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

const Stegviser = ({ aktivtSteg, settSteg, muligeSteg, besoekteSteg }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const { t } = useTranslation()

    const aktivSide = aktivtSteg + 1
    const prosess = `${(100 / muligeSteg.length) * aktivSide}%`
    const stegNavn = t(muligeSteg[aktivtSteg].label)
    const stegOversikt = `Steg ${aktivSide} av ${muligeSteg.length}`

    return (
        <>
            <FlexSpaceBetween>
                <Button
                    variant={'tertiary-neutral'}
                    icon={isOpen ? <Collapse fontSize={24} aria-hidden /> : <Expand fontSize={24} aria-hidden />}
                    onClick={() => setIsOpen(!isOpen)}
                    iconPosition={'right'}
                    aria-label={`${stegNavn} - ${stegOversikt} - Klikk for å ${
                        isOpen ? 'lukke' : 'åpne'
                    } oversikt over stegene`}
                >
                    <Heading size={'small'}>{stegNavn}</Heading>
                </Button>
            </FlexSpaceBetween>
            <ProgressBar $prosess={prosess} $lastStep={muligeSteg.length === aktivSide}>
                <span />
            </ProgressBar>
            <BodyShort>{stegOversikt}</BodyShort>
            {isOpen && (
                <Stepper
                    activeStep={aktivSide}
                    onStepChange={(step) => isDev && settSteg(step - 1)}
                    orientation={'vertical'}
                    interactive={isDev}
                >
                    {muligeSteg.map((steg, index) => (
                        <Stepper.Step
                            key={uuid()}
                            completed={index < aktivtSteg}
                            interactive={besoekteSteg.includes(steg)}
                        >
                            {t(steg.label)}
                        </Stepper.Step>
                    ))}
                </Stepper>
            )}
        </>
    )
}

export default Stegviser
