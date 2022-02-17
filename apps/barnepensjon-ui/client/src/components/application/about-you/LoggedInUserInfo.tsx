import styled from 'styled-components'
import { User } from '../../../context/user/user'
import { Alert, BodyShort, Cell, Grid, Label } from '@navikt/ds-react'
import { fullAdresse } from '../../../utils/adresse'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import useTranslation from '../../../hooks/useTranslation'

const SkjemaGruppe = styled.div`
    margin-top: 20px;
    .mute {
        color: #666;
    }
    .hvorforPanel__toggle {
        padding: 0.2rem 0;
        min-width: 30px;
    }
`

interface LoggedInUserInfoProps {
    user: User
}

export default function LoggedInUserInfo({ user }: LoggedInUserInfoProps) {
    const { t } = useTranslation()

    return (
        <SkjemaGruppe>
            <Alert variant={'warning'}>{t('loggedInUserInfo:advarsel')}</Alert>
            <div className="mute" style={{ margin: '2em 0' }}>
                {t('loggedInUserInfo:valgfritt')}
            </div>
            <Grid className={'opplysninger'}>
                <Cell xs={6}>
                    <div>
                        <Label>{t('felles:navn')}</Label>
                        <BodyShort spacing>
                            {user.fornavn} {user.etternavn}
                        </BodyShort>
                    </div>

                    <div>
                        <Label>{t('felles:fnrDnr')}</Label>
                        <BodyShort spacing>{user.foedselsnummer}</BodyShort>
                    </div>

                    {user.adresse && !user.adressebeskyttelse && (
                        <div>
                            <Label>{t('felles:adresse')}</Label>
                            <BodyShort spacing>{fullAdresse(user)}</BodyShort>
                        </div>
                    )}
                </Cell>

                <Cell xs={6}>
                    <div>
                        <Label>{t('felles:sivilstatus')}</Label>
                        <BodyShort spacing>{user.sivilstatus}</BodyShort>
                    </div>

                    <div>
                        <Label>{t('felles:statsborgerskap')}</Label>
                        <BodyShort spacing>{user.statsborgerskap}</BodyShort>
                    </div>

                    {user.telefonnummer && (
                        <div>
                            <Label>
                                {t('felles:telefonnummer')}&nbsp;
                                <Hjelpetekst>{t('felles:telefonnummerHjelpetekst')}</Hjelpetekst>
                            </Label>
                            <BodyShort spacing>{user.telefonnummer}</BodyShort>
                        </div>
                    )}
                </Cell>
            </Grid>
        </SkjemaGruppe>
    )
}
