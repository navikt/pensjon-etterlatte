import useTranslation from '../hooks/useTranslation'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";
import FormGroup from "~common/FormGroup";
import {useFormContext} from "react-hook-form";
import {
    Heading,
    Label,
    TextField
} from "@navikt/ds-react";
import styled from "styled-components";
import React from "react";
import {RHFCheckbox} from "~common/rhc/RHFCheckbox";
import Navigation from "~components/Navigation";
import {IInntektsjusteringForm, inntektsjusteringPath} from "~inntektsjustering/Inntektsjustering";

export default function InntektsjusteringForm({}) {
    const {t} = useTranslation('inntektsjustering')
    const {logEvent} = useAmplitude()

    logEvent(LogEvents.PAGE_CHANGE)

    const {
        register,
        watch,
        formState: {errors},
    } = useFormContext<IInntektsjusteringForm>()

    const valgtArbeidsinntekt = watch('skalHaArbeidsinntekt', false)
    const valgtNaeringsinntekt = watch('skalHaNaeringsinntekt', false)
    const valgtNorge = watch('skalHaInntektNorge', false)
    const valgtUtland = watch('skalHaInntektUtland', false)

    return (
        <div>
            <Heading spacing size="large" level="1">
                Inntekt neste år
            </Heading>
            <Infotekst>
                <p>Paragraf 1 yada yada</p>
                <p>Paragraf 2 yada yada</p>
            </Infotekst>

            <>
                <InntektValg>
                    <Label>Hvilken type inntekt har du?</Label>
                    <RHFCheckbox
                        name={'skalHaArbeidsinntekt'}
                        checkbox={{
                            children: t('arbeidsinntekt'),
                            value: false
                        }}
                        required={false}
                        legend={''}
                    />
                    <RHFCheckbox
                        name={'skalHaNaeringsinntekt'}
                        checkbox={{
                            children: t('naeringsinntekt'),
                            value: false
                        }}
                        required={false}
                        legend={''}
                    />
                </InntektValg>
                <InntektValg>
                    <Label>Hvor har du inntekten fra?</Label>
                    <RHFCheckbox
                        name={'skalHaInntektNorge'}
                        checkbox={{
                            children: t('norge'),
                            value: false
                        }}
                        required={false}
                        legend={''}
                    />
                    <RHFCheckbox
                        name={'skalHaInntektUtland'}
                        checkbox={{
                            children: t('utland'),
                            value: false
                        }}
                        required={false}
                        legend={''}
                    />
                </InntektValg>
                {valgtArbeidsinntekt && valgtNorge &&
                    < FormGroup>
                        < Heading spacing size="small" level="3">
                            Arbeidsinntekt Norge
                        </Heading>
                        <p>Beskrivelse..</p>
                        <TekstFelt
                            {...register('arbeidsinntekt', {
                                required: true
                            })}
                            label={"Arbeidsinntekt.."}
                            description={"Beskrivelse kommer.."}
                            size="medium"
                            type="tel"
                            inputMode="numeric"
                            disabled={false}
                            error={errors.arbeidsinntekt?.message}
                        />
                    </FormGroup>
                }
                {valgtArbeidsinntekt && valgtUtland &&
                    <FormGroup>
                        <Heading spacing size="small" level="3">
                            Arbeidsinntekt Utland
                        </Heading>
                        <p>Beskrivelse..</p>
                        <TekstFelt
                            {...register('arbeidsinntektUtland', {
                                required: true
                            })}
                            label={"Arbeidsinntekt utland.."}
                            description={"Beskrivelse kommer.."}
                            size="medium"
                            type="tel"
                            inputMode="numeric"
                            disabled={false}
                            error={errors.arbeidsinntektUtland?.message}
                        />
                    </FormGroup>
                }
                {valgtNaeringsinntekt && valgtNorge &&
                    <FormGroup>
                        <Heading spacing size="small" level="3">
                            Næringsinntekt Norge
                        </Heading>
                        <p>Beskrivelse..</p>
                        <TekstFelt
                            {...register('naeringsinntekt', {
                                required: true
                            })}
                            label={"Næringsinntekt.."}
                            description={"Beskrivelse kommer.."}
                            size="medium"
                            type="tel"
                            inputMode="numeric"
                            disabled={false}
                            error={errors.naeringsinntekt?.message}
                        />
                    </FormGroup>
                }
                {valgtNaeringsinntekt && valgtUtland &&
                    <FormGroup>
                        <Heading spacing size="small" level="3">
                            Næringsinntekt Utland
                        </Heading>
                        <p>Beskrivelse..</p>
                        <TekstFelt
                            {...register('naeringsinntektUtland', {
                                required: true
                            })}
                            label={"Næringsinntekt utland.."}
                            description={"Beskrivelse kommer.."}
                            size="medium"
                            type="tel"
                            inputMode="numeric"
                            disabled={false}
                            error={errors.naeringsinntektUtland?.message}
                        />
                    </FormGroup>
                }
            </>
            <Navigation
                right={{
                    text: 'Neste',
                    navigateTo: inntektsjusteringPath.oppsummering
                }}
                left={{
                    text: 'Forrige',
                    navigateTo: inntektsjusteringPath.root
                }}
            />
        </div>
    )
}

const TekstFelt = styled(TextField)`
    max-width: 17em;
`

const Infotekst = styled.div`
    margin-bottom: 4em;
`

const InntektValg = styled.div`
    margin-bottom: 2em;
`