// biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
export const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj))
