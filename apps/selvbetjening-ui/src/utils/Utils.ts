
import { FieldError } from "react-hook-form";

const MAKS_ALDER = 67;
const MIN_ALDER = 18;

export const gyldigAlder = (alder: number): boolean => {
    return alder >= MIN_ALDER && alder <= MAKS_ALDER;
}

/**
 * Enkel funksjon for å fjerne firkantparentes fra error name
 */
export const getTransKey = (error?: FieldError): string => {
    if (!error) return "";

    const name = error.ref?.name?.replace(/\[\d]/, "")

    return `feil.${name}.${error.type}`
}
