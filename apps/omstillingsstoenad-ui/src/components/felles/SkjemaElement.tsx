import { ReactNode } from 'react'
import styled from 'styled-components'

const SkjemaElementDiv = styled.div`
    margin: 1rem 0 1rem 0;
`

export function SkjemaElement({ children }: { children: ReactNode }) {
    return <SkjemaElementDiv>{children}</SkjemaElementDiv>
}
