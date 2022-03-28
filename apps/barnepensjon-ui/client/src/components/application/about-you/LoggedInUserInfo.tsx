import { Alert, BodyShort, Cell, Grid, Label } from '@navikt/ds-react'
import styled from 'styled-components'
import { User } from '../../../context/user/user'
import useTranslation from '../../../hooks/useTranslation'
import { fullAdresse } from '../../../utils/adresse'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import FormGroup from '../../common/FormGroup'
import FormElement from '../../common/FormElement'

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
        <FormGroup>
            <FormElement>
                <Alert variant={'warning'}>{t('incorrectInfoMustBeCorrected', { ns: 'loggedInUserInfo' })}</Alert>
            </FormElement>
            <Grid>
                <Cell xs={6}>
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
                </Cell>

                <Cell xs={6}>
                    {user.telefonnummer && (
                        <>
                            <div>
                                <Label>{t('fnrDnr')}</Label>
                                <BodyShort spacing>{user.foedselsnummer}</BodyShort>
                            </div>
                            <HelpTextLabel>
                                <Label as={'span'}>
                                    {t('phoneNumber')}&nbsp;
                                    <Hjelpetekst>{t('phoneNumberHelpText')}</Hjelpetekst>
                                </Label>
                                <BodyShort spacing>{user.telefonnummer}</BodyShort>
                            </HelpTextLabel>
                        </>
                    )}
                </Cell>
            </Grid>
        </FormGroup>
    )
}
