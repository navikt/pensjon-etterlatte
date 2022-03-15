import useTranslation from '../../../../hooks/useTranslation'
import TextGroup from '../TextGroup'

export const PersonInfoSummary = ({ firstName, lastName, fnrDnr, citizenship }: any) => {
    const { t } = useTranslation('common')

    return (
        <>
            <TextGroup title={t('firstName')} content={firstName} />
            <TextGroup title={t('lastName')} content={lastName} />
            <TextGroup title={t('fnrDnr')} content={fnrDnr} />
            <TextGroup title={t('citizenship')} content={citizenship} />
        </>
    )
}
