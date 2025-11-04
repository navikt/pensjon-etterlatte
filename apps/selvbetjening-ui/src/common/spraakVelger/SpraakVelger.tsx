import { Select } from '@navikt/ds-react'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { SpraakVelger as SpraakVelgerInnhold } from '../sanity.types.ts'
import { useSpraak, useSpraakDispatch } from '../spraak/SpraakContext.tsx'
import { Spraak } from '../spraak/spraak.ts'

export const SpraakVelger = () => {
    const spraak = useSpraak()

    const spraakDispatch = useSpraakDispatch()

    const { innhold, innholdError, innholdIsLoading } =
        useSanityInnhold<SpraakVelgerInnhold>('*[_type == "spraakVelger"]')

    if (innholdError && !innholdIsLoading) {
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
