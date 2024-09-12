import { Spraak } from '../types/spraak.ts'
import { Dispatch, SetStateAction } from 'react'
import { Select } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../utils/api.ts'
import { Navigate } from 'react-router-dom'

export const SpraakVelger = ({
    valgtSpraak,
    setValgtSpraak,
}: {
    valgtSpraak: Spraak
    setValgtSpraak: Dispatch<SetStateAction<Spraak>>
}) => {
    const { data, error }: SWRResponse<never[], boolean, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams('sanityQuery=*[_type == "fellesKomponenterSchemaType"].spraakVelger')
    )

    if (error) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!data?.length && (
            <Select label={data[0]['label'][valgtSpraak]} onChange={(e) => setValgtSpraak(e.target.value as Spraak)}>
                <option value={Spraak.BOKMAAL}>Bokmål</option>
                <option value={Spraak.NYNORSK}>Nynorsk</option>
                <option value={Spraak.ENGELSK}>English</option>
            </Select>
        )
    )
}
