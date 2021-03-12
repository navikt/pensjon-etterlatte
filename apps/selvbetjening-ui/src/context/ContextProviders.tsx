import { FC } from "react";
import { SoknadProvider } from "./soknad/SoknadContext";
import { AvdodProvider } from "./avdod/AvdodContext";
import { AndreYtelserProvider } from "./andreytelser/AndreYtelserContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <SoknadProvider>
            <AvdodProvider>
                <AndreYtelserProvider>{children}</AndreYtelserProvider>
            </AvdodProvider>
        </SoknadProvider>
    );
};

export default ContextProviders;
