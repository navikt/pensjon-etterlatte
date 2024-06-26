import { axiosInstance } from './axios'
import { lagreSoeknad, sendSoeknad } from './api'

vi.mock('./axios')

describe('Test sending av søknad', () => {
    it('Søknadsobjekt fylles ut korrekt', async () => {
        const soeknad = { soeknader: [] }

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
})
