import { FormProgress, Heading, VStack } from '@navikt/ds-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { erStegPath, steg, stegUrl } from '../../typer/steg'
import SideIkkeFunnet from '../SideIkkeFunnet'
import type { SoeknadStegContext } from './SoeknadSteg'

const SoknadDialog = () => {
    const { state } = useSoknadContext()
    const { t } = useTranslation()
    const pathname = useLocation().pathname
    const navigate = useNavigate()
    const path = pathname.match(/^\/skjema\/steg\/([^/]+)\/?$/)?.[1]
    const headingRef = useRef<HTMLHeadingElement>(null)
    const index = erStegPath(path) ? steg.findIndex((side) => side.path === path) : -1
    const lagretStegIndex = steg.findIndex((side) => side.path === state.aktivtSteg)
    const sisteStegIndex = steg.length - 1
    const lengstKommetSteg = Math.max(0, lagretStegIndex, index)

    useEffect(() => {
        headingRef.current?.focus()
    }, [path])

    if (!state.harSamtykket) return <Navigate replace to="/" />
    if (!path) return <Navigate replace to={stegUrl(state.aktivtSteg)} />
    if (!erStegPath(path)) return <SideIkkeFunnet />

    const alleStegKlikkbare = lengstKommetSteg >= sisteStegIndex
    const kanGaaTilSteg = (tilStegIndex: number) => alleStegKlikkbare || tilStegIndex <= lengstKommetSteg

    const stegContext: SoeknadStegContext = {
        path,
        tittel: t(steg[index].label),
        neste: steg[index + 1]?.path,
        forrige: steg[index - 1]?.path ?? '/',
    }

    return (
        <VStack gap="space-32">
            <Heading ref={headingRef} size="large" align="start" level="2" tabIndex={-1}>
                {stegContext.tittel}
            </Heading>
            <FormProgress
                data-testid="stegindikator"
                totalSteps={steg.length}
                activeStep={index + 1}
                interactiveSteps
                onStepChange={(stepNummer) => {
                    const tilStegIndex = stepNummer - 1
                    const tilSteg = steg[tilStegIndex]
                    if (!tilSteg || !kanGaaTilSteg(tilStegIndex)) return
                    navigate(stegUrl(tilSteg.path))
                }}
                translations={{
                    step: t('skjema.steg', { aktivt: index + 1, antall: steg.length }),
                    showAllSteps: t('skjema.visAlleSteg'),
                    hideAllSteps: t('skjema.skjulAlleSteg'),
                }}
            >
                {steg.map((side, sideIndex) => (
                    <FormProgress.Step key={side.path} interactive={kanGaaTilSteg(sideIndex)}>
                        {t(side.label)}
                    </FormProgress.Step>
                ))}
            </FormProgress>
            <Outlet context={stegContext} />
        </VStack>
    )
}

export default SoknadDialog
