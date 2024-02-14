export const capitalize = (str: string): string => {
    const strList = str.split(' ')
    return strList
        .map((str) => {
            return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
        })
        .join(' ')
}
