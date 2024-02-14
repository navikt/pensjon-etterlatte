export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

export const capitalizeName = (name: string, delim: string = ' '): string => {
    return name
        .split(delim)
        .map((str) => {
            if (str.includes('-')) return capitalizeName(str, '-')
            return capitalize(str)
        })
        .join(delim)
}
