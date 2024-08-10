export const formaterDatoStrengTilLocaleDateTime = (dato: string) =>
    new Date(dato).toISOString().replace('Z', '').replace('T', ' ')