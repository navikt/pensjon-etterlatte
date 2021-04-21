import { FC } from "react";
import { SoknadProvider } from "./soknad/SoknadContext";
import { StegProvider } from "./steg/StegContext";
import { BrukerProvider } from "./bruker/BrukerContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <StegProvider>
            <SoknadProvider>
                <BrukerProvider>{children}</BrukerProvider>
            </SoknadProvider>
        </StegProvider>
    );
};

export default ContextProviders;
