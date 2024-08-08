import InntektsjusteringForm from "~inntektsjustering/InntektsjusteringForm";
import {Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Heading} from "@navikt/ds-react";
import {getInntektsjustering} from "~api/api";
import {IInntektsjustering} from "~inntektsjustering/InntektsjusteringDto";
import Navigation from "~components/Navigation";

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
