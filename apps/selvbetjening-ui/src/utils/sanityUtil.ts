import {PortableTextBlock, PortableTextSpan} from "@portabletext/types";

export type TextBlock = {
    style: TextStyle,
    href: string | undefined
    textElements: TextElement[]
    subBlocks: TextBlock[]
}

type TextStyle = 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'bullet' | 'number'

export type TextElement = {
    marks: SpanMarks[],
    text: string
}

type SpanMarks = 'strong' | 'link'


export const mapPortableTextBlock = (portableBlocks: PortableTextBlock[]) => {
    let textBlocks: TextBlock[] = []
    let subBlocks: TextBlock[] = []

    portableBlocks.forEach((block) => {
        const link = block.markDefs && block.markDefs.find((markDef) => markDef._type === "link")

        if (block?.listItem) {
            subBlocks.push({
                style: block.listItem,
                href: link && (link['href'] as string),
                textElements: mapPortableTextSpan(block.children, link?._key),
                subBlocks: []
            })
        } else {
            if (subBlocks.length > 0) {
                textBlocks.push({
                    style: subBlocks[0].style,
                    href: undefined,
                    textElements: [],
                    subBlocks: subBlocks
                })
                subBlocks = []
            }
            textBlocks.push({
                style: block.style as TextStyle,
                href: link && (link['href'] as string),
                textElements: mapPortableTextSpan(block.children, link?._key),
                subBlocks: []
            })
        }
    })

    if (subBlocks.length > 0) {
        textBlocks.push({
            style: subBlocks[0].style,
            href: undefined,
            textElements: [],
            subBlocks: subBlocks
        })
    }

    return textBlocks
}

const mapPortableTextSpan = (portableTextSpan: PortableTextSpan[], linkId?: string) => {
    return portableTextSpan.map((blockChild) => {
        return {
            marks: blockChild.marks.map((mark) => mark === linkId ? 'link' : mark),
            text: blockChild.text
        } as TextElement
    })
}
