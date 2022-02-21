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
    const { t } = useTranslation()

    return (
        <FormGroup>
            <StepHeading>{t('omDeg:tittel')}</StepHeading>

            <FormGroup>
                <LoggedInUserInfo user={user} />
            </FormGroup>

            <FormGroup>
                <RadioGroup
                    legend={t('omDeg:bostedsadresseBekreftet')}
                    value={livesOnThisAddress}
                    onChange={(value: string) => setLivesOnThisAddress(value)}
                >
                    <Radio value={t('radiobuttons:ja')}>{t('radiobuttons:ja')}</Radio>
                    <Radio value={t('radiobuttons:nei')}>{t('radiobuttons:nei')}</Radio>
                </RadioGroup>
                {livesOnThisAddress === 'Nei' && (
                    <FormGroup>
                        <TextField label={t('omDeg:alternativAdresse')}></TextField>
                    </FormGroup>
                )}
            </FormGroup>

            <FormGroup>
                <RadioGroup
                    legend={t('omDeg:oppholderSegINorge')}
                    description={<WhyWeAsk title={t('omDeg:oppholderSegINorge')}>{t('omDeg:oppholdHvorfor')}</WhyWeAsk>}
                    value={currentlyInNorway}
                    onChange={(value: string) => setCurrentlyInNorway(value)}
                >
                    <Radio value={t('radiobuttons:ja')}>{t('radiobuttons:ja')}</Radio>
                    <Radio value={t('radiobuttons:nei')}>{t('radiobuttons:nei')}</Radio>
                </RadioGroup>

                {currentlyInNorway === 'Ja' && (
                    <FormGroup>
                        <TextField
                            label={t('utbetalingsInformasjon:kontonummer')}
                            description={t('utbetalingsInformasjon:informasjon')}
                        ></TextField>
                    </FormGroup>
                )}

                {currentlyInNorway === 'Nei' && (
                    <>
                        <FormGroup>
                            <Select label={t('omDeg:oppholdsland')}>
                                {selectOptions.map((option) => (
                                    <option key={uuid()} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <RadioGroup legend={t('omDeg:medlemFolketrygdenUtland')}>
                                <Radio value={t('radiobuttons:ja')}>{t('radiobuttons:ja')}</Radio>
                                <Radio value={t('radiobuttons:nei')}>{t('radiobuttons:nei')}</Radio>
                            </RadioGroup>
                            <RadioGroup
                                legend={t('utbetalingsInformasjon:bankkontoType')}
                                value={typeOfBankAccount}
                                onChange={(value: string) => setTypeOfBankAccount(value)}
                            >
                                <Radio value={'Norsk'}>Norsk</Radio>
                                <Radio value={'Utenlandsk'}>Utenlandsk</Radio>
                            </RadioGroup>
                        </FormGroup>
                        {typeOfBankAccount === 'Norsk' && (
                            <FormGroup>
                                <TextField
                                    label={t('utbetalingsInformasjon:kontonummer')}
                                    description={t('utbetalingsInformasjon:informasjon')}
                                ></TextField>
                            </FormGroup>
                        )}
                        {typeOfBankAccount === 'Utenlandsk' && <ForeignBankInfo />}
                    </>
                )}
            </FormGroup>
        </FormGroup>
    )
}
