export interface Meme {
  image: string;
  /** Name of the Lemmy community the post comes from */
  category: string;
  caption: string;
  /** Link to the original post */
  permalink: string;
}

export interface RedditMeme {
  image: string;
  category: string | null;
  caption: string;
  /** Relative to https://www.reddit.com */
  permalink: string;
}

export interface RedditPost {
  kind: string;
  data: Record<string, unknown>;
}

export type Locale = "br" | "de" | "en" | "es" | "fr" | "in" | "it" | "ru" | "tr";

export interface RedditOptions {
  /** Defaults to "en". Ignored when customSubredditName is set. */
  locale?: Locale;
  customSubredditName?: string;
  fullRawBody?: boolean;
}

export declare function random(): Promise<Meme>;

/** @deprecated Reddit blocks most unauthenticated requests. Will be removed in v5. */
export declare function reddit(options: RedditOptions & { fullRawBody: true }): Promise<RedditPost>;
/** @deprecated Reddit blocks most unauthenticated requests. Will be removed in v5. */
export declare function reddit(options?: RedditOptions & { fullRawBody?: false }): Promise<RedditMeme>;
/** @deprecated Reddit blocks most unauthenticated requests. Will be removed in v5. */
export declare function reddit(options?: RedditOptions): Promise<RedditMeme | RedditPost>;
