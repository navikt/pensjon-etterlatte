import { tomSoeknad } from '../context/soknad/soknad'
import { lagreKladd, lagreSoeknad, sendSoeknad } from './api'
import { axiosInstance } from './axios'

vi.mock('./axios')

describe('Test sending av søknad', () => {
    it('Søknadsobjekt fylles ut korrekt', async () => {
        const soeknad = { soeknad: { svar: [] } }

        const expectedResult = { status: 200 }
        axiosInstance.post.mockResolvedValue(expectedResult)

        const result = await sendSoeknad(soeknad)

        expect(axiosInstance.post).toHaveBeenCalledWith(`/api/api/soeknad`, { ...soeknad })

        expect(result).toBe(200)
    })
})

describe('Test lagring av søknad kladd', () => {
    it('Klar for lagring blir tilbakestilt', async () => {
        const soeknad = {
            harSamtykket: true,
            klarForLagring: true,
            visFortsettSoeknadModal: false,
        }

        const expectedResult = { data: { id: 1 } }
        axiosInstance.post.mockResolvedValue(expectedResult)

        const result = await lagreSoeknad(soeknad)

        expect(axiosInstance.post).toHaveBeenCalledWith(`/api/api/kladd`, {
            ...soeknad,
            klarForLagring: undefined,
        })

        expect(result).toBe(expectedResult.data)
    })

    it('Returnerer lagret kladd med tidspunkt uten å endre originalen', async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { id: 1 } })
        const resultat = await lagreKladd({ ...tomSoeknad, error: 'Gammel feil', visFortsettSoeknadModal: true })
        expect(resultat.sistLagretDato).toBeInstanceOf(Date)
        expect(resultat.error).toBeNull()
        expect(resultat.visFortsettSoeknadModal).toBe(false)
        expect(tomSoeknad.sistLagretDato).toBeUndefined()
    })

    it('Kaster feil hvis kladden ikke blir lagret', async () => {
        axiosInstance.post.mockRejectedValueOnce(new Error('nettverksfeil'))
        await expect(lagreKladd(tomSoeknad)).rejects.toThrow('Det skjedde en feil')
    })
})
