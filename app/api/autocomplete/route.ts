import { NextResponse, type NextRequest } from "next/server";
import * as v from "valibot";

export const dynamic = "force-dynamic";

export const runtime = "edge";

const config = {
  ponybooru: {
    getUrl: (term: string) =>
      `https://ponybooru.org/autocomplete/tags?term=${encodeURIComponent(term)}`,
  },
  ponerpics: {
    getUrl: (term: string) =>
      `https://ponerpics.org/tags/autocomplete?term=${encodeURIComponent(term)}`,
  },
  twibooru: {
    getUrl: (term: string) =>
      `https://twibooru.org/tags/autocomplete.json?term=${encodeURIComponent(term)}`,
  },
  manebooru: {
    getUrl: (term: string) =>
      `https://manebooru.art/tags/autocomplete?term=${encodeURIComponent(term)}`,
  },
};

const schema = v.object({
  site: v.picklist(Object.keys(config) as (keyof typeof config)[]),
  term: v.string(),
});

export async function GET(request: NextRequest) {
  const { site, term } = v.parse(
    schema,
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );

  const { getUrl } = config[site];

  const res = await fetch(getUrl(term));
  const json = (await res.json()) as Array<{ label: string; value: string }>;

  return NextResponse.json(json.slice(0, 5));
}
