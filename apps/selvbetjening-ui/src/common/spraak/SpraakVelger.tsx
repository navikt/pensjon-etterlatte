import { Spraak } from './spraak.ts'
import { Select } from '@navikt/ds-react'
import { Navigate } from 'react-router-dom'
import { useSpraak, useSpraakDispatch } from './SpraakContext.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'

export const SpraakVelger = () => {
    const spraak = useSpraak()

    const spraakDispatch = useSpraakDispatch()

    const { innhold, error, isLoading } = useSanityInnhold<never>('*[_type == "fellesKomponenter"].spraakVelger')

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <Select
                label={innhold['label'][spraak]}
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
