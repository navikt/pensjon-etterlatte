import { Heading } from '@navikt/ds-react'
import { ReactNode } from 'react'
import styled from 'styled-components'

const CenterHeading = styled(Heading)`
    margin-top: 3rem;
    text-align: center;
`

export default function StepHeading({ children }: { children: ReactNode }) {
    return <CenterHeading size={'medium'}>{children}</CenterHeading>
}
