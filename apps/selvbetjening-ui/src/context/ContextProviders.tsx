import { FC } from "react";
import { SoknadProvider } from "./soknad/SoknadContext";
import { AvdodProvider } from "./avdod/AvdodContext";
import { AndreYtelserProvider } from "./andreytelser/AndreYtelserContext";
import { TidligereArbeidsforholdProvider } from "./tidligerearbeidsforhold/TidlArbeidsforholdContext";

const ContextProviders: FC = ({ children }) => {
    return (
        <SoknadProvider>
            <AvdodProvider>
                <AndreYtelserProvider>
                    <TidligereArbeidsforholdProvider>{children}</TidligereArbeidsforholdProvider>
                </AndreYtelserProvider>
            </AvdodProvider>
        </SoknadProvider>
    );
};

export default ContextProviders;
