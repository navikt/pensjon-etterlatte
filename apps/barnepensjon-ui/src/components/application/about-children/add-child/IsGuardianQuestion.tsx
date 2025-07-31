import { BodyShort, Box } from '@navikt/ds-react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'

interface Props {
    isGuardian: boolean
    loggedInUserIsGuardian?: JaNeiVetIkke
}

export const IsGuardianQuestion = ({ isGuardian, loggedInUserIsGuardian }: Props) => {
    const { t } = useTranslation('aboutChildren')

    return (
        <>
            {isGuardian && (
                <>
                    <Box marginBlock="8">
                        <RHFGeneralQuestionRadio
                            id={'isGuardianQuestion'}
                            name={'loggedInUserIsGuardian'}
                            legend={t('loggedInUserIsGuardian')}
                        />
                    </Box>

                    {loggedInUserIsGuardian === JaNeiVetIkke.JA && (
                        <BodyShort>{t('needToSendInDocumentation')}</BodyShort>
                    )}
                </>
            )}
        </>
    )
}
