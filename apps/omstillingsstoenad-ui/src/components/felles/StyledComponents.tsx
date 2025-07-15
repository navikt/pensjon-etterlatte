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
