import styled from 'styled-components'

export const InfocardWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    margin: 0 auto;
    column-gap: 1rem;
`

export const Infocard = styled.div<{ $hasError?: boolean }>`
    background-color: #e7e9e9;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-radius: 5px;
    border: ${(props) => (props.$hasError ? '1px solid var(--a-red-500)' : 0)};
    box-shadow: ${(props) => (props.$hasError ? '0 0 0 1px var(--a-red-500, var(--a-red-500, var(--a-red-500)))' : 0)};
    @media screen and (min-width: 650px) {
        max-width: 48%;
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

export const InformationBox = styled.div`
    padding: 2rem 2rem;
    text-align: center;
`

export const InformationBoxContent = styled.div`
    text-align: center;
`
