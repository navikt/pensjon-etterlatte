import { ReactNode } from 'react'
import styled from 'styled-components'

const FormGroupFieldset = styled.fieldset`
    margin-bottom: 3rem;
    padding: 0;
    border: 0;
`

export default function FormGroup({ children }: { children: ReactNode }) {
    return <FormGroupFieldset>{children}</FormGroupFieldset>
}
