import { Alert, BodyLong, Button, ConfirmationPanel, Heading, Link } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../context/application/application'
import { useApplicationContext } from '../context/application/ApplicationContext'
import { useUserContext } from '../context/user/UserContext'
import useTranslation from '../hooks/useTranslation'
import FormGroup from './common/FormGroup'
import LanguageSelect from './common/LanguageSelect'
import NavGuide from './common/NavGuide'

export default function FrontPage() {
    const navigate = useNavigate()

    const { state: user } = useUserContext()
    const { state, dispatch } = useApplicationContext()

    const [consent, setConsent] = useState(state?.applicant?.consent || false)

    const { t } = useTranslation('frontPage')

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
                <NavGuide>{t('hello', { fornavn, etternavn })}</NavGuide>
            </FormGroup>

            <FormGroup>
                <LanguageSelect />
            </FormGroup>

            <FormGroup>
                <Alert inline={true} variant={'info'}>
                    <b>{t('retrievalOfInformation.infotext')}</b>
                </Alert>
            </FormGroup>

            <FormGroup>
                <Heading spacing size={'large'}>
                    {t('title')}
                </Heading>

                <BodyLong spacing>{t('aboutTheBenefit.content')}</BodyLong>

                <Alert inline={true} variant={'warning'}>
                    <BodyLong spacing>
                        <b>
                            {t('aboutTheBenefit.paperApplication.content')}&nbsp;
                            <Link href={t('aboutTheBenefit.paperApplication.href')}>
                                {t('aboutTheBenefit.paperApplication.text')}
                            </Link>
                        </b>
                    </BodyLong>
                </Alert>

                <BodyLong>
                    <Link href={t('aboutTheBenefit.linkSurvivor.href')}>{t('aboutTheBenefit.linkSurvivor.text')}</Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('aboutTheBenefit.linkTransitionalBenefit.href')}>
                        {t('aboutTheBenefit.linkTransitionalBenefit.text')}
                    </Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('childrensPension.title')}</Heading>

                <BodyLong spacing>{t('childrensPension.content')}</BodyLong>
                <BodyLong>
                    <Link href={t('childrensPension.href')}>{t('childrensPension.text')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('retrievalOfInformation.title')}</Heading>

                <BodyLong>{t('retrievalOfInformation.content')}</BodyLong>

                <ul>
                    <li>
                        <BodyLong>{t('retrievalOfInformation.contentList.li1')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('retrievalOfInformation.contentList.li2')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('retrievalOfInformation.contentList.li3')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('retrievalOfInformation.contentList.li4')}</BodyLong>
                    </li>
                    <li>
                        <BodyLong>{t('retrievalOfInformation.contentList.li5')}</BodyLong>
                    </li>
                </ul>

                <BodyLong>
                    <Link href={t('retrievalOfInformation.link1.href')}>{t('retrievalOfInformation.link1.text')}</Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t('retrievalOfInformation.link2.href')}>{t('retrievalOfInformation.link2.text')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('consent.title')}</Heading>

                <BodyLong>{t('consent.content')}</BodyLong>

                <ConfirmationPanel
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    label={t('consent.approval', { fornavn, etternavn })}
                    size="medium"
                />
            </FormGroup>

            <FormGroup>
                <Button size={'medium'} variant={'primary'} onClick={next} disabled={!consent}>
                    {t('startApplication')}
                </Button>
            </FormGroup>
        </div>
    )
}
