import { useEffect, useState } from "react"
import { hentLand } from "../api/api";
import { useError } from "./useError";

interface Options {
  label?: string;
  value: string;
}

export const useLand = () => {
  const [land, setLand] = useState<string[]>([]);
  const { setError } = useError();
  
  useEffect(() => {
    (async () => {
      try {
        const landliste: string[] = await hentLand();
        landliste.sort();
        setLand(landliste);
      } catch(e) {
        setError("Klarte ikke å hente landene");
      }
    })();
  }, [])

  const optionsListe = (): Options[] =>  {
    return land.map((landNavn) => {
      return {
          label: landNavn,
          value: landNavn,
      }
  });
  }

  return { land: optionsListe() };

}