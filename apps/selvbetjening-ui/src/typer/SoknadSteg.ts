import { FC } from "react";

export default interface SoknadSteg
    extends FC<{
        neste?: () => any;
        forrige?: () => any;
    }> {}
