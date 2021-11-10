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
                landliste.sort();
                setLand(landliste);
            } catch (e) {
              console.log(e);
                setError("Klarte ikke å hente landene");
            }
        })();
    }, []);

    const optionsListe = (): Options[] => {
        return land.map((l) => {
            return {
                label: l.beskrivelser["nb"].tekst,
                value: l.beskrivelser["nb"].tekst,
            };
        });
    };
    return { land: optionsListe() };
};
