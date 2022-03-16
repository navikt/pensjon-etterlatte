import useTranslation from '../../../../hooks/useTranslation'
import TextGroup from '../TextGroup'

export const PersonInfoSummary = ({
    name,
    firstName,
    lastName,
    fnrDnr,
    citizenship,
    address,
}: {
    name?: String
    firstName?: String
    lastName?: String
    fnrDnr?: String
    citizenship?: String
    address?: String
}) => {
    const { t } = useTranslation('common')

    return (
        <>
            {name ? (
                <TextGroup title={t('name')} content={name} />
            ) : (
                <>
                    <TextGroup title={t('firstName')} content={firstName} />
                    <TextGroup title={t('lastName')} content={lastName} />
                </>
            )}

            <TextGroup title={t('fnrDnr')} content={fnrDnr} />
            <TextGroup title={t('citizenship')} content={citizenship} />
            {address && <TextGroup title={t('address')} content={address} />}
        </>
    )
}
