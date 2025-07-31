import { ExternalLink } from '@navikt/ds-icons'
import { Alert, BodyShort, HelpText, HGrid, Label, Link, VStack } from '@navikt/ds-react'
import { User } from '../../../context/user/user'
import useTranslation from '../../../hooks/useTranslation'
import { GridColumns, GridGap } from '../../../utils/grid'
import { fullAdresse } from '../../../utils/personalia'
import Trans from '../../common/Trans'

interface LoggedInUserInfoProps {
    user: User
}

export default function LoggedInUserInfo({ user }: LoggedInUserInfoProps) {
    const { t } = useTranslation('common')

    return (
        <VStack marginBlock="4 8" gap="4">
            <Alert variant={'info'}>
                <Trans value={t('incorrectInfoMustBeCorrected', { ns: 'loggedInUserInfo' })} />
                <Link href={t('incorrectInfoMustBeCorrectedHref', { ns: 'loggedInUserInfo' })} target={'_blank'}>
                    {t('incorrectInfoMustBeCorrectedHrefText', { ns: 'loggedInUserInfo' })} <ExternalLink aria-hidden />
                </Link>
            </Alert>
            <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
                <div>
                    <Label>{t('name')}</Label>
                    <BodyShort spacing>
                        {user.fornavn} {user.etternavn}
                    </BodyShort>
                </div>

                {user.adresse && !user.adressebeskyttelse && (
                    <div>
                        <Label>{t('address')}</Label>
                        <BodyShort spacing>{fullAdresse(user)}</BodyShort>
                    </div>
                )}

                <>
                    <div>
                        <Label>{t('fnrDnr')}</Label>
                        <BodyShort spacing>{user.foedselsnummer}</BodyShort>
                    </div>
                    {user.telefonnummer && (
                        <HGrid gap="1">
                            <Label as={'span'}>
                                {t('phoneNumber')}&nbsp;
                                <HelpText placement={'top'}>{t('phoneNumberHelpText')}</HelpText>
                            </Label>
                            <BodyShort spacing>{user.telefonnummer}</BodyShort>
                        </HGrid>
                    )}
                </>
            </HGrid>
        </VStack>
    )
}
