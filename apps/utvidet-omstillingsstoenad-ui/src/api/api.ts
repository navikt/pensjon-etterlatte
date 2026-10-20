import { isAxiosError } from 'axios'
import { FeatureToggleNavn } from '~context/featureToggle/FeatureToggleContext'
import { ISoeknad } from '~context/soknad/soknad'
import { axiosInstance as api, isDev } from './axios'

const GENERELL_FEIL = 'Det skjedde en feil'

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))

/**
 * Henter personalia for innlogget person
 */
export const hentInnloggetPerson = async () => {
    try {
        const response = await api.get('/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD')
        return response.data
    } catch {
        throw new Error(GENERELL_FEIL)
    }
}

/**
 * Henter info om bruker har søkt om oms før fra APIet basert på innlogget bruker sitt fnr.
 */
export const hentHarSoektOms = async () => {
    try {
        const response = await api.get('/api/api/sak/oms/har-loepende-sak')
        return response.data
    } catch {
        throw new Error(GENERELL_FEIL)
    }
}

/**
 * Henter søknad fra APIet basert på innlogget bruker sitt fnr.
 */
export const hentSoeknad = async () => {
    try {
        const response = await api.get('/api/api/kladd')
        const soeknad = response.data?.payload
        return soeknad ? JSON.parse(soeknad) : undefined
    } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) return undefined
        if (isAxiosError(e) && e.response?.status === 409) throw new Error('FERDIGSTILT')
        throw new Error(GENERELL_FEIL)
    }
}

export const slettSoeknad = async () => {
    try {
        const response = await api.delete('/api/api/kladd')
        return response.data
    } catch {
        throw new Error(GENERELL_FEIL)
    }
}

/**
 * Lagrer søknad via APIet på innlogget bruker sitt fnr.
 *
 * Skal gi Søknad ID i retur ved lagring ok
 */
export const lagreSoeknad = async (soeknad: ISoeknad) => {
    try {
        const response = await api.post('/api/api/kladd', { ...soeknad, klarForLagring: undefined })
        return response.data
    } catch {
        throw new Error(GENERELL_FEIL)
    }
}

export const lagreKladd = async (soeknad: ISoeknad): Promise<ISoeknad> => {
    const kladd = { ...soeknad, sistLagretDato: new Date(), error: null, visFortsettSoeknadModal: false }
    await lagreSoeknad(kladd)
    return { ...kladd, klarForLagring: false }
}

/**
 * Sender inn ferdigstilt søknad
 */
export const sendSoeknad = async <T>(request: T) => {
    try {
        const response = await api.post('/api/api/soeknad', request)
        return response.status
    } catch (e) {
        throw new Error(`${GENERELL_FEIL}: ${getErrorMessage(e)}`)
    }
}

export const hentFeatureToggles = async () => {
    try {
        const response = await api.post('/api/feature', Object.values(FeatureToggleNavn))
        return response.data
    } catch (e) {
        throw new Error(`${GENERELL_FEIL}: ${getErrorMessage(e)}`)
    }
}

// biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
export const loggFunc = async (data: any) => {
    if (isDev) {
        console.log(
            `Logging til pod er deaktivert for lokal kjøring, returnerer uten å logge dit. Meldinga var: ${JSON.stringify(data)}`
        )
        return
    }

    try {
        const response = await api.post('/api/logg', data)
        return response.status
    } catch (e) {
        throw new Error(`${GENERELL_FEIL}: ${getErrorMessage(e)}`)
    }
}
