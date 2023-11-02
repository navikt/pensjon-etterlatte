import { Alert, BodyShort, Label, HelpText, HGrid } from '@navikt/ds-react'
import styled from 'styled-components'
import { User } from '../../../context/user/user'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import FormElement from '../../common/FormElement'
import { fullAdresse } from '../../../utils/personalia'
import { GridColumns, GridGap } from '../../../utils/grid'

interface LoggedInUserInfoProps {
    user: User
}

const HelpTextLabel = styled.div`
    .navds-label {
        display: flex;
    }
`

export default function LoggedInUserInfo({ user }: LoggedInUserInfoProps) {
    const { t } = useTranslation('common')

    return (
        <>
            <FormElement>
                <Alert variant={'warning'}>{t('incorrectInfoMustBeCorrected', { ns: 'loggedInUserInfo' })}</Alert>
            </FormElement>
            <FormGroup>
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
                            <HelpTextLabel>
                                <Label as={'span'}>
                                    {t('phoneNumber')}&nbsp;
                                    <HelpText placement={'top'}>{t('phoneNumberHelpText')}</HelpText>
                                </Label>
                                <BodyShort spacing>{user.telefonnummer}</BodyShort>
                            </HelpTextLabel>
                        )}
                    </>
                </HGrid>
            </FormGroup>
        </>
    )
}
