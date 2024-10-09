import { websites } from "@/app/websites";
import clsx from "clsx";
import { NextResponse, type NextRequest } from "next/server";
import * as v from "valibot";

export const dynamic = "force-dynamic";

export const runtime = "edge";

const schema = v.object({
  site: v.picklist(websites.map((w) => w.name)),
  tags: v.pipe(
    v.string(),
    v.transform((v) => JSON.parse(v)),
    v.array(v.string()),
  ),
});

const escapeTag = (name: string) => `"${name.replaceAll('"', '\\"')}"`;

export async function GET(request: NextRequest) {
  const { site, tags } = v.parse(
    schema,
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );

  const website = websites.find((w) => w.name === site)!;

  const isTwibooru = website.id === "twibooru";

  const path = isTwibooru
    ? "/api/v3/search/posts"
    : "/api/v1/json/search/images";

  const url = new URL(path, website.url);
  url.search = new URLSearchParams({
    q: clsx(
      tags.length && `(${tags.map((t) => escapeTag(t)).join(" || ")}),`,
      website.defaultQuery,
    ),
    filter_id: website.filter,
    sf: "_score",
    per_page: "50",
  }).toString();

  const res = await fetch(url);
  const json = await res.json();
  const images: { tags: string[] }[] = isTwibooru ? json.posts : json.images;
  const frequencies: Record<string, number> = {};
  const initial = new Set(tags);

  images
    .flatMap((i) => i.tags)
    .filter((t) => !initial.has(t))
    .forEach((t) => {
      frequencies[t] = (frequencies[t] || 0) + 1;
    });

  return NextResponse.json(
    Object.entries(frequencies)
      .sort()
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([n]) => n),
  );
}
