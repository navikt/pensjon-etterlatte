import { ReactNode } from 'react'
import styled from 'styled-components'

const FormElementDiv = styled.div`
    margin: 1rem 0 1rem 0;
`

export default function FormElement({ children }: { children: ReactNode }) {
    return <FormElementDiv>{children}</FormElementDiv>
}
