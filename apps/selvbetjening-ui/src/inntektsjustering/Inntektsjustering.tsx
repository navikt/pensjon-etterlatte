import InntektsjusteringForm from "~inntektsjustering/InntektsjusteringForm";
import {Route, Routes, useNavigate } from "react-router-dom";
import FrontPage from "~components/FrontPage";
import React, {useEffect, useState} from "react";
import styled, {css} from "styled-components";
import FormGroup from "~common/FormGroup";
import {Button, Heading} from "@navikt/ds-react";
import {m} from "vitest/dist/reporters-yx5ZTtEV";
import {getInntektsjustering} from "~api/api";
import {IInntektsjustering} from "~inntektsjustering/InntektsjusteringDto";

export default function Inntektsjustering() {

    return (
        <Routes>
            <Route path={'*'} element={<InntektsjusteringStart/>}/>
            <Route path={'inntekt'} element={<InntektsjusteringForm/>}/>
        </Routes>
    )
}

function InntektsjusteringStart() {

    const [eksisterende, setEksisterende] = useState<IInntektsjustering | null>(null)

    useEffect(() => {
        getInntektsjustering().then(result => {
            if (result) {
                setEksisterende(result)
            }
        })
    }, []);

    return (
        <>
            {!eksisterende && (
                <div>
                    <Heading size={"medium"}>Oppgi inntekt for neste år</Heading>
                </div>
            )}
            {eksisterende && (
                <div>
                    <Heading size={"medium"}>Allerede oppgitt inntekt for neste år</Heading>
                </div>
            )}
            <Navigation right={{
                label: 'Neste',
                navigateTo: 'inntekt'
            }}/>
        </>
    )
}

interface NavButtonProps {
    label?: string
    navigateTo?: string
    //onClick?: () => void
}


function Navigation({left, right}: { left?: NavButtonProps, right?: NavButtonProps }) {
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
