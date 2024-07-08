import { useEffect, useState } from "react";
import { LocalAutocompleter } from "./local-autocompleter";

export const useAutocomplete = (prefix: string | undefined) => {
  const [autocompleter, setAutocompleter] = useState<LocalAutocompleter>();

  // Fetch completion file just like in philomena's code
  useEffect(() => {
    const now = new Date();
    const cacheKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

    fetch(
      `https://derpibooru.org/autocomplete/compiled?vsn=2&key=${cacheKey}`,
      { credentials: "omit", cache: "force-cache" },
    )
      .then((resp) => resp.arrayBuffer())
      .then((buf) => setAutocompleter(new LocalAutocompleter(buf)));
  }, []);

  return (prefix && autocompleter?.topK(prefix, 5)) || [];
};
