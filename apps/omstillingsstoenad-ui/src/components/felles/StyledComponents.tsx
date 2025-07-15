import styled from 'styled-components'

export const InfokortHeader = styled.div<{ $gjennomsiktig?: boolean }>`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    align-items: flex-end;
    opacity: ${(props) => (props.$gjennomsiktig ? 0.4 : 1)};
    img {
        margin: 0 auto;
    }
`

export const InfokortInformasjonsboks = styled.div`
    padding: 2rem 2rem;
`

export const Infokort = styled.div`
    .typo-element {
        margin: 0.3rem 0;
    }

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
