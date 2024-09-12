import { Spraak } from './spraak.ts'
import { useEffect, useState } from 'react'
import { Select } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'
import { Navigate } from 'react-router-dom'
import { hentSpraakFraLocalStorage, lagreSpraakILocalStorage } from './localStorage.ts'

export const SpraakVelger = () => {
    const [valgtSpraak, setValgtSpraak] = useState<Spraak>(hentSpraakFraLocalStorage())

    useEffect(() => {
        lagreSpraakILocalStorage(valgtSpraak)
    }, [valgtSpraak])

    const { data, error }: SWRResponse<never[], boolean, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams('sanityQuery=*[_type == "fellesKomponenter"].spraakVelger')
    )

    if (error) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!data?.length && (
            <Select
                label={data[0]['label'][valgtSpraak]}
                value={valgtSpraak}
                onChange={(e) => setValgtSpraak(e.target.value as Spraak)}
            >
                <option value={Spraak.BOKMAAL}>Bokmål</option>
                <option value={Spraak.NYNORSK}>Nynorsk</option>
                <option value={Spraak.ENGELSK}>English</option>
            </Select>
        )
    )
}
