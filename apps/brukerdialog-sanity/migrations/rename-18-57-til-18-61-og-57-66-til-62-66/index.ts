import { defineMigration, at, unset, set } from 'sanity/migrate'

const from = 'inntektSkjemaer.attenTilFemtiSeksAar'
const to = 'inntektSkjemaer.attenTilSekstiEnAar'

export default defineMigration({
    title: 'Rename 18-57 til 18-61 og 57-66 til 62-66',
    migrate: {
        document(doc) {
            return [at(to, set(from)), at(from, unset())]
        },
    },
})
