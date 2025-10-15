export const erMellomOktoberogDesember = (): boolean => {
    const idag = new Date()
    idag.setHours(12, 0, 0, 0)

    const sisteDagIDesember = new Date(idag.getFullYear(), 11, 31)
    sisteDagIDesember.setHours(23, 59, 59, 0)

    const foersteDagIOktober = new Date(idag.getFullYear(), 9, 1)

    return foersteDagIOktober <= idag && idag <= sisteDagIDesember
}
