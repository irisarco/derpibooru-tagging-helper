"use client";
import { useState } from "react";
import { Description } from "./components/description";
import { Frame } from "./components/frame";
import { Header } from "./components/header";
import { Tag } from "./components/tag";
import { TagInput } from "./components/tag-input";
import { websites, type WebsiteConfig } from "./websites";

const getRelatedTags = async (
  tags: string[],
  website: WebsiteConfig,
): Promise<string[]> => {
  const url = new URL("/api/related-tags", window.location.origin);
  url.searchParams.set("site", website.name);
  url.searchParams.set("tags", JSON.stringify(tags));
  const res = await fetch(url);
  return res.json();
};

export default function Home() {
  const [related, setRelated] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState(websites[0]);

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const website = websites.find((w) => w.url === event.target.value);
    if (website) {
      setSelectedWebsite(website);
    }
  };

  const handleAdd = (tag?: string) => {
    if (!tag) return;

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
      console.error(e);
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

      <label htmlFor="website-select" className="mb-2 block text-[13px]">
        Choose a website:
      </label>
      <select
        id="website-select"
        value={selectedWebsite.url}
        onChange={handleWebsiteChange}
        className="text[#e0e0e0] block w-full border border-[#5f636a] bg-[#1d242f] px-2.5 text-sm hover:bg-[#313947] focus:border-[#647493] focus:bg-[#313947] focus-visible:ring-0"
      >
        {websites.map((website) => (
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
          website={selectedWebsite}
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
