import {useNavigate} from "react-router-dom";
import {Button} from "@navikt/ds-react";
import styled, {css} from "styled-components";
import FormGroup from "~common/FormGroup";
import React from "react";


interface NavButtonProps {
    label?: string
    navigateTo?: string
}

export default function Navigation({left, right}: { left?: NavButtonProps, right?: NavButtonProps }) {
    const navigate = useNavigate()
    console.log(right)
    return (
        <NavFooter>
            <NavRow>
                {left && <Button onClick={() => left.navigateTo ? navigate(left.navigateTo) : ''}>{left.label}</Button>}
                {right && <Button onClick={() => right.navigateTo ? navigate(right.navigateTo) : ''}>{right.label}</Button>}
            </NavRow>
        </NavFooter>
    )
}

export const NavRow = styled.div<{ disabled?: boolean }>`
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 1rem;
    margin-bottom: 2rem;

    .knapp {
        margin-bottom: 0;
    }

    ${(props) => {
    if (props.disabled) {
        return css`
                opacity: 0.6;
                pointer-events: none;
            `
    }
}}
`


const NavFooter = styled(FormGroup)`
    @media screen and (max-width: 650px) {
        .knapp {
            font-size: 1rem;
            padding: 0 1rem;
            width: 50%;
        }
    }
`
