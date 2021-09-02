import { Helptext } from "@navikt/ds-icons";
import { FC, useRef, useState } from "react";
import { Button, Popover } from "@navikt/ds-react";
import { v4 as uuid } from "uuid";

const Hjelpetekst: FC = ({ children }) => {
    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLButtonElement>(null);
    const id = uuid();

    return (
        <span>
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
                <Helptext />
            </Button>

            <Popover
                anchorEl={ref.current}
                open={open}
                placement={"top"}
                onClose={() => setOpen(false)}
            >
                {children}
            </Popover>
        </span>
    );
};

export default Hjelpetekst;
