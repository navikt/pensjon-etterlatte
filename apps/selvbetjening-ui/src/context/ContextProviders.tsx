import { FC } from "react";
import { SoknadProvider } from "./soknad/SoknadContext";
import { StegProvider } from "./steg/StegContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <StegProvider>
            <SoknadProvider>{children}</SoknadProvider>
        </StegProvider>
    );
};

export default ContextProviders;
