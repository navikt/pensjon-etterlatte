import {useEffect, useState} from "react";
import {Heading, Select} from "@navikt/ds-react";
import {PortableText} from "@portabletext/react";
import styled from "styled-components";
import {fetchSanity} from "../locales/Sanity.ts";
import {AkeslPortableText} from "./common/RichTextToAksel.tsx";

export enum Language {
    BOKMAAL = 'NB',
    NYNORSK = 'NN',
    ENGELSK = 'EN',
}

export default function SanityTest() {
    const [text, setText] = useState(undefined)
    const [lang, setLang] = useState(Language.BOKMAAL)

    useEffect(() => {
        fetchSanity().then(res => {

            setText(res[0][lang])
        })
    }, [lang]);

    return (
        <div>
            <div>
                <SelectWrapper>
                    <Select onChange={(e) => setLang(e.target.value as Language)} value={lang} label={"Velg språk"}>
                        <option value={Language.BOKMAAL}>Bokmål</option>
                        <option value={Language.NYNORSK}>Nynorsk</option>
                        <option value={Language.ENGELSK}>English</option>
                    </Select>
                </SelectWrapper>
            </div>
            <div>
                asdf
                <h1>Selvbetjening</h1>
                {text && <PortableText value={text}/>}
                <br/><br/>---<br/><br/>
                {text && AkeslPortableText(text)}
                <Heading size={"large"}>Veiledning</Heading>
            </div>
        </div>
    )

}


const SelectWrapper = styled.div`
    max-width: 200px;
    text-align: center;
    margin: 0 auto;
`