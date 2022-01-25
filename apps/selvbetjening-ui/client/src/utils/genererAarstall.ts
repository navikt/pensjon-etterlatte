export const genererAarstall = (startAar = 1900, sluttAar?: number) => {
    const sluttDato = sluttAar || new Date().getFullYear();
    const aar = [];
    for (let i = startAar; i <= sluttDato; i++) {
        aar.push(startAar);
        startAar++;
    }
    return aar;
};
