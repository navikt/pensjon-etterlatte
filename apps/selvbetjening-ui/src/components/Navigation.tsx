import {useNavigate} from "react-router-dom";
import {Button} from "@navikt/ds-react";
import styled, {css} from "styled-components";
import FormGroup from "~common/FormGroup";
import React from "react";
import {logEvent} from "amplitude-js";


interface NavButtonProps {
    label?: string
    navigateTo?: string
    onClick?: () => void
}

export default function Navigation({left, right}: { left?: NavButtonProps, right?: NavButtonProps }) {
    const navigate = useNavigate()

    const onClickWrapper = (button: NavButtonProps) => {
        if (button.onClick) button.onClick()
        if (button.navigateTo) navigate(button.navigateTo)
    }

    return (
        <NavFooter>
            <NavRow>
                {left && <Button onClick={() => {onClickWrapper(left)}}>{left.label}</Button>}
                {right && <Button onClick={() => {onClickWrapper(right)}}>{right.label}</Button>}
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
