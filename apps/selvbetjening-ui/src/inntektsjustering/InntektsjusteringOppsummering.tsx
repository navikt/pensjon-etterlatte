import Navigation from "~components/Navigation";
import React from "react";
import {IInntektsjusteringForm, inntektsjusteringPath} from "~inntektsjustering/Inntektsjustering";
import {IInntektsjusteringLagre} from "~inntektsjustering/InntektsjusteringDto";
import {saveInntektsjustering} from "~api/api";
import {useFormContext} from "react-hook-form";
import {Heading} from "@navikt/ds-react";

export default function InntektsjusteringOppsummering() {


    const {handleSubmit, getValues} = useFormContext()

    const {
        skalHaInntektNorge,
        skalHaInntektUtland,
        skalHaArbeidsinntekt,
        skalHaNaeringsinntekt,
        arbeidsinntekt,
        naeringsinntekt,
        arbeidsinntektUtland,
        naeringsinntektUtland
    } = getValues() as IInntektsjusteringForm

    const onSubmit = (inntektsjustering: IInntektsjusteringForm) => {
        const {skalHaInntektNorge, skalHaInntektUtland, skalHaArbeidsinntekt, skalHaNaeringsinntekt} = inntektsjustering
        const dto: IInntektsjusteringLagre = {
            arbeidsinntekt: skalHaArbeidsinntekt && skalHaInntektNorge ? inntektsjustering.arbeidsinntekt!! : 0,
            arbeidsinntektUtland: skalHaArbeidsinntekt && skalHaInntektUtland ? inntektsjustering.arbeidsinntektUtland!! : 0,
            naeringsinntekt: skalHaNaeringsinntekt && skalHaInntektNorge ? inntektsjustering.naeringsinntekt!! : 0,
            naeringsinntektUtland: skalHaNaeringsinntekt && skalHaInntektUtland ? inntektsjustering.naeringsinntektUtland!! : 0,
        }

        // TODO submit onclick neste med feilhåndtering  - skal avbryte steg videre hvis feiler
        saveInntektsjustering(dto)
    }

    return (
        <>
            <Heading spacing size="large" level="1">
                Oppsummering
            </Heading>
            <div>
                {!skalHaArbeidsinntekt && !skalHaNaeringsinntekt &&
                    <label>
                        Ingen inntekt valgt
                    </label>
                }
                {skalHaInntektNorge && skalHaArbeidsinntekt &&
                    <InntektVisning label={'Arbeidsinntekt'} inntekt={arbeidsinntekt!!}/>}
                {skalHaInntektNorge && skalHaNaeringsinntekt &&
                    <InntektVisning label={'Næringsinntekt'} inntekt={naeringsinntekt!!}/>}
                {skalHaInntektUtland && skalHaArbeidsinntekt &&
                    <InntektVisning label={'Arbeidsinntekt utland'} inntekt={arbeidsinntektUtland!!}/>}
                {skalHaInntektUtland && skalHaNaeringsinntekt &&
                    <InntektVisning label={'Næringsinntekt utland'} inntekt={naeringsinntektUtland!!}/>}
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

const InntektVisning = ({label, inntekt}: { label: string, inntekt: number }) => (
    <div>
        <label>
            {label}
        </label>
        <p>
            {inntekt}
        </p>
    </div>
)

