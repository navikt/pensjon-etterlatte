import { ReactNode } from 'react'
import styled from 'styled-components'

const SkjemaGruppeFieldset = styled.fieldset`
    margin: 0 0 3rem 0;
    padding: 0;
    border: 0;
`

export function SkjemaGruppe({ children }: { children: ReactNode }) {
    return <SkjemaGruppeFieldset>{children}</SkjemaGruppeFieldset>
}