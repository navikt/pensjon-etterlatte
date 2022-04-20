import { FC } from "react";
import { SoknadProvider } from "./soknad/SoknadContext";
import { BrukerProvider } from "./bruker/BrukerContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <SoknadProvider>
            <BrukerProvider>{children}</BrukerProvider>
        </SoknadProvider>
    );
};

export default ContextProviders;
