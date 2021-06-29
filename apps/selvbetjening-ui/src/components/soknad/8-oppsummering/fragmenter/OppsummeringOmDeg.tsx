import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { ISoeker } from "../../../../typer/person";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";
import { useTranslation } from "react-i18next";
import TekstGruppe from "./TekstGruppe";
import { v4 as uuid } from "uuid";
import Lenke from "nav-frontend-lenker";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";

const OppsummeringOmDeg = ({ state }: { state: ISoeker }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n);

    const tekster = otr.traverse<ISoeker>(state, "omSoekeren")

    return (
        <Ekspanderbartpanel tittel={"Om deg"} className={"oppsummering"} apen={true}>
            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
            ))}

            {/*<TekstGruppe tittel={"Bor på folkeregistrert adresse?"} innhold={state.bostedsadresseBekreftet}/>

            <TekstGruppe tittel={"Telefonnummer"} innhold={state.kontaktinfo?.telefonnummer}/>

            <TekstGruppe tittel={"E-post"} innhold={state.kontaktinfo?.epost}/>

            <TekstGruppe tittel={"Kontonummer"} innhold={state.kontonummer}/>

            {!!state.flyktning && (
                <TekstGruppe tittel={"Registrert med flyktningsstatus"} innhold={state.flyktning}/>
            )}

            <TekstGruppe tittel={"Oppholder seg i Norge"} innhold={state.oppholderSegINorge}/>

            {state.oppholderSegINorge === IValg.NEI && (
                <>
                    <TekstGruppe tittel={"Oppholdsland"} innhold={state.oppholdsland}/>

                    <TekstGruppe tittel={"Medlem folketrygden"} innhold={state.medlemFolketrygdenUtland}/>
                </>
            )}

            <Ingress>Ditt forhold til den avdøde</Ingress>

            <Panel>
                <TekstGruppe tittel={"Forhold til avdød"} innhold={forholdTilAvdoed?.forholdTilAvdoede}/>

                <TekstGruppe tittel={"Dato for inngått partnerskap"}
                             innhold={forholdTilAvdoed?.datoForInngaattPartnerskap}/>

                {forholdTilAvdoed?.forholdTilAvdoede === ForholdTilAvdoed.gjenlevendeSamboer && (
                    <TekstGruppe tittel={t("omSoekeren.hattBarnEllerVaertGift")}
                                 innhold={forholdTilAvdoed?.hattBarnEllerVaertGift}/>
                )}

                <TekstGruppe tittel={t("omSoekeren.varSkiltFraAvdoede")}
                             innhold={forholdTilAvdoed?.varSkiltFoerDoedsfall}/>

                {forholdTilAvdoed?.varSkiltFoerDoedsfall?.svar === IValg.JA && (
                    <TekstGruppe tittel={t("omSoekeren.datoForSamlivsbrudd")}
                                 innhold={forholdTilAvdoed?.varSkiltFoerDoedsfall?.datoForSkilsmisse}/>
                )}

                <TekstGruppe tittel={t("omSoekeren.mottokBidragFraAvdoede")}
                             innhold={forholdTilAvdoed?.mottokBidragFraAvdoede}/>

                {forholdTilAvdoed?.mottokBidragFraAvdoede?.svar === IValg.JA && (
                    <TekstGruppe tittel={t("omSoekeren.bidragBeloep")} innhold={forholdTilAvdoed?.mottokBidragFraAvdoede?.bidragBeloepPrAar}/>
                )}
            </Panel>

            <Ingress>Om din sivilstatus</Ingress>

            <Panel>
                <TekstGruppe tittel={"Ny sivilstatus etter dødsfallet / skilsmissen / samlivsbruddet "}
                             innhold={nySivilstatus?.nySivilstatusEtterDoedsfallet}
                />
                {(!!nySivilstatus?.nySivilstatusEtterDoedsfallet && nySivilstatus.nySivilstatusEtterDoedsfallet !== NySivilstatus.ingen) && (
                    <>
                        <TekstGruppe tittel={t("omSoekeren.nyInngaaelse.dato")}
                                     innhold={nySivilstatus?.datoForInngaaelse?.toString()}/>
                        <TekstGruppe tittel={t("omSoekeren.nyInngaaelseOpploest")}
                                     innhold={nySivilstatus?.nySivilstatusOpploest}/>
                        <TekstGruppe tittel={t("omSoekeren.aarsakOpploesning.tittel")}
                                     innhold={nySivilstatus?.aarsakForOpploesningen}/>
                        <TekstGruppe tittel={t("omSoekeren.nyInngaaelseOpploestDato")}
                                     innhold={nySivilstatus?.datoForOpploesningen?.toString()}/>
                    </>
                )}
            </Panel>

            {(nySivilstatus?.nySivilstatusEtterDoedsfallet === NySivilstatus.samboerskap) && (
                <>
                    <Ingress>Samboer</Ingress>

                    <Panel>
                        <TekstGruppe tittel={t("omSoekeren.oppgiNavnSamboer")}
                                     innhold={samboer?.navn} />
                        <TekstGruppe tittel={t("felles.fnr")}
                                     innhold={samboer?.foedselsnummer}/>
                        <TekstGruppe tittel={t("omSoekeren.harHattBarnEllerVaertGiftMedSamboer")}
                                     innhold={samboer?.hattBarnEllerVaertGift}/>
                        <TekstGruppe tittel={t("omSoekeren.harSamboerInntekt.tittel")}
                                     innhold={samboer?.harInntekt?.svar}/>
                        <TekstGruppe tittel={t("omSoekeren.harSamboerInntekt.inntektstype")}
                                     innhold={samboer?.harInntekt?.inntektstype}/>
                        <TekstGruppe tittel={t("omSoekeren.harSamboerInntekt.bruttoinntekt")}
                                     innhold={samboer?.harInntekt?.samletBruttoinntektPrAar}/>
                    </Panel>
                </>
            )}*/}

            <Lenke href={`/soknad/steg/${StegPath.OmDeg}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
};

export default OppsummeringOmDeg;
