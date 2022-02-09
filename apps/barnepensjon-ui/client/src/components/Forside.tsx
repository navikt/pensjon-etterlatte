import { Alert, BodyLong, Button, ConfirmationPanel, Heading, Link } from '@navikt/ds-react'
import { useUserContext } from '../context/user/UserContext'
import useTranslation from '../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import LanguageSelect from './common/LanguageSelect'
import NavGuide from './common/NavGuide'
import FormGroup from './common/FormGroup'

const Forside = () => {
    const navigate = useNavigate()

    const { state: brukerState } = useUserContext()

    const { t } = useTranslation('forside')

    const { fornavn, etternavn } = brukerState

    const heiTekst = <div className={!fornavn ? 'blur-text' : ''}>{t('hei', [fornavn, etternavn])}</div>

    return (
        <div className={'forside'}>
            <FormGroup>
                <NavGuide>{heiTekst}</NavGuide>
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
                    checked={false}
                    onChange={() => ''}
                    label={t('samtykke.bekreftelse', [fornavn, etternavn])}
                    size="medium"
                />
            </FormGroup>

            <FormGroup>
                <Button size={'medium'} variant={'primary'} onClick={() => navigate('/skjema/steg/velg-scenarie')}>
                    {t('startSoeknad')}
                </Button>
            </FormGroup>
        </div>
    )
}

export default Forside
