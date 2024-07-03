import {PortableTextBlock, PortableTextSpan} from "@portabletext/types";

export type TextBlock = {
    style: TextStyle,
    href: string | undefined
    textElements: TextSpan[]
}

type TextStyle = 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'bullet' | 'number'

export type TextSpan = {
    marks: SpanMarks[],
    text: string
}

type SpanMarks = 'strong' | 'link'


export const mapPortableTextBlock = (portableBlocks: PortableTextBlock[]) => {
    let main: (TextBlock | TextBlock[])[] = []
    let tempList: (TextBlock | TextBlock[])[] = []

    portableBlocks.forEach((block) => {
        const link = block.markDefs && block.markDefs.find((markDef) => markDef._type === "link")
        if (block?.listItem) {
            tempList.push({
                style: block.listItem,
                href: link && link['href'],
                textElements: mapPortableTextSpan(block.children, link?._key)
            })
        } else {
            if (tempList.length > 0) {
                main.push(tempList)
                tempList = []
            }
            main.push({
                style: block.style,
                href: link && link['href'],
                textElements: mapPortableTextSpan(block.children, link?._key)
            })
        }
    })

    if (tempList.length > 0) {
        main.push(tempList)
    }

    return main
}

const mapPortableTextSpan = (portableTextSpan: PortableTextSpan[], linkId?: string) => {
    return portableTextSpan.map((blockChild) => {
        return {
            marks: blockChild.marks.map((mark) => mark === linkId ? 'link' : mark),
            text: blockChild.text
        }
    })
}
