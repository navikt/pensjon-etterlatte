import { FormProgress, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { useLanguage } from '../../hooks/useLanguage'
import { erStegPath, steg, stegUrl } from '../../typer/steg'
import SideIkkeFunnet from '../SideIkkeFunnet'
import type { SoeknadStegContext } from './SoeknadSteg'

const SoknadDialog = () => {
    useLanguage()
    const { state } = useSoknadContext()
    const { t } = useTranslation()
    const pathname = useLocation().pathname
    const path = pathname.match(/^\/skjema\/steg\/([^/]+)\/?$/)?.[1]

    if (!state.harSamtykket) return <Navigate replace to="/" />
    if (!path) return <Navigate replace to={stegUrl(state.aktivtSteg)} />
    if (!erStegPath(path)) return <SideIkkeFunnet />

    const index = steg.findIndex((side) => side.path === path)
    const stegContext: SoeknadStegContext = {
        path,
        tittel: t(steg[index].label),
        neste: steg[index + 1]?.path,
        forrige: steg[index - 1]?.path ?? '/',
    }

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
            <Outlet context={stegContext} />
        </VStack>
    )
}

export default SoknadDialog
