import { ReactNode } from 'react'
import styled from 'styled-components'

const FormGroupFieldset = styled.fieldset`
    margin: 0 0 2rem 0;
    padding: 0;
    border: 0;
`

export default function FormGroup({ children }: { children: ReactNode }) {
    return <FormGroupFieldset>{children}</FormGroupFieldset>
}
