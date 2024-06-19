import useTranslation from '../../../../hooks/useTranslation'
import { TextGroup } from '../TextGroup'

export default function PersonInfoSummary({
    name,
    firstName,
    lastName,
    fnrDnr,
    dateOfBirth,
    citizenship,
    address,
}: {
    name?: string
    firstName?: string
    lastName?: string
    fnrDnr?: string
    dateOfBirth?: string
    citizenship?: string
    address?: string
}) {
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

            {fnrDnr ? (
                <TextGroup title={t('fnrDnr')} content={fnrDnr} />
            ) : (
                <TextGroup title={t('dateOfBirth')} content={dateOfBirth} />
            )}
            <TextGroup title={t('citizenship')} content={citizenship} />
            {address && <TextGroup title={t('address')} content={address} />}
        </>
    )
}
