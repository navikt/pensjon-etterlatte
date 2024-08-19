import { useEffect, useState } from 'react'
import { BodyShort, Heading, Link, List, Select } from '@navikt/ds-react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import styled from 'styled-components'
import { fetchSanity } from '../locales/Sanity.ts'

export enum Language {
    BOKMAAL = 'NB',
    NYNORSK = 'NN',
    ENGELSK = 'EN',
}

const components: PortableTextComponents = {
    marks: {
        p: ({ children }) => <BodyShort>{children}</BodyShort>,
        b: ({ children }) => (
            <BodyShort>
                <b>{children}</b>
            </BodyShort>
        ),
        em: ({ children }) => (
            <BodyShort>
                <em>{children}</em>
            </BodyShort>
        ),
        i: ({ children }) => (
            <BodyShort>
                <i>{children}</i>
            </BodyShort>
        ),
        u: ({ children }) => (
            <BodyShort>
                <u>{children}</u>
            </BodyShort>
        ),
        del: ({ children }) => (
            <BodyShort>
                <del>{children}</del>
            </BodyShort>
        ),
        a: ({ children, value }) => (
            <Link href={value.href} target="_blank" rel="noopener noreferrer">
                {children}
            </Link>
        ),
    },
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
        h4: ({ children }) => (
            <Heading size="small" level="4">
                {children}
            </Heading>
        ),
        h5: ({ children }) => (
            <Heading size="xsmall" level="5">
                {children}
            </Heading>
        ),
        h6: ({ children }) => <h6>{children}</h6>,
    },
    list: {
        bullet: ({ children }) => <List as="ul">{children}</List>,
        number: ({ children }) => <List as="ol">{children}</List>,
    },
    listItem: {
        bullet: ({ children }) => <List.Item>{children}</List.Item>,
        number: ({ children }) => <List.Item>{children}</List.Item>,
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
