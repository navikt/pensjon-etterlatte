import useTranslation from '../../hooks/useTranslation'
import { HGrid, Label, RadioProps } from '@navikt/ds-react'
import { RHFFoedselsnummerInput, RHFInput } from './rhf/RHFInput'
import { RHFSelect } from './rhf/RHFSelect'
import FormGroup from './FormGroup'
import useCountries from '../../hooks/useCountries'
import FormElement from './FormElement'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { RHFCheckboksGruppe } from './rhf/RHFCheckboksPanelGruppe'
import { useFormContext } from 'react-hook-form'
import { RHFGeneralQuestionRadio, RHFRadio } from './rhf/RHFRadio'
import { JaNeiVetIkke } from '../../api/dto/FellesOpplysninger'
import DatePicker from './DatePicker'

interface Props {
    duplicateList?: string[]
}

export enum AddressType {
    VEGADRESSE = 'VEGADRESSE',
    POSTBOKSADRESSE = 'POSTBOKSADRESSE',
}

export default function PersonInfo({ duplicateList }: Props) {
    const { t } = useTranslation('common')
    const { countries }: { countries: any } = useCountries()

    const { watch } = useFormContext()

    const missingFNR = watch('missingFNR.answer')
    const livesInNorway = watch('missingFNR.livesInNorway')
    const addressType = watch('missingFNR.livingInNorway.addressType')

    return (
        <FormGroup>
            <FormElement>
                <HGrid gap="4" columns={{ xs: 1, sm: 2 }} align={'start'}>
                    <RHFInput name={'firstName'} label={t('firstName')} rules={{ pattern: /^\D+$/ }} />
                    <RHFInput name={'lastName'} label={t('lastName')} rules={{ pattern: /^\D+$/ }} />
                </HGrid>
            </FormElement>
            <FormElement>
                <HGrid gap="4" columns={{ xs: 1, sm: 2 }} align={'start'}>
                    <RHFFoedselsnummerInput
                        name={'fnrDnr'}
                        label={t('fnrDnr')}
                        rules={{
                            validate: {
                                validate: (value) => {
                                    if (missingFNR?.length) return true
                                    return fnrValidator(value).status === 'valid'
                                },
                                duplicate: (value) => !duplicateList || !duplicateList.includes(value),
                            },
                        }}
                        disabled={missingFNR?.length}
                        valgfri={missingFNR?.length}
                    />

                    <RHFSelect name={`citizenship`} label={t('citizenship')} children={countries} />
                </HGrid>
            </FormElement>
            <FormElement>
                <HGrid gap="4" columns={{ xs: 1, sm: 2 }}>
                    <RHFCheckboksGruppe
                        name={'missingFNR.answer'}
                        legend={''}
                        required={false}
                        checkboxes={[
                            {
                                children: t('missingFNR'),
                                value: 'true',
                            },
                        ]}
                    />
                    <div />
                </HGrid>
            </FormElement>
            {missingFNR?.includes('true') && (
                <>
                    <FormElement>
                        <DatePicker name={'missingFNR.dateOfBirth'} label={t('dateOfBirth')} maxDate={new Date()} />
                    </FormElement>

                    <FormElement>
                        <RHFGeneralQuestionRadio
                            name={'missingFNR.livesInNorway'}
                            legend={'Bor den gjenlevende i Norge?'}
                        />
                    </FormElement>
                </>
            )}

            {livesInNorway === JaNeiVetIkke.JA && (
                <>
                    <FormElement>
                        <RHFRadio
                            name={'missingFNR.livingInNorway.addressType'}
                            legend={t('addressType')}
                            children={Object.values(AddressType).map((value) => {
                                return { children: t(value), value, required: true } as RadioProps
                            })}
                        />
                    </FormElement>

                    {addressType !== undefined && (
                        <>
                            <Label>Kontaktadresse</Label>
                            <FormElement>
                                <RHFInput name={'missingFNR.livingInNorway.CO'} label={'C/O'} valgfri={true} />
                            </FormElement>
                            <FormElement>
                                {addressType === AddressType.VEGADRESSE ? (
                                    <RHFInput name={'missingFNR.livingInNorway.address'} label={t('roadAddress')} />
                                ) : (
                                    <RHFInput name={'missingFNR.livingInNorway.address'} label={t('postBox')} />
                                )}
                            </FormElement>
                            <FormElement>
                                <RHFInput name={'missingFNR.livingInNorway.zipCode'} label={t('zipCode')} />
                            </FormElement>
                            <FormElement>
                                <RHFInput name={'missingFNR.livingInNorway.city'} label={t('city')} />
                            </FormElement>
                        </>
                    )}
                </>
            )}

            {livesInNorway === JaNeiVetIkke.NEI && (
                <>
                    <Label>Utenlandsk kontaktadresse</Label>
                    <FormElement>
                        <RHFInput name={'missingFNR.livingAbroad.CO'} label={'C/O '} valgfri={true} />
                    </FormElement>
                    <FormElement>
                        <RHFInput name={'missingFNR.livingAbroad.address'} label={t('addressAbroad')} />
                    </FormElement>
                    <FormElement>
                        <RHFInput name={'missingFNR.livingAbroad.building'} label={t('building')} valgfri={true} />
                    </FormElement>
                    <FormElement>
                        <RHFInput name={'missingFNR.livingAbroad.zipCode'} label={t('zipCode')} valgfri={true} />
                    </FormElement>
                    <FormElement>
                        <RHFInput name={'missingFNR.livingAbroad.city'} label={t('city')} valgfri={true} />
                    </FormElement>
                    <FormElement>
                        <RHFInput name={'missingFNR.livingAbroad.region'} label={t('region')} valgfri={true} />
                    </FormElement>
                    <RHFSelect name={'missingFNR.livingAbroad.country'} label={t('country')} children={countries} />
                </>
            )}
        </FormGroup>
    )
}
