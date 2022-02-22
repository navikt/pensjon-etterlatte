import { useState } from 'react'
import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import { Radio, RadioGroup, Select, TextField, Cell, Grid, Label, BodyLong, Heading } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import DatePicker from '../../common/DatePicker'
import WhyWeAsk from '../../common/WhyWeAsk'
import { v4 as uuid } from 'uuid'

const selectOptions = [
    { value: '', label: 'Velg land' },
    { value: 'norge', label: 'Norge' },
    { value: 'sverige', label: 'Sverige' },
]

export default function AboutTheDeceased() {
    const [typeOfBankAccount, setTypeOfBankAccount] = useState<string>('')
    const { t } = useTranslation('omDenAvdoede')

    return (
        <FormGroup>
            <StepHeading>Om den avdøde</StepHeading>
            <FormGroup>
                <Label>{t('hvem')}</Label>

                <Grid>
                    <Cell xs={12} md={6}>
                        <TextField name={'omDenAvdoede.fornavn'} label={t('fornavn')} />
                    </Cell>

                    <Cell xs={12} md={6}>
                        <TextField name={'omDenAvdoede.etternavn'} label={t('etternavn')} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell xs={12} md={6}>
                        <TextField
                            name={'omDenAvdoede.fnrDnr'}
                            label={t('fnrDnr')}
                            placeholder={t('fnrDnr.placeholder')}
                        />
                    </Cell>

                    <Cell xs={12} md={6}>
                        <Select label={t('statsborgerskap')}>
                            {selectOptions.map((option) => (
                                <option key={uuid()} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </Cell>
                </Grid>
            </FormGroup>
            <FormGroup>
                <Label>{t('datoForDoedsfallet')}</Label>
                <DatePicker name={'avdoed.datoForDoedsfallet'} label={t('dato')} maxDate={new Date()} />
            </FormGroup>

            <FormGroup>
                <RadioGroup
                    legend={t('doedsfallAarsak')}
                    value={typeOfBankAccount}
                    onChange={(value: string) => setTypeOfBankAccount(value)}
                    description={<WhyWeAsk title="omAvdoede.doedsfallAarsak">{t('doedsfallAarsakHvorfor')}</WhyWeAsk>}
                >
                    <Radio value={t('ja')}>{t('ja')}</Radio>
                    <Radio value={t('nei')}>{t('nei')}</Radio>
                    <Radio value={t('vetIkke')}>{t('vetIkke')}</Radio>
                </RadioGroup>
            </FormGroup>

            <FormGroup>
                <FormGroup>
                    <Heading size="small">{t('boddEllerJobbetUtland.tittel')}</Heading>
                    <BodyLong>{t('boddEllerJobbetUtland.ingress')}</BodyLong>
                </FormGroup>
                <RadioGroup
                    legend={t('boddEllerJobbetUtland.svar')}
                    value={typeOfBankAccount}
                    onChange={(value: string) => setTypeOfBankAccount(value)}
                >
                    <Radio value={t('ja')}>{t('ja')}</Radio>
                    <Radio value={t('nei')}>{t('nei')}</Radio>
                    <Radio value={t('vetIkke')}>{t('vetIkke')}</Radio>
                </RadioGroup>
            </FormGroup>
        </FormGroup>
    )
}
