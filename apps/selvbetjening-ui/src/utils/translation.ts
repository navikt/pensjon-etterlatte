import { FieldError } from "react-hook-form";

/**
 * Enkel funksjon for å fjerne firkantparentes fra error name
 */
export const getTransKey = (error?: FieldError): string => {
    if (!error) return "";

    const name = error.ref?.name?.replace(/\[\d]/, "");

    return `feil.${name}.${error.type}`;
};

/**
 * Enkel funksjon for å fjerne firkantparentes fra error name
 */
export const errorKey = (error?: FieldError, fieldIsArray = false): string => {
    if (!error) return "";

    const refName = error.ref?.name;

    if (fieldIsArray) {
        const name = refName?.replace(/\[\d]/, "");

        return `${name}.${error.type}`;
    }

    return `${refName}.${error.type}`;
};
