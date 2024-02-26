import { useBrukerContext } from '../context/bruker/BrukerContext'
import { Veileder } from './felles/Veileder'
import { SkjemaGruppe } from './felles/SkjemaGruppe'
import { ActionTypes } from '../context/bruker/bruker'
import { useNavigate } from 'react-router-dom'
import { BodyLong, Button, Link } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigasjonsRadSection } from './felles/StyledComponents'

const UgyldigSoeker = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { state, dispatch } = useBrukerContext()

    useEffect(() => {
        if (state.kanSoeke) {
            navigate('/')
        }
    }, [state.kanSoeke])

    const tilbake = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL })

        window.location.href =
            'https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle'
    }

    return (
        <>
            <SkjemaGruppe>
                <Veileder>{t('ugyldigSoeker.kanIkkeSoeke.gjenlevendeEllerBarnepensjon')}</Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>{t('ugyldigSoeker.info.gjenlevendeEllerBarnepensjon')}</BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    <Link href={t('ugyldigSoeker.infolenker.barnepensjon.href')}>
                        {t('ugyldigSoeker.infolenker.barnepensjon.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <NavigasjonsRadSection>
                    <Button variant={'primary'} onClick={tilbake}>
                        {t('knapp.tilbake')}
                    </Button>
                </NavigasjonsRadSection>
            </SkjemaGruppe>
        </>
    )
}

export default UgyldigSoeker
