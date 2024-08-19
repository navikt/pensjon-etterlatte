import { useEffect, useState } from 'react'
import { Select, VStack } from '@navikt/ds-react'
import { fetchSanity } from '../locales/Sanity.ts'
import { SanityRikTekst } from '../common/sanity/SanityRikTekst.tsx'

export enum Language {
    BOKMAAL = 'NB',
    NYNORSK = 'NN',
    ENGELSK = 'EN',
}

export default function SanityTest() {
    const [text, setText] = useState(undefined)
    const [lang, setLang] = useState(Language.BOKMAAL)

    useEffect(() => {
        fetchSanity().then((res) => {
            console.log(res)
            setText(res[0][lang])
        })
    }, [lang])

    return (
        <div>
            <div>
                <VStack gap="4" maxWidth="20rem" justify="center">
                    <Select onChange={(e) => setLang(e.target.value as Language)} value={lang} label={'Velg språk'}>
                        <option value={Language.BOKMAAL}>Bokmål</option>
                        <option value={Language.NYNORSK}>Nynorsk</option>
                        <option value={Language.ENGELSK}>English</option>
                    </Select>
                    <div>{text && <SanityRikTekst text={text} />}</div>
                </VStack>
            </div>
        </div>
    )
}
