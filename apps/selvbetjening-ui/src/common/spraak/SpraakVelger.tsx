import { Spraak } from './spraak.ts'
import { Select } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak, useSpraakDispatch } from './SpraakContext.tsx'

export const SpraakVelger = () => {
    const spraak = useSpraak()

    const spraakDispatch = useSpraakDispatch()

    const { data, error }: SWRResponse<never[], boolean, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams('sanityQuery=*[_type == "fellesKomponenter"].spraakVelger')
    )

    if (error) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!data?.length && (
            <Select
                label={data[0]['label'][spraak]}
                value={spraak}
                onChange={(e) => spraakDispatch.setSpraak(e.target.value as Spraak)}
            >
                <option value={Spraak.BOKMAAL}>Bokmål</option>
                <option value={Spraak.NYNORSK}>Nynorsk</option>
                <option value={Spraak.ENGELSK}>English</option>
            </Select>
        )
    )
}
