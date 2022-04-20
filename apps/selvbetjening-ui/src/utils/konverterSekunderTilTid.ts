/**
 * Enkel funksjon for å konvertere sekunder til timer, minutter og sekunder
 */
export const konverterSekunderTilTid = (sekunder: number): { timer: number; minutter: number; sekunder: number } => {
    const timer = Math.floor(sekunder / 3600);
    const minutter = Math.floor((sekunder - timer * 3600) / 60);
    const gjenSek = Math.floor(sekunder - timer * 3600 - minutter * 60);

    return { timer, minutter, sekunder: gjenSek };
};
