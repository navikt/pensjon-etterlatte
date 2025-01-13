import { Spraak } from '../../../common/spraak/spraak.ts'
import { Select } from '@navikt/ds-react'
import { Navigate } from 'react-router-dom'
import { useSpraak, useSpraakDispatch } from '../../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { FellesKomponenter } from '../../sanity.types.ts'

export const SpraakVelger = () => {
    const spraak = useSpraak()

    const spraakDispatch = useSpraakDispatch()

    const { innhold, error, isLoading } = useSanityInnhold<FellesKomponenter>('*[_type == "fellesKomponenter"]')

    if (error && !isLoading) {
        return <Navigate to="/inntekt/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <Select
                label={innhold.spraakVelger?.label?.[spraak]}
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
