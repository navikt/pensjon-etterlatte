import { useEffect, useState } from 'react'
import { Heading, Select } from '@navikt/ds-react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import styled from 'styled-components'
import { fetchSanity } from '../locales/Sanity.ts'

export enum Language {
    BOKMAAL = 'NB',
    NYNORSK = 'NN',
    ENGELSK = 'EN',
}

const components: PortableTextComponents = {
    block: {
        h1: ({ children }) => (
            <Heading size="xlarge" level="1">
                {children}
            </Heading>
        ),
        h2: ({ children }) => (
            <Heading size="large" level="2">
                {children}
            </Heading>
        ),
        h3: ({ children }) => (
            <Heading size="medium" level="3">
                {children}
            </Heading>
        ),
    },
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
            <div>{text && <PortableText value={text} components={components} />}</div>
        </div>
    )
}

const SelectWrapper = styled.div`
    max-width: 200px;
    text-align: center;
    margin: 0 auto;
`
