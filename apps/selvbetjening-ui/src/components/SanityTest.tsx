import { useEffect, useState } from 'react'
import { Select } from '@navikt/ds-react'
import styled from 'styled-components'
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
                <SelectWrapper>
                    <Select onChange={(e) => setLang(e.target.value as Language)} value={lang} label={'Velg språk'}>
                        <option value={Language.BOKMAAL}>Bokmål</option>
                        <option value={Language.NYNORSK}>Nynorsk</option>
                        <option value={Language.ENGELSK}>English</option>
                    </Select>
                </SelectWrapper>
            </div>
            <div>{text && <SanityRikTekst text={text} />}</div>
        </div>
    )
}

const SelectWrapper = styled.div`
    max-width: 200px;
    text-align: center;
    margin: 0 auto;
`
