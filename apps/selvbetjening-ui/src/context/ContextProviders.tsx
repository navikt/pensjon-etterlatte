import { FC } from "react";
import { SoknadProvider } from "./soknad/SoknadContext";
import { AvdodProvider } from "./avdod/AvdodContext";
import { ArbeidsforholdProvider } from "./arbeidsforhold/ArbeidsforholdContext";
import { StegProvider } from "./steg/StegContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <StegProvider>
            <SoknadProvider>
                <AvdodProvider>
                    <ArbeidsforholdProvider>{children}</ArbeidsforholdProvider>
                </AvdodProvider>
            </SoknadProvider>
        </StegProvider>
    );
};

export default ContextProviders;
