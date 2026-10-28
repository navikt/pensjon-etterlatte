import { BodyLong, Page } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import { GlobalErrorAlert } from '~components/felles/globalErrorAlert/GlobalErrorAlert'
import { SideLaster } from '~components/felles/SideLaster'
import { SkjemaTittel } from '~components/felles/SkjemaTittel'
import SystemUtilgjengelig from './components/felles/systemUtilgjengelig/SystemUtilgjengelig'
import SideIkkeFunnet from './components/SideIkkeFunnet'
import { FortsettSoeknadModal } from './components/soknad/FortsettSoeknadModal'
import { InntektSteg } from './components/soknad/inntekt/Inntekt'
import Personopplysninger from './components/soknad/Personopplysninger'
import { SoeknadStegRute } from './components/soknad/SoeknadSteg'
import SoknadDialog from './components/soknad/SoknadDialog'
import SoknadForside from './components/soknad/SoknadForside'
import SoknadKvittering from './components/soknad/SoknadKvittering'
import { SituasjonenDinSteg } from './components/soknad/situasjonenDin/SituasjonenDin'
import { UtdanningOgTiltakSteg } from './components/soknad/utdanningOgTiltak/UtdanningOgTiltak'
import UgyldigSoeker from './components/UgyldigSoeker'
import { useSoknadContext } from './context/soknad/SoknadContext'
import { useAnalytics } from './hooks/useAnalytics'
import useInnloggetBruker from './hooks/useInnloggetBruker'
import useSoeknad from './hooks/useSoeknad'
import { steg } from './typer/steg'

const UnderArbeid = () => {
    const { t } = useTranslation()
    return <BodyLong>{t('skjema.underArbeid')}</BodyLong>
}

const App = () => {
    useInnloggetBruker()
    useAnalytics()
    const { state } = useSoknadContext()
    const lasterSoeknad = useSoeknad()

    return (
        <>
            <SkjemaTittel />

            {lasterSoeknad ? (
                <SideLaster />
            ) : (
                <>
                    <FortsettSoeknadModal />

                    <Page>
                        <Page.Block className="soeknad-page-block" role="main" width="xl">
                            <Routes>
                                <Route index path={'/'} element={<SoknadForside />} />

                                <Route path={'skjema'} element={<Outlet />}>
                                    <Route path={'steg'} element={<SoknadDialog />}>
                                        <Route
                                            path={'personopplysninger'}
                                            element={
                                                <SoeknadStegRute>
                                                    <Personopplysninger />
                                                </SoeknadStegRute>
                                            }
                                        />
                                        <Route path={'situasjonen-din'} element={<SituasjonenDinSteg />} />
                                        <Route path={'utdanning-og-tiltak'} element={<UtdanningOgTiltakSteg />} />
                                        <Route path={'inntekt'} element={<InntektSteg />} />
                                        {steg.slice(4).map((side) => (
                                            <Route
                                                key={side.path}
                                                path={side.path}
                                                element={
                                                    <SoeknadStegRute>
                                                        <UnderArbeid />
                                                    </SoeknadStegRute>
                                                }
                                            />
                                        ))}
                                    </Route>
                                </Route>

                                <Route path={'/skjema/sendt'} element={<SoknadKvittering />} />

                                <Route path={'/ugyldig-alder'} element={<UgyldigSoeker />} />

                                <Route path={'/system-utilgjengelig'} element={<SystemUtilgjengelig />} />

                                <Route path={'/labs'} element={<Navigate replace to="/skjema/admin" />} />

                                <Route path={'*'} element={<SideIkkeFunnet />} />
                            </Routes>
                            {state.error && <GlobalErrorAlert message={state.error} />}
                        </Page.Block>
                    </Page>
                </>
            )}
        </>
    )
}

export default App
