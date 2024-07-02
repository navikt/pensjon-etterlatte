import {PortableTextBlock, PortableTextSpan } from "@portabletext/types";

export type TextBlock = {
    style: TextStyle,
    textElements: TextSpan[]
}

type TextStyle = 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'bullet' | 'number'

export type TextSpan = {
    marks: SpanMarks[],
    text: string
}

type SpanMarks = 'strong'



export const mapPortableTextBlock = (portableBlocks: PortableTextBlock[]) => {
    let main: (TextBlock | TextBlock[])[] = []
    let tempList: TextBlock[] = []

    portableBlocks.forEach((block) => {
        if (block?.listItem) {
            tempList.push({
                style: block.listItem,
                textElements: mapPortableTextSpan(block.children)
            })
        } else {
            if (tempList.length > 0) {
                main.push(tempList)
                tempList = []
            }
            main.push({
                style: block.style,
                textElements: mapPortableTextSpan(block.children)
            })
        }
    })
    return main
}

const mapPortableTextSpan = (portableTextSpan: PortableTextSpan[]) => {
    return portableTextSpan.map((blockChild) => {
        return {
            marks: blockChild.marks,
            text: blockChild.text
        }
    })
}
