import { Heading } from '@navikt/ds-react'
import { ReactNode } from 'react'
import styled from 'styled-components'
import FormGroup from './FormGroup'

const CenterHeading = styled(Heading)`
    margin-top: 3rem;
    text-align: center;
`

export default function StepHeading({ children }: { children: ReactNode }) {
    return (
        <FormGroup>
            <CenterHeading size={'medium'}>{children}</CenterHeading>
        </FormGroup>
    )
}
