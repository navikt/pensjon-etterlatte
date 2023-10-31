import useTranslation from '../../../../hooks/useTranslation'
import { TextGroup } from '../TextGroup'
import { IMissingFNR } from '../../../../context/application/application'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { AddressType } from '../../../common/PersonInfo'

export default function PersonInfoSummary({
    name,
    firstName,
    lastName,
    fnrDnr,
    citizenship,
    address,
    missingFNR,
}: {
    name?: string
    firstName?: string
    lastName?: string
    fnrDnr?: string
    citizenship?: string
    address?: string
    missingFNR?: IMissingFNR
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

            {missingFNR && (
                <>
                    <TextGroup title={t('dateOfBirth')} content={missingFNR.dateOfBirth} />
                    <TextGroup title={t('livesInNorway')} content={missingFNR.livesInNorway} />
                    {missingFNR.livesInNorway === JaNeiVetIkke.JA && (
                        <>
                            {missingFNR.livingInNorway?.CO && (
                                <TextGroup title={'C/O'} content={missingFNR.livingInNorway?.CO} />
                            )}
                            <TextGroup title={t('addressType')} content={t(missingFNR.livingInNorway?.addressType!!)} />
                            <TextGroup
                                title={
                                    missingFNR.livingInNorway?.addressType === AddressType.VEGADRESSE
                                        ? t('roadAddress')
                                        : t('postBox')
                                }
                                content={missingFNR.livingInNorway?.address}
                            />
                            <TextGroup title={t('city')} content={missingFNR.livingInNorway?.city} />
                            <TextGroup title={t('zipCode')} content={missingFNR.livingInNorway?.zipCode} />
                        </>
                    )}

                    {missingFNR.livesInNorway === JaNeiVetIkke.NEI && (
                        <>
                            {missingFNR.livingAbroad?.CO && (
                                <TextGroup title={'C/O'} content={missingFNR.livingAbroad?.CO} />
                            )}
                            <TextGroup title={t('addressAbroad')} content={missingFNR.livingAbroad?.address} />

                            {missingFNR.livingAbroad?.building && (
                                <TextGroup title={t('building')} content={missingFNR.livingAbroad?.building} />
                            )}
                            {missingFNR.livingAbroad?.zipCode && (
                                <TextGroup title={t('zipCode')} content={missingFNR.livingAbroad?.zipCode} />
                            )}
                            {missingFNR.livingAbroad?.city && (
                                <TextGroup title={t('city')} content={missingFNR.livingAbroad?.city} />
                            )}
                            {missingFNR.livingAbroad?.region && (
                                <TextGroup title={t('region')} content={missingFNR.livingAbroad?.region} />
                            )}
                            <TextGroup title={t('country')} content={missingFNR.livingAbroad?.country} />
                        </>
                    )}
                </>
            )}
        </>
    )
}
