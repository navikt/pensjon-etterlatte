import { HelptextFilled } from "@navikt/ds-icons";
import { PropsWithChildren, useRef, useState } from "react";
import { Popover } from "@navikt/ds-react";
import { v4 as uuid } from "uuid";
import { HvorforPanelButton } from "./StyledComponents";

const Hjelpetekst = ({ children }: PropsWithChildren<React.InputHTMLAttributes<HTMLInputElement>>) => {
    const [open, setOpen] = useState(false);

    const ref = useRef(null);
    const id = uuid();

    return (
        <>
            <HvorforPanelButton
                ref={ref}
                data-testid="hjelpetekst-button"
                variant={"secondary"}
                onClick={() => setOpen(!open)}
                type={"button"}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={id}
                style={{minWidth: "30px"}}
            >
                <HelptextFilled />
            </HvorforPanelButton>

            <Popover anchorEl={ref.current} open={open} placement={"top"} onClose={() => setOpen(false)}>
                {children}
            </Popover>
        </>
    );
};

export default Hjelpetekst;
