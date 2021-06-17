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
import { ISoeker, NySivilstatus } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import Feilmeldinger from "../../felles/Feilmeldinger";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import Panel from "nav-frontend-paneler";

const OpplysningerOmSokeren: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const brukerState = useBrukerContext().state;

    const lagre = (data: ISoeker) => {
        dispatch({ type: ActionTypes.OPPDATER_SOEKER, payload: data })
        neste!!()
    };

    const methods = useForm<ISoeker>({
        defaultValues: state.opplysningerOmSoekeren || {},
    });

    const {
        handleSubmit,
        watch,
        formState: { errors }
    } = methods;

    const skalSjekkeFlyktningStatus = brukerState.foedselsaar!! < 1960;

    const nySivilstatusEtterDoedsfallet = watch("nySivilstatus.nySivilstatusEtterDoedsfallet")
    const borPaaRegistrertAdresse = watch("bostedsadresseBekreftet")
    const oppholderSegINorge = watch("oppholderSegINorge")

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel className={"center"}>
                {t("omSoekeren.tittel")}
            </Systemtittel>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form>
                    <SkjemaGruppe>
                        <Panel border>
                            <RHFTelefonInput
                                name={"kontaktinfo.telefonnummer"}
                                label={t("felles.telefon")}
                                // rules={{pattern: /^\d+$/}}
                            />

                            {/* 2.5 */}
                            <RHFInput
                                name={"kontaktinfo.epost"}
                                label={t("felles.epost")}
                                // TODO: Validere e-post
                            />

                            {/* 2.8 */}
                            {/* TODO: Automatisk fylle inn kontonummer vi har, men gi bruker mulighet til å endre. */}
                            <SkjemaGruppe>
                                <RHFKontonummerInput
                                    name={"kontonummer"}
                                    label={t("omSoekeren.norskKontonummer")}
                                    rules={{pattern: /^\d{4}\.\d{2}\.\d{5}$/}}
                                />
                            </SkjemaGruppe>
                        </Panel>
                    </SkjemaGruppe>

                    {skalSjekkeFlyktningStatus && (
                        <RHFToValgRadio
                            name={"flyktning"}
                            legend={<>Har du status som flyktning? <i>(gjelder alle født før 1960)</i></>}
                        />
                    )}

                    <RHFToValgRadio
                        name={"bostedsadresseBekreftet"}
                        legend={t("omSoekeren.borPaaAdresse")}
                    />

                    {borPaaRegistrertAdresse === IValg.NEI && (
                        <AlertStripe type="advarsel">{t("omSoekeren.infoFolkeregisteret")}</AlertStripe>
                    )}

                    {/* 2.7 */}
                    <RHFToValgRadio
                        name={"oppholderSegINorge"}
                        legend={t("omSoekeren.oppholderSegINorge")}
                    />

                    {oppholderSegINorge === IValg.NEI && (
                        <SkjemaGruppe>
                            <RHFInput
                                name={"oppholdsland"}
                                label={t("omSoekeren.oppgiLand")}
                                rules={{pattern: /^[\w|\s]+$/}}
                            />

                            <RHFToValgRadio
                                name={"medlemFolketrygdenUtland"}
                                legend={t("omSoekeren.medlemFolketrygdenUtland")}
                            />
                        </SkjemaGruppe>
                    )}

                    {/* 2.9 */}
                    <ForholdAvdoedSkjema />

                    <br />

                    <NySivilstatusSkjema />

                    <br />

                    {nySivilstatusEtterDoedsfallet === NySivilstatus.samboerskap && (<SamboerSkjema />)}

                    <Feilmeldinger errors={errors} />

                    <SkjemaGruppe className={"navigasjon-rad"}>
                        <Knapp htmlType={"button"} onClick={forrige}>
                            {t("knapp.tilbake")}
                        </Knapp>

                        <Hovedknapp htmlType={"button"} onClick={handleSubmit(lagre)}>
                            {t("knapp.neste")}
                        </Hovedknapp>
                    </SkjemaGruppe>
                </form>
            </FormProvider>
        </>
    );
};

export default OpplysningerOmSokeren;
