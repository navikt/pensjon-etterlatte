import { useEffect, useState } from "react";
import { hentLand } from "../api/api";
import { useError } from "./useError";

interface Options {
    label?: string;
    value: string;
}

interface Land {
    gyldigFra: string;
    gyldigTil: string;
    beskrivelser: {
        nb: {
            term: string;
            tekst: string;
        };
    };
}

export const useLand = (ekskluderUgyldige = true) => {
    const [land, setLand] = useState<Land[]>([]);
    const { setError } = useError();

    useEffect(() => {
        (async () => {
            try {
                let landliste: Land[] = await hentLand();

                if (ekskluderUgyldige) {
                    landliste = landliste.filter((land) => new Date(land.gyldigTil) > new Date() );
                }
                landliste = landliste.sort((a, b) => {
                  if(a.beskrivelser.nb.tekst > b.beskrivelser.nb.tekst) {return 1}
                  return -1;
                });
                setLand(landliste);
            } catch (e) {
              console.log(e);
                setError("Klarte ikke å hente landene");
            }
        })();
    }, []);

    const optionsListe = (): Options[] => {
        return land.map((l) => {
            const str = l.beskrivelser["nb"].tekst.toLowerCase();
            const tekst = str.charAt(0).toUpperCase() + str.slice(1);
            return {
                label: tekst,
                value: tekst,
            };
        });
    };
    return { land: optionsListe() };
};
