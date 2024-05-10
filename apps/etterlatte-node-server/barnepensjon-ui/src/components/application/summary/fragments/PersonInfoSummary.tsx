import useTranslation from '../../../../hooks/useTranslation'
import { TextGroup } from '../TextGroup'

export default function PersonInfoSummary({
    name,
    firstName,
    lastName,
    fnrDnr,
    citizenship,
    address,
}: {
    name?: string
    firstName?: string
    lastName?: string
    fnrDnr?: string
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

            <TextGroup title={t('fnrDnr')} content={fnrDnr} />
            <TextGroup title={t('citizenship')} content={citizenship} />
            {address && <TextGroup title={t('address')} content={address} />}
        </>
    )
}
