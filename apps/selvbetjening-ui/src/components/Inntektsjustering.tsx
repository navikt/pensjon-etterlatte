import useTranslation from '../hooks/useTranslation'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";
import FormGroup from "~common/FormGroup";
import {useForm} from "react-hook-form";
import {Button, Checkbox, Heading, Label, TextField} from "@navikt/ds-react";
import styled from "styled-components";
import {useState} from "react";

interface IInntektsjustering {
    arbeidsinntekt?: number
    naeringsinntekt?: number
    arbeidsinntektUtland?: number
    naeringsinntektUtland?: number
}

export default function Inntektsjustering() {
    const {t} = useTranslation('inntektsjustering')
    const {logEvent} = useAmplitude()

    logEvent(LogEvents.PAGE_CHANGE)

    const [valgtArbeidsinntekt, setValgtArbeidsinntekt] = useState(false)
    const [valgtNaeringsinntekt, setValgtNaeringsinntekt] = useState(false)
    const [valgtNorge, setValgtNorge] = useState(false)
    const [valgtUtlnad, setValgtUtland] = useState(false)

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
            <InntektValg>
                <Label>Hvilken type inntekt har du?</Label>
                <Checkbox
                    value={true}
                    onClick={() => setValgtArbeidsinntekt(!valgtArbeidsinntekt)}
                    checked={valgtArbeidsinntekt}
                >{t('arbeidsinntekt')}</Checkbox>
                <Checkbox
                    value={true}
                    onClick={() => setValgtNaeringsinntekt(!valgtNaeringsinntekt)}
                    checked={valgtNaeringsinntekt}
                >{t('naeringsinntekt')}</Checkbox>
            </InntektValg>
            <InntektValg>
                <Label>Hvor har du inntekten fra?</Label>
                <Checkbox
                    value={true}
                    onClick={() => setValgtNorge(!valgtNorge)}
                    checked={valgtNorge}
                >{t('norge')}</Checkbox>
                <Checkbox
                    value={true}
                    onClick={() => setValgtUtland(!valgtUtlnad)}
                    checked={valgtUtlnad}
                >{t('utland')}</Checkbox>
            </InntektValg>
            <form>
                {(valgtArbeidsinntekt && valgtNorge) &&
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
                {(valgtArbeidsinntekt && valgtUtlnad) &&
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
                {(valgtNaeringsinntekt && valgtNorge) &&
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
                {(valgtNaeringsinntekt && valgtUtlnad) &&
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

const InntektValg = styled.div`
    margin-bottom: 2em;
`