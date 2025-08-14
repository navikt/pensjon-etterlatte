import { HGrid, Label, VStack } from '@navikt/ds-react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import { GridColumns, GridGap } from '../../../../utils/grid'
import { RHFFoedselsnummerInput, RHFInput } from '../../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'

interface Props {
    isGuardian: boolean
    childHasGuardianship?: JaNeiVetIkke
}

export const GuardianDetails = ({ isGuardian, childHasGuardianship }: Props) => {
    const { t } = useTranslation('aboutChildren')

    return (
        <>
            {!isGuardian && (
                <VStack gap="8">
                    <RHFGeneralQuestionRadio
                        id={'hasGuardianQuestion'}
                        name={'childHasGuardianship.answer'}
                        legend={t('childHasGuardian')}
                    />

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
                            <RHFFoedselsnummerInput
                                name={'childHasGuardianship.fnr'}
                                label={t('guardianFnr')}
                                description={t('guardianFnrPlaceholder')}
                                valgfri={true}
                            />
                        </>
                    )}
                </VStack>
            )}
        </>
    )
}
