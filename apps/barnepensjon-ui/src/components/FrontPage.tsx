import { BodyLong, Button, ConfirmationPanel, Heading } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionTypes } from '../context/application/application'
import { useApplicationContext } from '../context/application/ApplicationContext'
import { useUserContext } from '../context/user/UserContext'
import useTranslation from '../hooks/useTranslation'
import FormGroup from './common/FormGroup'
import NavGuide from './common/NavGuide'
import Trans from './common/Trans'
import { LogEvents, useAmplitude } from '../hooks/useAmplitude'
import LanguageSelect from './common/LanguageSelect'
import SanityClientConstructor from '@sanity/client'
import sanityClient from '@sanity/client'

export default function FrontPage() {
    const navigate = useNavigate()

    const { state: user } = useUserContext()
    const { state, dispatch } = useApplicationContext()

    const [consent, setConsent] = useState(state?.applicant?.consent || false)

    const { t } = useTranslation('frontPage')
    const { logEvent } = useAmplitude()

    const { fornavn, etternavn } = user

    const client = sanityClient({
        projectId: '57rxrfr3',
        dataset: 'production'
    })

    const [title, setTitle] = useState("")
    useEffect(() => {

        client.fetch(
            `*[_type == "frontpage"]`
        ).then( (data) => { 
            console.log(data)
            setTitle(data[0].metaDescription) })
    
    })
    
    function next() {
        dispatch({
            type: ActionTypes.UPDATE_APPLICANT,
            payload: { ...state.applicant, consent },
        })
        logEvent(LogEvents.START_APPLICATION)
        navigate('velg-scenarie')
    }

    return (
        <>
            <FormGroup>
                <NavGuide>{t('helloUser', { fornavn, etternavn })}</NavGuide>
            </FormGroup>

            <FormGroup>
                <LanguageSelect />
            </FormGroup>

            <FormGroup>
                <Heading spacing size={'large'}>
                    {title}
                </Heading>

                <BodyLong>
                    <Trans value={t('childMayBeApplicableForPension')} />
                    <ul>
                        <li>
                            <Trans value={t('childMayBeApplicableForPension_li1')} />
                        </li>
                        <li>
                            <Trans value={t('childMayBeApplicableForPension_li2')} />
                        </li>
                    </ul>
                    <Trans value={t('childOver18HasToApplyByThemself')} />
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('tax')}</Heading>

                <BodyLong>{t('aboutChildrensPensionTax')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('weWillRetrieveInfo')}</Heading>

                <BodyLong>{t('infoWeRetrieve')}</BodyLong>

                <ul>
                    <li>
                        <Trans value={t('infoWeRetrieve_li1')} />
                    </li>
                    <li>
                        <Trans value={t('infoWeRetrieve_li2')} />
                    </li>
                    <li>
                        <Trans value={t('infoWeRetrieve_li3')} />
                    </li>
                    <li>
                        <Trans value={t('infoWeRetrieve_li4')} />
                    </li>
                    <li>
                        <Trans value={t('infoWeRetrieve_li5')} />
                    </li>
                </ul>

                <BodyLong>
                    <Trans value={t('howWeHandleData')} />
                </BodyLong>

                <BodyLong>
                    <Trans value={t('aboutPrivacy')} />
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('aboutTheApplicationTitle')}</Heading>

                <BodyLong>{t('aboutTheApplicationDescription')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'small'}>{t('consentTitle')}</Heading>

                <BodyLong>{t('consentDescription')}</BodyLong>

                <ConfirmationPanel
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    label={t('consentToNav', { fornavn, etternavn })}
                    size="medium"
                />
            </FormGroup>

            <FormGroup>
                <Button size={'medium'} variant={'primary'} onClick={next} disabled={!consent}>
                    {t('startApplication')}
                </Button>
            </FormGroup>
        </>
    )
}
