import { Helptext, HelptextFilled } from "@navikt/ds-icons";
import { PropsWithChildren, useRef, useState } from "react";
import { Button, Popover } from "@navikt/ds-react";
import { v4 as uuid } from "uuid";

interface HjelpetekstProps {
    eventType?: "onHover" | "onClick";
}

const Hjelpetekst = ({eventType = "onClick", children }: PropsWithChildren<HjelpetekstProps & React.InputHTMLAttributes<HTMLInputElement>>) => {
    const [open, setOpen] = useState(false);

    const ref = useRef(null);
    const id = uuid();

    return (
        <>
            {eventType == "onHover" ?
                <span
                    style={{padding: '2px 2px 2px 5px'}}
                    ref={ref}
                    className={"hvorforPanel__toggle"}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-controls={id}
                >
                    <HelptextFilled
                        width={"1.5em"}
                        height={"1.5em"}
                    />
                </span>
                :
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
                    <Helptext/>
                </Button>}

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
