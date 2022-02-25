import { User } from '../../../context/user/user'
import { Alert, BodyShort, Cell, Grid, Label } from '@navikt/ds-react'
import { fullAdresse } from '../../../utils/adresse'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'

interface LoggedInUserInfoProps {
    user: User
}

export default function LoggedInUserInfo({ user }: LoggedInUserInfoProps) {
    const { t } = useTranslation('felles')

    return (
        <FormGroup>
            <Alert variant={'warning'}>{t('advarsel', { ns: 'loggedInUserInfo' })}</Alert>
            <div className="mute" style={{ margin: '2em 0' }}>
                {t('valgfritt', { ns: 'loggedInUserInfo' })}
            </div>
            <Grid className={'opplysninger'}>
                <Cell xs={6}>
                    <div>
                        <Label>{t('navn')}</Label>
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
                            <Label>{t('adresse')}</Label>
                            <BodyShort spacing>{fullAdresse(user)}</BodyShort>
                        </div>
                    )}
                </Cell>

                <Cell xs={6}>
                    <div>
                        <Label>{t('sivilstatus')}</Label>
                        <BodyShort spacing>{user.sivilstatus}</BodyShort>
                    </div>

                    <div>
                        <Label>{t('statsborgerskap')}</Label>
                        <BodyShort spacing>{user.statsborgerskap}</BodyShort>
                    </div>

                    {user.telefonnummer && (
                        <div>
                            <Label as={'div'}>
                                {t('telefonnummer')}&nbsp;
                                <Hjelpetekst>{t('telefonnummerHjelpetekst')}</Hjelpetekst>
                            </Label>
                            <BodyShort spacing>{user.telefonnummer}</BodyShort>
                        </div>
                    )}
                </Cell>
            </Grid>
        </FormGroup>
    )
}
