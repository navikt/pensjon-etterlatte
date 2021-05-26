import { date, mixed, object, SchemaOf, string } from "yup";
import { ISoeker, NySivilstatus, OpploesningAarsak } from "../../../typer/person";
import IValg from "../../../typer/IValg";

/**
 * STEG 2: Opplysninger om søkeren
 */
const SoekerSchema: SchemaOf<ISoeker> = object().shape({
    bostedsadresseBekreftet: mixed<IValg>().required(),
    kontaktinfo: object().shape({
        telefonnummer: string().matches(/^\d+$/).required(),
        epost: string().email().required(),
    }),
    kontonummer: string().matches(/^\d+$/).min(11).max(11).required(),
    oppholderSegINorge: mixed<IValg>().required(),
    oppholdsland: string(),
    medlemFolketrygdenUtland: mixed<IValg>(),
    forholdTilAvdoed: object().shape({
        forholdTilAvdoede: string().required(),
        datoForInngaattPartnerskap: date().required() ,
        varSkiltFoerDoedsfall: mixed<IValg>().required(),
        datoForSkilsmisse: date(),
        mottokBidragFraAvdoede: mixed<IValg>().required(),
        bidragBeloepPrAar: string(),
        hattBarnEllerVaertGift: mixed<IValg>(),
    }),
    nySivilstatus: object().shape({
        nySivilstatusEtterDoedsfallet: mixed<NySivilstatus>().required(),
        datoForInngaaelse: date(),
        nySivilstatusOpploest: mixed<IValg>(),
        aarsakForOpploesningen: mixed<OpploesningAarsak>(),
        datoForOpploesningen: date(),
    }),
    samboer: object().shape({
        erSamboer: mixed<IValg>(),
        navn: string(),
        foedselsnummer: string(),
        hattBarnEllerVaertGift: mixed<IValg>(),
        harInntekt: mixed<IValg>(),
        inntektstype: mixed<string[]>(),
        samletBruttoinntektPrAar: string(),
    })
})

export default SoekerSchema;
