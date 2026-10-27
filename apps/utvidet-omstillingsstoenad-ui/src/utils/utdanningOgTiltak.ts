import { UtdanningOgTiltakKladd } from '~typer/skjema'

export const gyldigStudieprosent = (verdi: string | undefined): boolean =>
    !!verdi && /^\d+$/.test(verdi) && Number(verdi) >= 1 && Number(verdi) <= 100

export const rensUtdanningOgTiltak = (data: UtdanningOgTiltakKladd): UtdanningOgTiltakKladd => {
    if (data.aktivitet === 'UTDANNING') {
        const { studieprosent, ...utdanning } = data.utdanning ?? {}
        return {
            aktivitet: data.aktivitet,
            utdanning: {
                ...utdanning,
                ...(utdanning.studieform === 'DELTID' && studieprosent !== undefined ? { studieprosent } : {}),
            },
        }
    }
    if (data.aktivitet === 'ARBEIDSRETTET_TILTAK') {
        return {
            aktivitet: data.aktivitet,
            ...(data.arbeidsrettetTiltak ? { arbeidsrettetTiltak: data.arbeidsrettetTiltak } : {}),
            ...(data.aktivitetsplan ? { aktivitetsplan: data.aktivitetsplan } : {}),
        }
    }
    return data.aktivitet ? { aktivitet: data.aktivitet } : {}
}
