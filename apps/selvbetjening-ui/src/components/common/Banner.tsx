import React from 'react'
import styled from 'styled-components'
import { Heading } from '@navikt/ds-react'

const Header = styled.div`
    width: 100%;
    height: max-content;
    padding: 0.5rem 1rem 0.5rem 1rem;
    display: flex;
    border-bottom: 4px solid #826ba1;
    background-color: #c1b5d0;
    align-items: center;
    justify-content: center;
`

export default function Banner({ tekst }: { tekst: string }) {
    return (
        <Header role="banner">
            <Heading size={'large'}>{tekst}</Heading>
        </Header>
    )
}
