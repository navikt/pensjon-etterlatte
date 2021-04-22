import TekstInput from "../../../felles/TekstInput";
import { IKontaktinfo } from "../../../../typer/person";
import { useTranslation } from "react-i18next";

interface Props {
    kontaktinfo?: IKontaktinfo;
    setKontaktinfo: (kontaktinfo: IKontaktinfo) => void;
}

const KontaktinfoSkjema = ({ kontaktinfo, setKontaktinfo }: Props) => {
    const { t } = useTranslation();

    return (
        <>
            {/* 2.4 */}
            <TekstInput
                label={t("felles.telefon")}
                value={kontaktinfo?.telefonnummer}
                onChange={(telefonnummer) => setKontaktinfo({ ...kontaktinfo, telefonnummer })}
            />

            {/* 2.5 */}
            <TekstInput
                label={t("felles.epost")}
                value={kontaktinfo?.epost}
                onChange={(epost) => setKontaktinfo({ ...kontaktinfo, epost })}
            />
        </>
    );
};

export default KontaktinfoSkjema;
