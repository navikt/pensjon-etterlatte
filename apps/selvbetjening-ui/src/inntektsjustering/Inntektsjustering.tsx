import InntektsjusteringForm from "~inntektsjustering/InntektsjusteringForm";
import {Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Heading, Label} from "@navikt/ds-react";
import {getInntektsjustering} from "~api/api";
import {IInntektsjustering} from "~inntektsjustering/InntektsjusteringDto";
import Navigation from "~components/Navigation";
import {formaterDatoStrengTilLocaleDateTime} from "~utils/dates";

export const inntektsjusteringPath = {
    root: '/inntektsjustering/*',
    form: '/inntektsjustering/inntekt',
    oppsummering: '/inntektsjustering/oppsummering',
    kvittering: '/inntektsjustering/kvittering',
}

export default function Inntektsjustering() {

    return (
        <Routes>
            <Route path={'*'} element={<InntektsjusteringStart/>}/>
            <Route path={'inntekt'} element={<InntektsjusteringForm/>}/>
            <Route path={'oppsummering'} element={<InntektsjusteringOppsummering/>}/>
            <Route path={'kvittering'} element={<InntektsjusteringKvittering/>}/>
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
                    <Heading size={"medium"}>Tidligere oppgitt inntekt</Heading>
                    <Heading size={"small"}>Inntekt for neste år 2025</Heading>
                    <Label>Forventet brutto inntekt i Norge for 2025</Label>
                    <p>{eksisterende.arbeidsinntekt}</p>
                    <p>Oppgitt: {formaterDatoStrengTilLocaleDateTime(eksisterende.tidspunkt)}</p>
                </div>
            )}
            <Navigation right={{
                label: 'Neste',
                navigateTo: inntektsjusteringPath.form
            }}/>
        </>
    )
}

function InntektsjusteringOppsummering() {

    // TODO submit onclick med feilhåndtering

    return (
        <>
            <div>
                InntektsjusteringOppsummering
            </div>
            <Navigation
                right={{
                    label: 'Neste',
                    navigateTo: inntektsjusteringPath.kvittering
                }}
                left={{
                    label: 'Forrige',
                    navigateTo: inntektsjusteringPath.form
                }}
            />
        </>
    )
}

function InntektsjusteringKvittering() {

    return (
        <>
            <div>
                InntektsjusteringKvittering
            </div>
        </>
    )
}
