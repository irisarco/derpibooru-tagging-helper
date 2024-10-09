import type { WebsiteConfig } from "@/app/websites";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LocalAutocompleter } from "./local-autocompleter";

export const useAutocomplete = (
  prefix: string | undefined,
  website: WebsiteConfig,
): { label: string; value: string }[] => {
  const { data: autocompleter } = useQuery({
    queryKey: ["autocompleter", website.url],
    queryFn: async () => {
      const now = new Date();
      const cacheKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

      const res = await fetch(
        `${website.url}/autocomplete/compiled?vsn=2&key=${cacheKey}`,
        { credentials: "omit", cache: "force-cache" },
      );
      return new LocalAutocompleter(await res.arrayBuffer());
    },
  });

  const { data: remote } = useQuery({
    queryKey: ["remote-autocomplete", website.id, prefix],
    queryFn: async (): Promise<{ label: string; value: string }[]> => {
      const url = new URL("/api/autocomplete", window.location.origin);
      url.searchParams.set("site", website.id);
      url.searchParams.set("term", prefix!);
      const res = await fetch(url);
      return res.json();
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(prefix && !autocompleter),
  });

  if (autocompleter) {
    return (
      (prefix &&
        autocompleter.topK(prefix, 5).map((t) => ({
          label: `${t.name} (${t.imageCount})`,
          value: t.name,
        }))) ||
      []
    );
  }

  return (prefix && remote) || [];
};
