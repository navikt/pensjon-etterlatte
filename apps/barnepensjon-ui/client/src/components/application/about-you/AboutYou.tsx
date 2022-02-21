import { useState } from 'react'
import { useUserContext } from '../../../context/user/UserContext'
import LoggedInUserInfo from './LoggedInUserInfo'
import { Radio, RadioGroup, Select, TextField } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import WhyWeAsk from '../../common/WhyWeAsk'
import ForeignBankInfo from './ForeignBankInfo'
import { v4 as uuid } from 'uuid'

const selectOptions = [
    { value: '', label: 'Velg land' },
    { value: 'norge', label: 'Norge' },
    { value: 'sverige', label: 'Sverige' },
]

export default function AboutYou() {
    const [livesOnThisAddress, setLivesOnThisAddress] = useState<string>('')
    const [currentlyInNorway, setCurrentlyInNorway] = useState<string>('')
    const [typeOfBankAccount, setTypeOfBankAccount] = useState<string>('')

    const { state: user } = useUserContext()
    const { t } = useTranslation('omDeg')

    return (
        <FormGroup>
            <StepHeading>{t('tittel')}</StepHeading>

            <FormGroup>
                <LoggedInUserInfo user={user} />
            </FormGroup>

            <FormGroup>
                <RadioGroup
                    legend={t('bostedsadresseBekreftet')}
                    value={livesOnThisAddress}
                    onChange={(value: string) => setLivesOnThisAddress(value)}
                >
                    <Radio value={t('ja')}>{t('ja')}</Radio>
                    <Radio value={t('nei')}>{t('nei')}</Radio>
                </RadioGroup>
                {livesOnThisAddress === 'Nei' && (
                    <FormGroup>
                        <TextField label={t('alternativAdresse')}></TextField>
                    </FormGroup>
                )}
            </FormGroup>

            <FormGroup>
                <RadioGroup
                    legend={t('oppholderSegINorge')}
                    description={<WhyWeAsk title={t('oppholderSegINorge')}>{t('oppholdHvorfor')}</WhyWeAsk>}
                    value={currentlyInNorway}
                    onChange={(value: string) => setCurrentlyInNorway(value)}
                >
                    <Radio value={t('ja')}>{t('ja')}</Radio>
                    <Radio value={t('nei')}>{t('nei')}</Radio>
                </RadioGroup>

                {currentlyInNorway === 'Ja' && (
                    <FormGroup>
                        <TextField label={t('kontonummer')} description={t('informasjon')}></TextField>
                    </FormGroup>
                )}

                {currentlyInNorway === 'Nei' && (
                    <>
                        <FormGroup>
                            <Select label={t('oppholdsland')}>
                                {selectOptions.map((option) => (
                                    <option key={uuid()} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <RadioGroup legend={t('medlemFolketrygdenUtland')}>
                                <Radio value={t('ja')}>{t('ja')}</Radio>
                                <Radio value={t('nei')}>{t('nei')}</Radio>
                            </RadioGroup>
                            <RadioGroup
                                legend={t('bankkontoType')}
                                value={typeOfBankAccount}
                                onChange={(value: string) => setTypeOfBankAccount(value)}
                            >
                                <Radio value={'Norsk'}>Norsk</Radio>
                                <Radio value={'Utenlandsk'}>Utenlandsk</Radio>
                            </RadioGroup>
                        </FormGroup>
                        {typeOfBankAccount === 'Norsk' && (
                            <FormGroup>
                                <TextField label={t('kontonummer')} description={t('informasjon')}></TextField>
                            </FormGroup>
                        )}
                        {typeOfBankAccount === 'Utenlandsk' && <ForeignBankInfo />}
                    </>
                )}
            </FormGroup>
        </FormGroup>
    )
}
