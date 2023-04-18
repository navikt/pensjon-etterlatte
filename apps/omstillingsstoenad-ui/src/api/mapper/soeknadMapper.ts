import { ISoeknad } from '../../context/soknad/soknad'
import { Barnepensjon, Gjenlevendepensjon, SoeknadType } from '../dto/InnsendtSoeknad'
import { Barn, Innsender, PersonType } from '../dto/Person'
import { TFunction } from 'i18next'
import { IBruker } from '../../context/bruker/bruker'
import { IBarn } from '../../typer/person'
import {
    hentForeldreMedUtvidetInfo,
    hentUtbetalingsInformasjonBarn,
    hentUtbetalingsInformasjonSoeker,
    mapBarn,
} from './fellesMapper'
import { mapGjenlevende, mapStoenader } from './gjenlevendeMapper'
import { mapAvdoed } from './avdoedMapper'

export const mapTilGjenlevendepensjonSoeknad = (
    t: TFunction,
    soeknad: ISoeknad,
    bruker: IBruker
): Gjenlevendepensjon => {
    const barn: Barn[] = soeknad.opplysningerOmBarn.barn?.map((barn) => mapBarn(t, barn, soeknad, bruker)) || []

    const innsenderNavn = `${bruker.fornavn} ${bruker.etternavn}`

    return {
        type: SoeknadType.OMSTILLINGSSTOENAD,
        spraak: soeknad.spraak!!,

        harSamtykket: {
            spoersmaal: t('forside.samtykke.bekreftelse', { navn: innsenderNavn }),
            svar: soeknad.harSamtykket,
        },

        innsender: {
            type: PersonType.INNSENDER,
            fornavn: {
                spoersmaal: t('felles.fornavn'),
                svar: bruker.fornavn!!,
            },
            etternavn: {
                spoersmaal: t('felles.etternavn'),
                svar: bruker.etternavn!!,
            },
            foedselsnummer: {
                spoersmaal: t('felles.foedselsnummer'),
                svar: bruker.foedselsnummer!!,
            },
        },
        utbetalingsInformasjon: hentUtbetalingsInformasjonSoeker(t, soeknad.omDeg),
        soeker: mapGjenlevende(t, soeknad, bruker),
        avdoed: mapAvdoed(t, soeknad),
        barn,
        andreStoenader: mapStoenader(t, soeknad),
    }
}

export const mapTilBarnepensjonSoeknadListe = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Barnepensjon[] => {
    return soeknad.opplysningerOmBarn
        .barn!!.filter((barnet) => !!barnet.barnepensjon?.soeker)
        .map((barnet) => mapTilBarnepensjonSoeknad(t, barnet, soeknad, bruker))
}

const mapTilBarnepensjonSoeknad = (t: TFunction, soeker: IBarn, soeknad: ISoeknad, bruker: IBruker): Barnepensjon => {
    const innsender: Innsender = {
        type: PersonType.INNSENDER,
        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: bruker.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: bruker.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: bruker.foedselsnummer!!,
        },
    }

    const soesken: Barn[] = soeknad.opplysningerOmBarn
        .barn!!.filter((barn) => barn.foedselsnummer !== soeker.foedselsnummer)
        .map((barn) => mapBarn(t, barn, soeknad, bruker))

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: soeknad.spraak!!,

        innsender,
        harSamtykket: {
            spoersmaal: '',
            svar: soeknad.harSamtykket,
        },
        utbetalingsInformasjon: hentUtbetalingsInformasjonBarn(t, soeker, soeknad),

        soeker: mapBarn(t, soeker, soeknad, bruker),
        foreldre: hentForeldreMedUtvidetInfo(t, soeker, soeknad, bruker),
        soesken,
    }
}
