import {PortableTextBlock} from "@portabletext/react";
import {mapPortableTextBlock, TextSpan, TextBlock} from "~utils/sanityUtil";


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
            return <h1>{SpanToAksel(textBlock.textElements)}</h1>
        case 'h2':
            return <h2>{SpanToAksel(textBlock.textElements)}</h2>
        case 'h3':
            return <h3>{SpanToAksel(textBlock.textElements)}</h3>
        case 'h4':
            return <h4>{SpanToAksel(textBlock.textElements)}</h4>
        default:
            return <p>{SpanToAksel(textBlock.textElements)}</p>

    }
}

const ListBlockToAksel = (textBlocks: TextBlock[]) => {
    const type = textBlocks[0].style
    const listElements = textBlocks.map(li => <li>{SpanToAksel(li.textElements)}</li>)

    if (type === 'number') {
        return <ol>{listElements}</ol>
    }
    return <ul>{listElements}</ul>

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