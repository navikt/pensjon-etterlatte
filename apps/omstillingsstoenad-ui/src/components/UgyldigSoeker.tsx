import { BodyLong, Box, Button, GuidePanel, HStack, Link } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useBrukerContext } from '../context/bruker/BrukerContext'
import { ActionTypes } from '../context/bruker/bruker'

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
            <Box marginBlock="0 12">
                <GuidePanel poster>{t('ugyldigSoeker.kanIkkeSoeke.gjenlevendeEllerBarnepensjon')}</GuidePanel>
            </Box>

            <Box marginBlock="0 12">
                <BodyLong>{t('ugyldigSoeker.info.gjenlevendeEllerBarnepensjon')}</BodyLong>
            </Box>

            <Box marginBlock="0 12">
                <BodyLong>
                    <Link href={t('ugyldigSoeker.infolenker.barnepensjon.href')}>
                        {t('ugyldigSoeker.infolenker.barnepensjon.tekst')}
                    </Link>
                </BodyLong>
            </Box>

            <HStack marginBlock="0 18" justify="center">
                <Button variant={'primary'} onClick={tilbake}>
                    {t('knapp.tilbake')}
                </Button>
            </HStack>
        </>
    )
}

export default UgyldigSoeker
