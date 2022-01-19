import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LukkbarAlert from "./LukkbarAlert";
import { hentUtloepstidForInnlogging } from "../../api/api";
import { konverterSekunderTilTid } from "../../utils/konverterSekunderTilTid";
import WebWorker from "../../utils/workers/WebWorker";

const UtloeptSession = () => {
    const [open, setIsOpen] = useState<boolean>(false);
    const [harBlittLukket, setHarBlittLukket] = useState<boolean>(false);
    const [tidIgjen, setTidIgjen] = useState<number>();
    const [tid, setTid] = useState(konverterSekunderTilTid(0));
    const { t } = useTranslation();

    useEffect(() => {
        hentUtloepstidForInnlogging().then((utgaarOm: string) => {
            const sluttTid = new Date();
            sluttTid.setSeconds(sluttTid.getSeconds() + parseInt(utgaarOm));
            WebWorker.registrerNedtellingsLytter({ sluttTid: sluttTid.valueOf(), callbackFn: setTidIgjen });
        });

        return () => {
            if (WebWorker) WebWorker.fjernNedtellingsLytter();
        };
    }, []);

    useEffect(() => {
        if (typeof tidIgjen !== "number") return;

        const femMinutter = 5 * 60;
        setTid(konverterSekunderTilTid(tidIgjen));

        if (tidIgjen <= 0) {
            loggUt();
        } else if (tidIgjen <= femMinutter && !harBlittLukket) {
            setIsOpen(true);
        }
    }, [tidIgjen]);

    const loggUt = async () => {
        try {
            const response: string = await hentUtloepstidForInnlogging();

            if (parseInt(response) === 0) {
                window.location.reload();
            } else {
                const sluttTid = new Date();
                sluttTid.setSeconds(sluttTid.getSeconds() + parseInt(response));
                WebWorker.oppdaterSluttTid(sluttTid.valueOf());
            }
        } catch (error) {
            window.location.reload();
        }
    };

    return (
        <>
            {open && (
                <div className="utlogging-alert-wrap">
                    <LukkbarAlert
                        onClose={() => {
                            setIsOpen(false);
                            setHarBlittLukket(true);
                        }}
                    >
                        {`${t("brukerLoggesUt.info1")} `}
                        <strong>
                            {`${tid.minutter.toString().padStart(2, "0")}:${tid.sekunder.toString().padStart(2, "0")}`}
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
