//import React, { useState } from "react";
import { Language } from "../../hooks/useLanguage";
//import { BritiskFlagg, NorskFlagg } from "./Flagg";
import "./Dropdown.scss";
import { Select, SkjemaGruppe } from "nav-frontend-skjema";

export const Dropdown = (props: { onChange: any; value: string }) => {
    // const [open, setOpen] = useState(false);

    /*
    const toggle = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(!open);
    };

    const select = (e: any) => {
        props.onChange(e.target.dataset.value);
    };
    */
    const setLanguage = (e: any) => {
        props.onChange(e.target.value);
    };

    /*
    const spraak: any = {
        nb: (
            <>
                <NorskFlagg />
                Bokmål
            </>
        ),
        nn: (
            <>
                <NorskFlagg />
                Nynorsk
            </>
        ),
        en: (
            <>
                <BritiskFlagg />
                English
            </>
        ),
    };*/

    return (
        <>
            {/*
            <div
                className="dropdown"
                tabIndex={0}
                onClick={toggle}
                onKeyPress={toggle}
                aria-haspopup="listbox"
                aria-labelledby="listbox-lang-value"
            >
                <div id="listbox-lang-value" className="button">
                    {spraak[props.value]}
                </div>
                {open && (
                    <ul role="listbox">
                        <li
                            role="option"
                            onClick={select}
                            onKeyPress={select}
                            tabIndex={0}
                            data-value={Language.NORSK_BOKMAAL}
                        >
                            <NorskFlagg /> Bokmål
                        </li>
                        <li
                            role="option"
                            onClick={select}
                            onKeyPress={select}
                            tabIndex={0}
                            data-value={Language.NORSK_NYNORSK}
                        >
                            <NorskFlagg />
                            Nynorsk
                        </li>
                        <li
                            role="option"
                            onClick={select}
                            onKeyPress={select}
                            tabIndex={0}
                            data-value={Language.ENGELSK}
                        >
                            <BritiskFlagg />
                            English
                        </li>
                    </ul>
                )}
            </div>
                */}
            <SkjemaGruppe className="dropdown_alt2">
                <Select onChange={setLanguage} value={props.value} label="Velg språk">
                    <option value={Language.NORSK_BOKMAAL}>Bokmål</option>
                    <option value={Language.NORSK_NYNORSK}>Nynorsk</option>
                    <option value={Language.ENGELSK}>English</option>
                </Select>
            </SkjemaGruppe>
        </>
    );
};
