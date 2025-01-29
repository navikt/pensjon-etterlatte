import { Select } from '@navikt/ds-react'
import { SpraakVelger as SpraakVelgerInnhold } from '../sanity.types.ts'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { useSpraak, useSpraakDispatch } from '../spraak/SpraakContext.tsx'
import { Spraak } from '../spraak/spraak.ts'

export const SpraakVelger = () => {
    const spraak = useSpraak()

    const spraakDispatch = useSpraakDispatch()

    const { innhold, error, isLoading } = useSanityInnhold<SpraakVelgerInnhold>('*[_type == "spraakVelger"]')

    if (error && !isLoading) {
        throw Error('Kunne ikke laste sanity innhold')
    }

    return (
        !!innhold && (
            <Select
                label={innhold.label?.[spraak]}
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
