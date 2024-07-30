import useTranslation from '../hooks/useTranslation'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";
import FormGroup from "~common/FormGroup";
import {FormProvider, useForm} from "react-hook-form";
import {Button, Heading, TextField} from "@navikt/ds-react";
import styled from "styled-components";

interface IInntektsjustering {
    arbeidsinntekt?: number
    naeringsinntekt?: number
    arbeidsinntektUtland?: number
    naeringsinntektUtland?: number
}

export default function Inntektsjustering() {
    const {t} = useTranslation('frontPage')
    const {logEvent} = useAmplitude()

    logEvent(LogEvents.PAGE_CHANGE)


    const methods = useForm<IInntektsjustering>({
        defaultValues: {},
        mode: 'onBlur',
    })
    const {
        handleSubmit,
        register,
        formState: {errors},
    } = methods

    const onSubmit = (inntektsjustering: IInntektsjustering) => {
        console.log(inntektsjustering)
    }

    return (
        <div>
            <Heading spacing size="large" level="1">
                Inntekt neste år
            </Heading>
            <Infotekst>
                <p>Paragraf 1 yada yada</p>
                <p>Paragraf 2 yada yada</p>
            </Infotekst>
            <form>
                <FormGroup>
                    <Heading spacing size="small" level="3">
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
                <Button size="small" loading={false} onClick={handleSubmit(onSubmit)}>
                    Send inn
                </Button>
            </form>
        </div>
    )
}

const TekstFelt = styled(TextField)`
    max-width: 17em;
`

const Infotekst = styled.div`
    margin-bottom: 4em;
`