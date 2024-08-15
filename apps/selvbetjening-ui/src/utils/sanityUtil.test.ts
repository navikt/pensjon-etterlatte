import {PortableTextBlock} from "@portabletext/react";
import {TextBlock, mapPortableTextBlock} from "~utils/sanityUtil";
import {describe, expect, expectTypeOf, it} from 'vitest'

describe('RichText/PortableText from Sanity mapped to internal type', () => {
    const result = mapPortableTextBlock(json)

    it('Inneholder alle elementer', () => {
        expect(result.length).toEqual(11)
    })

    it('Heading 1', () => {
        const h1 = result[0]
        expectTypeOf(h1).toMatchTypeOf<TextBlock>()
        expect((h1 as TextBlock).style).toEqual("h1")
        expect((h1 as TextBlock).textElements[0].text).toEqual("Overskrift 1")
    })

    it('Heading 2', () => {
        const h2 = result[1]
        expectTypeOf(h2).toMatchTypeOf<TextBlock>()
        expect((h2 as TextBlock).style).toEqual("h2")
        expect((h2 as TextBlock).textElements[0].text).toEqual("Overskrift 2")
    })

    it('Punktliste', () => {
        const punktListe = result[2]
        expectTypeOf(punktListe).toMatchTypeOf<TextBlock[]>()

        const liEn = punktListe[0]
        expect(liEn.style).toEqual("bullet")
        expect(liEn.textElements[0].text).toEqual("En punktliste")

        const liTo = punktListe[1]
        expect(liTo.style).toEqual("bullet")
        expect(liTo.textElements[0].text).toEqual("To")

        const liTre = punktListe[2]
        expect(liTre.style).toEqual("bullet")
        expect(liTre.textElements[0].text).toEqual("Tre")
    })

    it('Nummerert liste', () => {
        const liste = result[5]
        expectTypeOf(liste).toMatchTypeOf<TextBlock[]>()

        const liEn = liste[0]
        expect(liEn.style).toEqual("number")
        expect(liEn.textElements[0].text).toEqual("En nummerert liste")

        const liTo = liste[1]
        expect(liTo.style).toEqual("number")
        expect(liTo.textElements[0].text).toEqual("To")

        const liTre = liste[2]
        expect(liTre.style).toEqual("number")
        expect(liTre.textElements[0].text).toEqual("Tre")
    })

    it('Tekst med bold', () => {
        const textBlock = result[3]
        expectTypeOf(textBlock).toMatchTypeOf<TextBlock>()
        expect((textBlock as TextBlock).style).toEqual("normal")
        expect((textBlock as TextBlock).textElements[0].text).toEqual("Tekst med ")

        expect((textBlock as TextBlock).textElements[1].marks[0]).toEqual("strong")
        expect((textBlock as TextBlock).textElements[1].text).toEqual("bold")
    })

    it('Lenker', () => {
        const textBlock = result[9]
        expectTypeOf(textBlock).toMatchTypeOf<TextBlock>()

        expect((textBlock as TextBlock).style).toEqual("normal")
        expect((textBlock as TextBlock).href).toEqual("http://localhost:3333/")

        expect((textBlock as TextBlock).textElements[0].text).toEqual("Lenketekst")
        expect((textBlock as TextBlock).textElements[0].marks[0]).toEqual("link")
    })


    it('Punktliste med innhold som bold og lenke', () => {
        const punktListe = result[10]
        expectTypeOf(punktListe).toMatchTypeOf<TextBlock[]>()

        const liEn = punktListe[0]
        expect(liEn.style).toEqual("bullet")
        expect(liEn.textElements[0].text).toEqual("Punktliste flere nivå")

        const liTo = punktListe[1]
        expect(liTo.style).toEqual("bullet")
        expect(liTo.textElements[0].text).toEqual("Nivå to")

        const liTre = punktListe[2]
        expect(liTre.style).toEqual("bullet")
        expect(liTre.textElements[0].text).toEqual("Tekst med ")
        expect(liTre.textElements[1].text).toEqual("bold i punktliste")
        expect(liTre.textElements[1].marks[0]).toEqual("strong")

        const liFire = punktListe[3]
        expect(liFire.style).toEqual("bullet")
        expect(liFire.textElements[0].text).toEqual("Tekst med ")
        expect(liFire.textElements[1].text).toEqual("lenke")
        expect(liFire.textElements[1].marks[0]).toEqual("link")
        expect(liFire.href).toEqual("http://localhost:3333/")
    })
})


const json: PortableTextBlock[] = [
    {
        "_key": "3bfe9aa680ea",
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Overskrift 1",
                "_key": "481cb68c940b"
            }
        ],
        "_type": "block",
        "style": "h1"
    },
    {
        "style": "h2",
        "_key": "b5686d85f3a2",
        "markDefs": [],
        "children": [
            {
                "text": "Overskrift 2",
                "_key": "55f1d2326d9d",
                "_type": "span",
                "marks": []
            }
        ],
        "_type": "block"
    },
    {
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "En punktliste",
                "_key": "e0e6e1869193"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "24b138243769",
        "listItem": "bullet",
        "markDefs": []
    },
    {
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "To",
                "_key": "97ae62aaf067"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "36476d0425f6",
        "listItem": "bullet",
        "markDefs": []
    },
    {
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "90ca423cc621",
        "listItem": "bullet",
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Tre",
                "_key": "936c1b88f421"
            }
        ]
    },
    {
        "_key": "082df1b04d28",
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Tekst med ",
                "_key": "5be6b3050509"
            },
            {
                "_type": "span",
                "marks": [
                    "strong"
                ],
                "text": "bold",
                "_key": "d971897d0320"
            }
        ],
        "_type": "block",
        "style": "normal"
    },
    {
        "markDefs": [],
        "children": [
            {
                "_key": "9128a5980c1e",
                "_type": "span",
                "marks": [],
                "text": "Overskrift 3"
            }
        ],
        "_type": "block",
        "style": "h2",
        "_key": "8c8155829dcb"
    },
    {
        "_key": "539f906932a3",
        "listItem": "number",
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "En nummerert liste",
                "_key": "ad7f7e04802b"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal"
    },
    {
        "_key": "50861435ad96",
        "listItem": "number",
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "To",
                "_key": "9072e6d521c6"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal"
    },
    {
        "listItem": "number",
        "markDefs": [],
        "children": [
            {
                "text": "Tre",
                "_key": "87e54ef7b3ad",
                "_type": "span",
                "marks": []
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "6347dc7658d1"
    },
    {
        "style": "normal",
        "_key": "9e7c412a4faa",
        "markDefs": [],
        "children": [
            {
                "_key": "50681e1fba33",
                "_type": "span",
                "marks": [
                    "em"
                ],
                "text": "Kursiv"
            }
        ],
        "_type": "block"
    },
    {
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Overskrift 4",
                "_key": "e30e1dda4ead"
            }
        ],
        "_type": "block",
        "style": "h3",
        "_key": "acbec07866bb",
        "markDefs": []
    },
    {
        "style": "normal",
        "_key": "83557eeb0eb2",
        "markDefs": [],
        "children": [
            {
                "_key": "f3f802f9686f",
                "_type": "span",
                "marks": [
                    "strike-through"
                ],
                "text": "Tekst med strek"
            }
        ],
        "_type": "block"
    },
    {
        "_key": "fa4a164d20bd",
        "markDefs": [
            {
                "_type": "link",
                "href": "http://localhost:3333/",
                "_key": "826826e3866d"
            }
        ],
        "children": [
            {
                "_type": "span",
                "marks": [
                    "826826e3866d"
                ],
                "text": "Lenketekst",
                "_key": "31a8d8ce7031"
            }
        ],
        "_type": "block",
        "style": "normal"
    },
    {
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Punktliste flere nivå",
                "_key": "955ab74db7fe"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "7b526ca5635d",
        "listItem": "bullet"
    },
    {
        "_type": "block",
        "style": "normal",
        "_key": "485d879bfe7f",
        "listItem": "bullet",
        "markDefs": [],
        "children": [
            {
                "marks": [],
                "text": "Nivå to",
                "_key": "ca556974e230",
                "_type": "span"
            }
        ],
        "level": 2
    },
    {
        "markDefs": [],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Tekst med ",
                "_key": "bee2a52e8033"
            },
            {
                "_type": "span",
                "marks": [
                    "strong"
                ],
                "text": "bold i punktliste",
                "_key": "135b79fb07a9"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "8bbbaf38279e",
        "listItem": "bullet"
    },
    {
        "listItem": "bullet",
        "markDefs": [
            {
                "href": "http://localhost:3333/",
                "_key": "5570ae48e7a1",
                "_type": "link"
            }
        ],
        "children": [
            {
                "_type": "span",
                "marks": [],
                "text": "Tekst med ",
                "_key": "8bd0d914aacf"
            },
            {
                "_type": "span",
                "marks": [
                    "5570ae48e7a1"
                ],
                "text": "lenke",
                "_key": "462df7fef0c4"
            }
        ],
        "level": 1,
        "_type": "block",
        "style": "normal",
        "_key": "cb448256092d"
    }
]