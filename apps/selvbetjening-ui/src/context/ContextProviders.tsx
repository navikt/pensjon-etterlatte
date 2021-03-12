import { FC } from "react";
import { SoknadProvider } from "./SoknadContext";
import { AvdodProvider } from "./AvdodContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <SoknadProvider>
            <AvdodProvider>{children}</AvdodProvider>
        </SoknadProvider>
    );
};

export default ContextProviders;
