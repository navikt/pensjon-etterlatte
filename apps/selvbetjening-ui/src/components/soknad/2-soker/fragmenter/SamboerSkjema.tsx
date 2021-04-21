import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ISamboer } from "../../../../typer/person";
import Sjekkboks from "../../../felles/Sjekkboks";
import TekstInput from "../../../felles/TekstInput";
import ToValgRadio from "../../../felles/ToValgRadio";
import { Undertittel } from "nav-frontend-typografi";
import { Panel } from "nav-frontend-paneler";

interface Props {
    samboer?: ISamboer;
    setSamboer: (samboer: ISamboer) => void;
}

const SamboerSkjema = ({ samboer, setSamboer }: Props) => {
    const { t } = useTranslation();

    return (
        <Panel border>
            <Undertittel>Opplysninger om samboer</Undertittel>

            <br />

            {/* 2.16 */}
            <TekstInput
                label={t("omSoekeren.oppgiNavnSamboer")}
                value={samboer?.navn}
                onChange={(navn) => setSamboer({ ...samboer, navn })}
            />

            <TekstInput
                label={t("felles.fnr")}
                value={samboer?.foedselsnummer}
                onChange={(foedselsnummer) => setSamboer({ ...samboer, foedselsnummer })}
            />

            <ToValgRadio
                label={t("omSoekeren.harHattBarnEllerVaertGiftMedSamboer")}
                checked={samboer?.hattBarnEllerVaertGift}
                onChange={(hattBarnEllerVaertGift) => setSamboer({ ...samboer, hattBarnEllerVaertGift })}
            />

            {/* 2.17 */}
            <ToValgRadio
                label={t("omSoekeren.harSamboerInntekt.tittel")}
                checked={samboer?.harInntekt}
                onChange={(harInntekt) => setSamboer({ ...samboer, harInntekt })}
            >
                <SkjemaGruppe className={"inputPanelGruppe"}>
                    <Sjekkboks
                        label={t("omSoekeren.harSamboerInntekt.arbeidsinntekt")}
                        checked={false}
                        onChange={() => {}}
                    />
                    <Sjekkboks label={t("omSoekeren.harSamboerInntekt.pensjon")} checked={false} onChange={() => {}} />
                    <Sjekkboks
                        label={t("omSoekeren.harSamboerInntekt.kapitalinntekt")}
                        checked={false}
                        onChange={() => {}}
                    />
                    <Sjekkboks
                        label={t("omSoekeren.harSamboerInntekt.andreYtelser")}
                        checked={false}
                        onChange={() => {}}
                    />
                </SkjemaGruppe>

                <TekstInput
                    label={t("omSoekeren.harSamboerInntekt.bruttoinntekt")}
                    value={samboer?.samletBruttoinntektPrAar}
                    onChange={(samletBruttoinntektPrAar) =>
                        setSamboer({
                            ...samboer,
                            samletBruttoinntektPrAar,
                        })
                    }
                />
            </ToValgRadio>
        </Panel>
    );
};

export default SamboerSkjema;
