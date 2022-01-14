import { ISoeknad } from "../../context/soknad/soknad";
import { Barnepensjon, Gjenlevendepensjon, SoeknadType } from "../dto/InnsendtSoeknad";
import { Barn, Innsender, PersonType } from "../dto/Person";
import { TFunction } from "i18next";
import { IBruker } from "../../context/bruker/bruker";
import { IBarn } from "../../typer/person";
import { IValg } from "../../typer/Spoersmaal";
import {
    hentForeldreMedUtvidetInfo,
    hentUtbetalingsInformasjonBarn,
    hentUtbetalingsInformasjonSoeker,
    mapBarn
} from "./fellesMapper";
import { mapGjenlevende } from "./gjenlevendeMapper";
import { mapAvdoed } from "./avdoedMapper";


export const mapTilGjenlevendepensjonSoeknad = (
    t: TFunction,
    soeknad: ISoeknad,
    bruker: IBruker
): Gjenlevendepensjon => {
    const barn: Barn[] = soeknad.opplysningerOmBarn.barn
        ?.map(barn => mapBarn(t, barn, soeknad, bruker)) || []

    return {
        type: SoeknadType.GJENLEVENDEPENSJON,
        spraak: bruker.spraak!!,

        harSamtykket: {
            spoersmaal: t("forside.samtykke.bekreftelse"),
            svar: soeknad.harSamtykket
        },

        innsender: {
            type: PersonType.INNSENDER,
            fornavn: bruker.fornavn!!,
            etternavn: bruker.etternavn!!,
            foedselsnummer: bruker.foedselsnummer!!
        },
        utbetalingsInformasjon: hentUtbetalingsInformasjonSoeker(t, soeknad.omDeg),
        soeker: mapGjenlevende(t, soeknad, bruker),
        avdoed: mapAvdoed(t, soeknad),
        barn
    }
};

export const mapTilBarnepensjonSoeknadListe = (
    t: TFunction,
    soeknad: ISoeknad,
    bruker: IBruker
): Barnepensjon[] => {
    return soeknad.opplysningerOmBarn.barn!!
        .filter(barnet => barnet.barnepensjon?.soeker === IValg.JA)
        .map(barnet => mapTilBarnepensjonSoeknad(t, barnet, soeknad, bruker))
};

const mapTilBarnepensjonSoeknad = (
    t: TFunction,
    soeker: IBarn,
    soeknad: ISoeknad,
    bruker: IBruker
): Barnepensjon => {
    const innsender: Innsender = {
        type: PersonType.INNSENDER,
        fornavn: bruker.fornavn!!,
        etternavn: bruker.etternavn!!,
        foedselsnummer: bruker.foedselsnummer!!
    };

    const soesken: Barn[] = soeknad.opplysningerOmBarn.barn!!
        .filter(barn => barn.foedselsnummer !== soeker.foedselsnummer)
        .map(barn => mapBarn(t, barn, soeknad, bruker))

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: bruker.spraak!!,

        innsender,
        harSamtykket: {
            spoersmaal: "",
            svar: soeknad.harSamtykket
        },
        utbetalingsInformasjon: hentUtbetalingsInformasjonBarn(t, soeker, soeknad),

        soeker: mapBarn(t, soeker, soeknad, bruker),
        foreldre: hentForeldreMedUtvidetInfo(t, soeker, soeknad, bruker),
        soesken
    }
};
