import { useState } from 'react'
import { Select, VStack } from '@navikt/ds-react'
import { SanityRikTekst } from '../common/sanity/SanityRikTekst.tsx'
import useSWR, { SWRResponse } from 'swr'

export enum Language {
    BOKMAAL = 'NB',
    NYNORSK = 'NN',
    ENGELSK = 'EN',
}

export default function SanityTest() {
    const [lang, setLang] = useState(Language.BOKMAAL)

    const { data }: SWRResponse<never[], boolean, boolean> = useSWR('/selvbetjening/sanity')

    return (
        <div>
            <div>
                <VStack gap="4" maxWidth="20rem" justify="center">
                    <Select onChange={(e) => setLang(e.target.value as Language)} value={lang} label={'Velg språk'}>
                        <option value={Language.BOKMAAL}>Bokmål</option>
                        <option value={Language.NYNORSK}>Nynorsk</option>
                        <option value={Language.ENGELSK}>English</option>
                    </Select>
                    <div>{!!data?.length && <SanityRikTekst text={data[0][lang]} />}</div>
                </VStack>
            </div>
        </div>
    )
}
