import { Accordion } from "@navikt/ds-react";
import { useState } from "react";

export const AccordionItem = ({ tittel, children, defaultOpen = true }: any) => {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <Accordion.Item open={open}>
            <Accordion.Header onClick={() => setOpen(!open)} aria-expanded={open}>{tittel}</Accordion.Header>
            <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
    );
};
