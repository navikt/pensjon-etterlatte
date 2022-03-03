import { Alert, BodyShort, Cell, Grid, Label } from '@navikt/ds-react'
import { User } from '../../../context/user/user'
import useTranslation from '../../../hooks/useTranslation'
import { fullAdresse } from '../../../utils/adresse'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import FormGroup from '../../common/FormGroup'
import styled from 'styled-components'

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
            <Alert variant={'warning'}>{t('advarsel', { ns: 'loggedInUserInfo' })}</Alert>
            <div className="mute" style={{ margin: '2em 0' }}>
                {t('valgfritt', { ns: 'loggedInUserInfo' })}
            </div>
            <Grid className={'opplysninger'}>
                <Cell xs={6}>
                    <div>
                        <Label>{t('name')}</Label>
                        <BodyShort spacing>
                            {user.fornavn} {user.etternavn}
                        </BodyShort>
                    </div>

                    <div>
                        <Label>{t('fnrDnr')}</Label>
                        <BodyShort spacing>{user.foedselsnummer}</BodyShort>
                    </div>

                    {user.adresse && !user.adressebeskyttelse && (
                        <div>
                            <Label>{t('address')}</Label>
                            <BodyShort spacing>{fullAdresse(user)}</BodyShort>
                        </div>
                    )}
                </Cell>

                <Cell xs={6}>
                    <div>
                        <Label>{t('maritalStatus')}</Label>
                        <BodyShort spacing>{user.sivilstatus}</BodyShort>
                    </div>

                    <div>
                        <Label>{t('citizenship')}</Label>
                        <BodyShort spacing>{user.statsborgerskap}</BodyShort>
                    </div>

                    {user.telefonnummer && (
                        <>
                            <HelpTextLabel>
                                <Label>
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
