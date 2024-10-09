"use client";
import clsx from "clsx";
import { useState } from "react";
import { Header } from "./components/header";
import { Tag } from "./components/tag";
import { TagInput } from "./components/tag-input";
import { Frame } from "./components/frame";
import { Description } from "./components/description";

const escapeTag = (name: string) => `"${name.replaceAll('"', '\\"')}"`;

const getRelatedTags = async (tags: string[], selectedWebsite: string): Promise<string[]> => {
  const url = new URL(`${selectedWebsite}/api/v1/json/search/images`);
  url.search = new URLSearchParams({
    q: clsx(
      tags.length && `(${tags.map((t) => escapeTag(t)).join(" || ")}),`,
      "score.gt:50, first_seen_at.lt:2 days ago",
    ),
    filter_id: "56027", // Everything
    sf: "_score",
    per_page: "50",
  }).toString();

  const res = await fetch(url.toString());
  const json = await res.json();
  const images: { tags: string[] }[] = json.images;
  const frequencies: Record<string, number> = {};
  const initial = new Set(tags);

  images
    .flatMap((i) => i.tags)
    .filter((t) => !initial.has(t))
    .forEach((t) => {
      frequencies[t] = (frequencies[t] || 0) + 1;
    });

  return Object.entries(frequencies)
    .sort()
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([n]) => n);
};

export default function Home() {
  const [related, setRelated] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("https://derpibooru.org");

  const websites = [
    { name: "Derpibooru", url: "https://derpibooru.org" },
    { name: "Ponybooru", url: "https://ponybooru.org" },
    { name: "Twibooru", url: "https://twibooru.org" },
    { name: "Ponepics", url: "https://ponerpics.org/" },
    { name: "Furbooru", url: "https://furbooru.org" }
  ];

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWebsite(event.target.value);
  };

  const handleAdd = (tag?: string) => {
    if(!tag) return;
    const newTags = tag
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    setTags(Array.from(new Set([...tags, ...newTags])));
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const loadRelated = async () => {
    setLoading(true);
    try {
      const data = await getRelatedTags(tags, selectedWebsite);
      setRelated(data);
      setError(undefined);
    } catch (e: any) {
      setError(e);
      setRelated(undefined);
    }
    setLoading(false);
  };

  const copyTags = () => {
    navigator.clipboard.writeText(tags.join(", "));
  };

  const clear = () => {
    setTags([]);
    setRelated(undefined);
    setError(undefined);
  };

  return (
    <main className="mx-auto mt-4 max-w-4xl p-4">
      <Header className="mb-8" />
      <Description className="mb-6" />

      <label htmlFor="website-select" className="block mb-2 text-[13px]">Choose a website:</label>
      <select id="website-select" value={selectedWebsite} onChange={handleWebsiteChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {websites.map(website => (
          <option key={website.url} value={website.url}>
            {website.name}
          </option>
        ))}
      </select>

      <div className="mb-px mt-3 text-[13px]">Write your tags here:</div>
      <Frame>
        {tags.map((t) => (
          <Tag
            key={t}
            name={t}
            onDelete={() => setTags(tags.filter((tag) => tag !== t))}
          />
        ))}
        <TagInput
          selectedWebsite={selectedWebsite}
          onAdd={handleAdd}
          onDeletePrevious={() => setTags(tags.slice(0, -1))}
        />
      </Frame>

      <div className="mt-5px flex gap-5px">
        <button
          disabled={loading}
          className="border border-[#117abb] bg-[#1a4c6b] p-5px text-sm font-bold leading-none hover:border-[#0f6ba4] hover:bg-[#153d56] disabled:opacity-50"
          onClick={loadRelated}
        >
          Load related
        </button>
        <button
          className="border border-[#177217] bg-[#144714] p-5px text-sm font-bold leading-none hover:border-[#135c13] hover:bg-[#0e330e]"
          onClick={copyTags}
        >
          Copy tags
        </button>
        <button
          className="border border-[#b3312e] bg-[#66211f] p-5px text-sm font-bold leading-none hover:border-[#9f2c28] hover:bg-[#521b19]"
          onClick={clear}
        >
          Clear
        </button>
      </div>

      {related && related.length > 0 && (
        <>
          <div className="mb-px mt-3 text-[13px]">
            Related tags, click to add:
          </div>

          <Frame>
            {related.map((t) => (
              <Tag
                key={t}
                name={t}
                onClick={() => toggleTag(t)}
                disabled={tags.includes(t)}
              />
            ))}
          </Frame>
        </>
      )}
      {related && related.length === 0 && (
        <div className="mb-px mt-3 text-sm">No related tags found</div>
      )}
      {error && (
        <div className="mb-px mt-3 text-sm text-red-500">
          There was an error while fetching related tags
        </div>
      )}
    </main>
  );
}
