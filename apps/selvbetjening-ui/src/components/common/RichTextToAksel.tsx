import {PortableTextBlock} from "@portabletext/react";
import {mapPortableTextBlock, TextSpan, TextBlock} from "~utils/sanityUtil";
import {Heading, Link, List} from "@navikt/ds-react";
import React from "react";


export const AkeslPortableText = (richText: PortableTextBlock[]) => {
    const textBlocks = mapPortableTextBlock(richText)
    return (
        <div>
            {textBlocks.map(textBlock => {
                // TODO omstrukturere istedenfor å caste?
                if ('textElements' in textBlock) {
                    return TextBlockToAksel(textBlock)
                } else {
                    return ListBlockToAksel(textBlock)
                }
            })}
        </div>
    )
}

const TextBlockToAksel = (textBlock: TextBlock) => {
    switch (textBlock.style) {
        case 'h1':
            return <Heading size={"xlarge"}>{SpanToAksel(textBlock.textElements)}</Heading>
        case 'h2':
            return <Heading size={"large"}>{SpanToAksel(textBlock.textElements)}</Heading>
        case 'h3':
            return <Heading size={"medium"}>{SpanToAksel(textBlock.textElements)}</Heading>
        case 'h4':
            return <Heading size={"small"}>{SpanToAksel(textBlock.textElements)}</Heading>
        case 'h5':
            return <Heading size={"xsmall"}>{SpanToAksel(textBlock.textElements)}</Heading>
        case 'link':
            return <Link href={textBlock.href}>{SpanToAksel(textBlock.textElements)}</Link>
        default:
            return <p>{SpanToAksel(textBlock.textElements)}</p>

    }
}

const ListBlockToAksel = (textBlocks: TextBlock[]) => {
    const type = textBlocks[0].style
    const listElements = textBlocks.map(li => <List.Item>{SpanToAksel(li.textElements)}</List.Item>)

    if (type === 'number') {
        return <List as={'ol'}>{listElements}</List>
    }
    return <List as={'ul'}>{listElements}</List>

}

const SpanToAksel = (spanElements: TextSpan[]) => {
    return (
        spanElements.map((e) => {
            if (e.marks.includes('strong')) {
                return <strong>{e.text}</strong>
            }
            return e.text
        })
    )
}