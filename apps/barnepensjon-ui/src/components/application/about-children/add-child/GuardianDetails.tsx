import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { HGrid, Label } from '@navikt/ds-react'
import { RHFFoedselsnummerInput, RHFInput } from '../../../common/rhf/RHFInput'
import FormGroup from '../../../common/FormGroup'
import useTranslation from '../../../../hooks/useTranslation'
import { GridColumns, GridGap } from '../../../../utils/grid'

interface Props {
    isGuardian: boolean
    childHasGuardianship?: JaNeiVetIkke
}

export const GuardianDetails = ({ isGuardian, childHasGuardianship }: Props) => {
    const { t } = useTranslation('aboutChildren')

    return (
        <>
            {!isGuardian && (
                <FormGroup>
                    <FormElement>
                        <RHFGeneralQuestionRadio
                            id={'hasGuardianQuestion'}
                            name={'childHasGuardianship.answer'}
                            legend={t('childHasGuardian')}
                        />
                    </FormElement>

                    {childHasGuardianship === JaNeiVetIkke.JA && (
                        <>
                            <Label>{t('guardianName')}</Label>
                            <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
                                <RHFInput
                                    name={'childHasGuardianship.firstName'}
                                    label={t('guardianFirstName')}
                                    rules={{ pattern: /^\D+$/ }}
                                    valgfri={true}
                                />
                                <RHFInput
                                    name={'childHasGuardianship.lastName'}
                                    label={t('guardianLastName')}
                                    rules={{ pattern: /^\D+$/ }}
                                    valgfri={true}
                                />
                            </HGrid>
                            <FormElement>
                                <RHFFoedselsnummerInput
                                    name={'childHasGuardianship.fnr'}
                                    label={t('guardianFnr')}
                                    description={t('guardianFnrPlaceholder')}
                                    valgfri={true}
                                />
                            </FormElement>
                        </>
                    )}
                </FormGroup>
            )}
        </>
    )
}
