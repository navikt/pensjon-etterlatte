import {PortableTextBlock} from "@portabletext/react";
import {Heading, Link, List} from "@navikt/ds-react";
import React from "react";
import {mapPortableTextBlock, TextBlock} from "../../utils/sanityUtil.ts";


export const AkeslPortableText = (richText: PortableTextBlock[]) => {
    const textBlocks = mapPortableTextBlock(richText)
    return (
        <div>
            {textBlocks.map(textBlock => {
                // TODO omstrukturere istedenfor å caste?

                if (textBlock.subBlocks.length === 0) {
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
            return <Heading size={"xlarge"}>{SpanToAksel(textBlock)}</Heading>
        case 'h2':
            return <Heading size={"large"}>{SpanToAksel(textBlock)}</Heading>
        case 'h3':
            return <Heading size={"medium"}>{SpanToAksel(textBlock)}</Heading>
        case 'h4':
            return <Heading size={"small"}>{SpanToAksel(textBlock)}</Heading>
        case 'h5':
            return <Heading size={"xsmall"}>{SpanToAksel(textBlock)}</Heading>
        default:
            return <p>{SpanToAksel(textBlock)}</p>

    }
}

const ListBlockToAksel = (textBlock: TextBlock) => {
    //const type = textBlock.subBlocks[0].style
    const listElements = textBlock.subBlocks.map(li => <List.Item>{SpanToAksel(li)}</List.Item>)

    if (textBlock.style === 'number') {
        return <List as={'ol'}>{listElements}</List>
    }
    return <List as={'ul'}>{listElements}</List>

}

const SpanToAksel = (block: TextBlock) => {
    const spanElements = block.textElements
    return (
        spanElements.map((e) => {
            if (e.marks.includes('link')) {
                return <Link href={block.href}>{e.text}</Link>
            }
            if (e.marks.includes('strong')) {
                return <strong>{e.text}</strong>
            }
            return e.text
        })
    )
}