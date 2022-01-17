import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Nedteller from "./Nedteller";
import LukkbarAlert from "./LukkbarAlert";
import { hentUtløpstidForInnlogging } from "../../api/api";
import { konverterSekunderTilTimer } from "../../utils/konverterSekunderTilTimer";

const UtloeptSession = () => {
    const [open, setIsOpen] = useState<boolean>(false);
    const [tidIgjen, setTidIgjen] = useState<number>(0);
    const [nedtellerProps, setNedtellerProps] = useState({});
    const [pause, setPause] = useState<number>();
    const { t } = useTranslation();

    useEffect(() => {
        hentUtløpstidForInnlogging().then((utgaarOm: string) => {
            setTidIgjen(parseInt(utgaarOm));
        });
    }, []);

    useEffect(() => {
        clearTimeout(pause);
        const femMinutter = 5 * 60;
        const tidTilAlert = tidIgjen - femMinutter;

        if (tidIgjen !== 0) {
            if (tidIgjen < femMinutter) {
                const props = konverterSekunderTilTimer(tidIgjen);
                Object.assign(props, { visTimer: false });
                setNedtellerProps(props);
                setIsOpen(true);
            } else {
                const pauseId = () =>
                    window.setTimeout(() => {
                        setNedtellerProps({ minutter: 5, visTimer: false });
                        setIsOpen(true);
                    }, tidTilAlert * 1000);

                setPause(pauseId);
            }
        }

        return () => {
            if (pause) {
                clearTimeout(pause);
            }
        };
    }, [tidIgjen]);

    const loggUt = async () => {
        try {
            const response: string = await hentUtløpstidForInnlogging();

            if (parseInt(response) === 0) {
                window.location.reload();
            } else {
                setTidIgjen(parseInt(response));
            }
        } catch (error) {
            window.location.reload();
        }
    };

    return (
        <>
            {open && (
                <div className="utlogging-alert-wrap">
                    <LukkbarAlert onClose={() => setIsOpen(false)}>
                        {`${t("brukerLoggesUt.info1")} `}
                        <strong>
                            <Nedteller {...nedtellerProps} naarFerdig={loggUt} />
                        </strong>
                        {` ${t("brukerLoggesUt.tid")}.
                            ${t("brukerLoggesUt.info2")}`}
                    </LukkbarAlert>
                </div>
            )}
        </>
    );
};

export default UtloeptSession;
