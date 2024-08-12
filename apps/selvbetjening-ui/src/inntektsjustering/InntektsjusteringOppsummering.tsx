import Navigation from "~components/Navigation";
import React from "react";
import {IInntektsjusteringForm, inntektsjusteringPath} from "~inntektsjustering/Inntektsjustering";
import {IInntektsjusteringLagre} from "~inntektsjustering/InntektsjusteringDto";
import {saveInntektsjustering} from "~api/api";
import {useFormContext} from "react-hook-form";
import {Alert, Heading} from "@navikt/ds-react";
import styled from "styled-components";

export default function InntektsjusteringOppsummering() {

    const {
        getValues,
        formState: {errors},
    } = useFormContext<IInntektsjusteringForm>()

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

    const onSubmit = async (inntektsjustering: IInntektsjusteringForm) => {
        const {skalHaInntektNorge, skalHaInntektUtland, skalHaArbeidsinntekt, skalHaNaeringsinntekt} = inntektsjustering
        const dto: IInntektsjusteringLagre = {
            arbeidsinntekt: skalHaArbeidsinntekt && skalHaInntektNorge ? inntektsjustering.arbeidsinntekt!! : 0,
            arbeidsinntektUtland: skalHaArbeidsinntekt && skalHaInntektUtland ? inntektsjustering.arbeidsinntektUtland!! : 0,
            naeringsinntekt: skalHaNaeringsinntekt && skalHaInntektNorge ? inntektsjustering.naeringsinntekt!! : 0,
            naeringsinntektUtland: skalHaNaeringsinntekt && skalHaInntektUtland ? inntektsjustering.naeringsinntektUtland!! : 0,
        }
        await saveInntektsjustering(dto)
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
            {errors.root?.serverError && <Error><Alert variant={'error'}>{errors.root.serverError.message}</Alert></Error>}
            <Navigation
                right={{
                    text: 'Send inn inntektsjustering',
                    navigateTo: inntektsjusteringPath.kvittering,
                    onSubmit: onSubmit
                }}
                left={{
                    text: 'Forrige',
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

const Error = styled.div`
    margin: 1em 0 1em 0;
`