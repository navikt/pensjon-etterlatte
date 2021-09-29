import React, { useState } from "react";
import { Language } from "../../hooks/useLanguage";
import { BritiskFlagg, NorskFlagg } from "./Flagg";
import "./Dropdown.scss";

export const Dropdown = (props: { onChange: any; value: string }) => {
    const [open, setOpen] = useState(false);

    const toggle = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(!open);
    };

    const select = (e: any) => {
        props.onChange(e.target.dataset.value);
    };

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
    };

    return (
        <div className="dropdown" tabIndex={0} onClick={toggle} onKeyPress={toggle}>
            <div className="button">{spraak[props.value]}</div>
            {open && (
                <ul>
                    <li onClick={select} onKeyPress={select} tabIndex={0} data-value={Language.NORSK_BOKMAAL}>
                        <NorskFlagg /> Bokmål
                    </li>
                    <li onClick={select} onKeyPress={select} tabIndex={0} data-value={Language.NORSK_NYNORSK}>
                        <NorskFlagg />
                        Nynorsk
                    </li>
                    <li onClick={select} onKeyPress={select} tabIndex={0} data-value={Language.ENGELSK}>
                        <BritiskFlagg />
                        English
                    </li>
                </ul>
            )}
        </div>
    );
};
