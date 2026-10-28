import { Inntekt } from '../typer/skjema'

export const normaliserBeloep = (verdi: string) => verdi.replace(/\s/g, '')

export const erGyldigBeloep = (verdi: string) => /^\d+$/.test(normaliserBeloep(verdi))

export const klargjoerInntekt = (data: Inntekt): Inntekt => {
    const andre = data.andreInntekter
    const endring = data.noeSomKanPaavirkeInntekten
    return {
        arbeidsinntekt: normaliserBeloep(data.arbeidsinntekt),
        naeringsinntekt: normaliserBeloep(data.naeringsinntekt),
        inntektFraUtland: normaliserBeloep(data.inntektFraUtland),
        andreInntekter: {
            valg: andre?.valg,
            ...(andre?.valg === 'JA'
                ? {
                      inntekt: andre.inntekt === undefined ? undefined : normaliserBeloep(andre.inntekt),
                      beskrivelse: andre.beskrivelse,
                  }
                : {}),
        },
        noeSomKanPaavirkeInntekten: {
            valg: endring?.valg,
            ...(endring?.valg === 'JA'
                ? {
                      grunnTilPaavirkelseAvInntekt: endring.grunnTilPaavirkelseAvInntekt,
                      ...(endring.grunnTilPaavirkelseAvInntekt === 'ANNEN_GRUNN'
                          ? { beskrivelse: endring.beskrivelse }
                          : {}),
                  }
                : {}),
        },
    }
}
