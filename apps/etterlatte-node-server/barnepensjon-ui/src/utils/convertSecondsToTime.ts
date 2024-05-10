/**
 * Enkel funksjon for å konvertere sekunder til timer, minutter og sekunder
 */
export const convertSecondsToTime = (seconds: number): { hours: number; minutes: number; seconds: number } => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - hours * 3600) / 60)
    const remainingSeconds = Math.floor(seconds - hours * 3600 - minutes * 60)

    return { hours, minutes, seconds: remainingSeconds }
}
