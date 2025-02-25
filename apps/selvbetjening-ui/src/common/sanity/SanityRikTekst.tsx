import { Heading, Link, List } from '@navikt/ds-react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { EventType, LogEvents, useAmplitude } from '../amplitude/useAmplitude.ts'

interface PortableTextBlock {
    children?: Array<{
        marks?: Array<string>
        text?: string
        _type: 'span'
        _key: string
    }>
    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
        href?: string
        _type: 'link'
        _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
}

export const SanityRikTekst = ({ text }: { text: Array<PortableTextBlock> | undefined }) => {
    const { logEvent } = useAmplitude()

    const portableTextTilAkselKomponenter: PortableTextComponents = {
        marks: {
            a: ({ children, value }) => (
                <Link
                    href={value.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logEvent(LogEvents.KLIKK, { type: EventType.LENKE_KLIKK, href: value.href })}
                >
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

    return !!text && <PortableText value={text} components={portableTextTilAkselKomponenter} />
}
