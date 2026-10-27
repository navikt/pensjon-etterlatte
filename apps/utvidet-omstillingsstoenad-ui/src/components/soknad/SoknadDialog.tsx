import { BodyLong, FormProgress, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useParams } from 'react-router'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { useLanguage } from '../../hooks/useLanguage'
import { Inntekt as InntektSkjema } from '../../typer/skjema'
import { erStegPath, StegPath, steg, stegUrl } from '../../typer/steg'
import { klargjoerInntekt } from '../../utils/inntekt'
import SideIkkeFunnet from '../SideIkkeFunnet'
import Inntekt from './Inntekt'
import styles from './Inntekt.module.css'
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
    const neste = steg[index + 1]?.path
    const forrige = steg[index - 1]?.path ?? '/'
    const underArbeid = <BodyLong>{t('skjema.underArbeid')}</BodyLong>
    const skjemasteg: Partial<Record<StegPath, { innhold: ReactNode; className?: string }>> = {
        inntekt: {
            className: styles.side,
            innhold: (
                <SoeknadSteg<InntektSkjema>
                    key={path}
                    tittel={t('skjema.inntekt')}
                    sentrertTittel
                    tittelStorrelse="large"
                    shouldUnregister={false}
                    defaultValues={{
                        arbeidsinntekt: '',
                        naeringsinntekt: '0',
                        inntektFraUtland: '0',
                        ...state.skjema.inntekt,
                    }}
                    oppdaterSoeknad={(soeknad, data) => ({
                        ...soeknad,
                        aktivtSteg: 'inntekt',
                        skjema: { ...soeknad.skjema, inntekt: klargjoerInntekt(data) },
                    })}
                    neste={neste}
                    forrige={forrige}
                >
                    <Inntekt />
                </SoeknadSteg>
            ),
        },
    }

    return (
        <VStack gap="space-32" className={skjemasteg[path]?.className}>
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
            {skjemasteg[path]?.innhold ?? (
                <SoeknadSteg
                    key={path}
                    tittel={t(steg[index].label)}
                    defaultValues={{}}
                    oppdaterSoeknad={(soeknad) => ({ ...soeknad, aktivtSteg: path })}
                    neste={neste}
                    forrige={forrige}
                    sentrertTittel={path === 'personopplysninger'}
                >
                    <Routes>
                        <Route path="personopplysninger" element={<Personopplysninger />} />
                        <Route path="situasjonen-din" element={underArbeid} />
                        <Route path="utdanning-og-tiltak" element={underArbeid} />
                        <Route path="dokumentasjon" element={underArbeid} />
                        <Route path="oppsummering" element={underArbeid} />
                    </Routes>
                </SoeknadSteg>
            )}
        </VStack>
    )
}

export default SoknadDialog
