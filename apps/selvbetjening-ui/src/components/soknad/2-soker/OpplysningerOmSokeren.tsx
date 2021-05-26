import "./OpplysningerOmSokeren.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import InnloggetBruker from "./fragmenter/InnloggetBruker";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import IValg from "../../../typer/IValg";
import AlertStripe from "nav-frontend-alertstriper";
import ForholdAvdoedSkjema from "./fragmenter/ForholdAvdoedSkjema";
import NySivilstatusSkjema from "./fragmenter/NySivilstatusSkjema";
import SamboerSkjema from "./fragmenter/SamboerSkjema";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { ISoeker } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFInput from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import SoekerSchema from "./SoekerSchema";

const OpplysningerOmSokeren: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const lagre = (data: ISoeker) => {
        dispatch({ type: ActionTypes.OPPDATER_SOEKER, payload: data })
        neste!!()
    };

    const methods = useForm<ISoeker>({
        defaultValues: state.opplysningerOmSoekeren || {},
        resolver: yupResolver(SoekerSchema)
    });

    const {
        handleSubmit,
        watch,
    } = methods;

    const nySivilstatusEtterDoedsfallet = watch("nySivilstatus.nySivilstatusEtterDoedsfallet")
    const borPaaRegistrertAdresse = watch("bostedsadresseBekreftet")
    const oppholderSegINorge = watch("oppholderSegINorge")

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>{t("omSoekeren.tittel")}</Systemtittel>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form onSubmit={handleSubmit(lagre)}>
                    <RHFToValgRadio
                        name={"bostedsadresseBekreftet"}
                        legend={t("omSoekeren.borPaaAdresse")}
                    />

                    {borPaaRegistrertAdresse === IValg.NEI && (
                        <AlertStripe type="advarsel">{t("omSoekeren.infoFolkeregisteret")}</AlertStripe>
                    )}

                    <RHFInput
                        name={"kontaktinfo.telefonnummer"}
                        label={t("felles.telefon")}
                    />

                    {/* 2.5 */}
                    <RHFInput
                        name={"kontaktinfo.epost"}
                        label={t("felles.epost")}
                    />

                    {/* 2.7 */}
                    <RHFToValgRadio
                        name={"oppholderSegINorge"}
                        legend={t("omSoekeren.oppholderSegINorge")}
                    />

                    {oppholderSegINorge === IValg.NEI && (
                        <>
                            <RHFInput
                                name={"oppholdsland"}
                                label={t("omSoekeren.oppgiLand")}
                            />

                            <RHFToValgRadio
                                name={"medlemFolketrygdenUtland"}
                                legend={t("omSoekeren.medlemFolketrygdenUtland")}
                            />
                        </>
                    )}

                    {/* 2.8 */}
                    <RHFInput
                        name={"kontonummer"}
                        label={t("omSoekeren.norskKontonummer")}
                    />
                    {/* TODO: Automatisk fylle inn kontonummer vi har, men gi bruker mulighet til å endre. */}

                    {/* 2.9 */}
                    <ForholdAvdoedSkjema />

                    <br />

                    <NySivilstatusSkjema />

                    <br />

                    {nySivilstatusEtterDoedsfallet === "Samboerskap" && (<SamboerSkjema />)}

                    <SkjemaGruppe className={"navigasjon-rad"}>
                        <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>

                        <Hovedknapp htmlType={"submit"}>{t("knapp.neste")}</Hovedknapp>
                    </SkjemaGruppe>
                </form>
            </FormProvider>
        </>
    );
};

export default OpplysningerOmSokeren;
