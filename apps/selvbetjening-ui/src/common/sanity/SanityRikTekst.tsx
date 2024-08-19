import { PortableText, PortableTextComponents } from '@portabletext/react'
import { BodyShort, Heading, Link, List } from '@navikt/ds-react'

const portableTextTilAkselKomponenter: PortableTextComponents = {
    marks: {
        em: ({ children }) => (
            <BodyShort>
                <em>{children}</em>
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

export const SanityRikTekst = ({ text }: { text: never[] }) => {
    return <PortableText value={text} components={portableTextTilAkselKomponenter} />
}
