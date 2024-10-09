export type WebsiteConfig = {
  id: string;
  name: string;
  url: string;
  /** "Everything" filter id */
  filter: string;
  /** Improve search results by filtering out images that are likely to be poorly tagged */
  defaultQuery: string;
};

export const websites: WebsiteConfig[] = [
  {
    id: "derpibooru",
    name: "Derpibooru",
    url: "https://derpibooru.org",
    filter: "56027",
    defaultQuery: "score.gt:50, first_seen_at.lt:2 days ago",
  },
  {
    id: "furbooru",
    name: "Furbooru",
    url: "https://furbooru.org",
    filter: "2",
    defaultQuery: "score.gt:0, first_seen_at.lt:2 days ago",
  },
  {
    id: "ponybooru",
    name: "Ponybooru",
    url: "https://ponybooru.org",
    filter: "2748", // Unofficial and made by some random person
    defaultQuery: "score.gt:0, first_seen_at.lt:2 days ago",
  },
  {
    id: "ponerpics",
    name: "Ponerpics",
    url: "https://ponerpics.org",
    filter: "2",
    defaultQuery: "score.gt:0, first_seen_at.lt:2 days ago",
  },
  {
    id: "twibooru",
    name: "Twibooru",
    url: "https://twibooru.org",
    filter: "2",
    defaultQuery: "score.gt:0, first_seen_at.lt:2 days ago",
  },
  {
    id: "manebooru",
    name: "Manebooru",
    url: "https://manebooru.art",
    filter: "2",
    defaultQuery: "score.gt:0, first_seen_at.lt:2 days ago",
  },
];
