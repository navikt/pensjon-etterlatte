import { BodyLong, FormProgress, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { useLanguage } from '../../hooks/useLanguage'
import { erStegPath, steg, stegUrl } from '../../typer/steg'
import SideIkkeFunnet from '../SideIkkeFunnet'
import Personopplysninger from './Personopplysninger'
import { SoeknadSteg } from './SoeknadSteg'

const SoknadDialog = () => {
    useLanguage()
    const { state } = useSoknadContext()
    const { t } = useTranslation()
    const path = useParams()['*']

    if (!state.harSamtykket) return <Navigate replace to="/" />
    if (!path) return <Navigate replace to={stegUrl(state.aktivtSteg)} />
    if (!erStegPath(path)) return <SideIkkeFunnet />

    const index = steg.findIndex((side) => side.path === path)

    return (
        <VStack gap="space-32">
            <FormProgress
                totalSteps={steg.length}
                activeStep={index + 1}
                interactiveSteps={false}
                translations={{
                    step: t('skjema.steg', { aktivt: index + 1, antall: steg.length }),
                    showAllSteps: t('skjema.visAlleSteg'),
                    hideAllSteps: t('skjema.skjulAlleSteg'),
                }}
            >
                {steg.map((side) => (
                    <FormProgress.Step key={side.path}>{t(side.label)}</FormProgress.Step>
                ))}
            </FormProgress>
            <SoeknadSteg
                key={path}
                tittel={t(steg[index].label)}
                defaultValues={{}}
                oppdaterSoeknad={(soeknad) => ({ ...soeknad, aktivtSteg: path })}
                neste={steg[index + 1]?.path}
                forrige={steg[index - 1]?.path ?? '/'}
                sentrertTittel={path === 'personopplysninger'}
            >
                {path === 'personopplysninger' ? (
                    <Personopplysninger />
                ) : (
                    <BodyLong>{t('skjema.underArbeid')}</BodyLong>
                )}
            </SoeknadSteg>
        </VStack>
    )
}

export default SoknadDialog
