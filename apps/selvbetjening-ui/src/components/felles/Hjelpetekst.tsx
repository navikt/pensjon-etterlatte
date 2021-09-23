import { HelptextFilled } from "@navikt/ds-icons";
import { PropsWithChildren, useRef, useState } from "react";
import { Button, Popover } from "@navikt/ds-react";
import { v4 as uuid } from "uuid";


const Hjelpetekst = (
    { children }: PropsWithChildren<React.InputHTMLAttributes<HTMLInputElement>>) => {
    const [open, setOpen] = useState(false);

    const ref = useRef(null);
    const id = uuid();

    return (
        <>
            <Button
                ref={ref}
                variant={"secondary"}
                className={"hvorforPanel__toggle"}
                onClick={() => setOpen(!open)}
                type={"button"}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={id}
            >
                <HelptextFilled/>
            </Button>

            <Popover
                anchorEl={ref.current}
                open={open}
                placement={"top"}
                onClose={() => setOpen(false)}
            >
                {children}
            </Popover>
        </>
    );
};

export default Hjelpetekst;
