import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { Cell, Grid, Label } from '@navikt/ds-react'
import { RHFFoedselsnummerInput, RHFInput } from '../../../common/rhf/RHFInput'
import FormGroup from '../../../common/FormGroup'
import useTranslation from '../../../../hooks/useTranslation'

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
                        <RHFGeneralQuestionRadio name={'childHasGuardianship.answer'} legend={t('childHasGuardian')} />
                    </FormElement>

                    {childHasGuardianship === JaNeiVetIkke.JA && (
                        <>
                            <Label>{t('guardianName')}</Label>
                            <Grid>
                                <Cell xs={12} md={6}>
                                    <RHFInput
                                        name={'childHasGuardianship.firstName'}
                                        label={t('guardianFirstName')}
                                        rules={{ pattern: /^\D+$/ }}
                                        valgfri={true}
                                    />
                                </Cell>
                                <Cell xs={12} md={6}>
                                    <RHFInput
                                        name={'childHasGuardianship.lastName'}
                                        label={t('guardianLastName')}
                                        rules={{ pattern: /^\D+$/ }}
                                        valgfri={true}
                                    />
                                </Cell>
                            </Grid>
                            <FormElement>
                                <RHFFoedselsnummerInput
                                    name={'childHasGuardianship.fnr'}
                                    bredde={'L'}
                                    label={t('guardianFnr')}
                                    placeholder={t('guardianFnrPlaceholder')}
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
