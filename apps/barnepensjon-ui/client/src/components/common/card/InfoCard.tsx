import styled from 'styled-components'
import { Link } from '@navikt/ds-react'

export const Infocard = styled.div`
    background-color: #e7e9e9;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
        max-width: 49%;
    }
`

export const InfocardHeader = styled.div`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    align-items: flex-end;

    img {
        margin: 0 auto;
    }

    opacity: 0.4;
`

export const InfocardFooter = styled.div`
    margin-bottom: 1rem;
`

export const InfocardFooterItem = styled(Link)`
    display: flex;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
`

export const InformationBox = styled.div`
    padding: 2rem 2rem;
    text-align: center;
`

export const InformationBoxContent = styled.div`
    text-align: center;
`

export const InformationElement = styled.div`
    margin: 10px 0 10px 0;
`
