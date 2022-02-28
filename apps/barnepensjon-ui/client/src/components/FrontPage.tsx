import { Alert, BodyLong, Button, ConfirmationPanel, Heading, Link } from '@navikt/ds-react'
import { useUserContext } from '../context/user/UserContext'
import useTranslation from '../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import LanguageSelect from './common/LanguageSelect'
import NavGuide from './common/NavGuide'
import FormGroup from './common/FormGroup'
import { useState } from 'react'
import { useApplicationContext } from '../context/application/ApplicationContext'
import { ActionTypes } from '../context/application/application'

export default function FrontPage() {
    const navigate = useNavigate()

    const { state: user } = useUserContext()
    const { state, dispatch } = useApplicationContext()

    const [consent, setConsent] = useState(state?.applicant?.consent || false)

    const { t } = useTranslation('forside')

    const { fornavn, etternavn } = user

    function next() {
        dispatch({
            type: ActionTypes.UPDATE_APPLICANT,
            payload: { ...state.applicant, consent },
        })
        navigate('velg-scenarie')
    }

    return (
        <div className={'forside'}>
            <FormGroup>
                <NavGuide>{t('hei', { fornavn, etternavn })}</NavGuide>
            </FormGroup>

            <FormGroup>
                <LanguageSelect />
            </FormGroup>

            <FormGroup>
                <Alert inline={true} variant={'info'}>
                    <b>{t('uthentingAvInfo.infotekst')}</b>
                </Alert>
            </FormGroup>

            <FormGroup>
                <Heading spacing size={'large'}>
                    {t('tittel')}
                </Heading>

                <BodyLong spacing>{t('omYtelsene.innhold')}</BodyLong>

                <Alert inline={true} variant={'warning'}>
                    <BodyLong spacing>
                        <b>
                            {t('omYtelsene.papirsoeknad.innhold')}&nbsp;
                            <Link href={t('omYtelsene.papirsoeknad.href')}>{t('omYtelsene.papirsoeknad.tekst')}</Link>
                        </b>
                    </BodyLong>
                </Alert>

                <BodyLong>
                    <Link href={t('omYtelsene.lenkeGjenlevende.href')}>{t('omYtelsene.lenkeGjenlevende.tekst')}</Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('omYtelsene.lenkeOvergangsstoenad.href')}>
                        {t('omYtelsene.lenkeOvergangsstoenad.tekst')}
                    </Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('barnepensjon.tittel')}</Heading>

                <BodyLong spacing>{t('barnepensjon.innhold')}</BodyLong>
                <BodyLong>
                    <Link href={t('barnepensjon.href')}>{t('barnepensjon.tekst')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('uthentingAvInfo.tittel')}</Heading>

                <BodyLong>{t('uthentingAvInfo.innhold')}</BodyLong>

                <ul>
                    <li>
                        <BodyLong>{t('uthentingAvInfo.innholdListe.li1')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('uthentingAvInfo.innholdListe.li2')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('uthentingAvInfo.innholdListe.li3')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('uthentingAvInfo.innholdListe.li4')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('uthentingAvInfo.innholdListe.li5')}</BodyLong>
                    </li>
                </ul>

                <BodyLong>
                    <Link href={t('uthentingAvInfo.lenke1.href')}>{t('uthentingAvInfo.lenke1.tekst')}</Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('uthentingAvInfo.lenke2.href')}>{t('uthentingAvInfo.lenke2.tekst')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('samtykke.tittel')}</Heading>

                <BodyLong>{t('samtykke.innhold')}</BodyLong>

                <ConfirmationPanel
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    label={t('samtykke.bekreftelse', { fornavn, etternavn })}
                    size="medium"
                />
            </FormGroup>

            <FormGroup>
                <Button size={'medium'} variant={'primary'} onClick={next} disabled={!consent}>
                    {t('startSoeknad')}
                </Button>
            </FormGroup>
        </div>
    )
}
