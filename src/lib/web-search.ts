import { createServerFn } from "@tanstack/react-start";
import type { WebSource } from "@/lib/engine/types";

const UA = "ProvenanceOriginality/1.0 (educational originality checker)";

type WikiSearch = {
  query?: { search?: { title: string }[] };
};

type WikiExtract = {
  query?: {
    pages?: Record<string, { title?: string; extract?: string; missing?: string }>;
  };
};

async function wikiJson<T>(url: string): Promise<T | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export const searchPublicSources = createServerFn({ method: "POST" })
  .validator((input: { phrases: string[] }) => input)
  .handler(async ({ data }): Promise<WebSource[]> => {
    const phrases = data.phrases.filter((p) => p.trim().length > 12).slice(0, 3);
    if (!phrases.length) return [];

    const found: WebSource[] = [];
    const seen = new Set<string>();

    for (const phrase of phrases) {
      const searchUrl =
        "https://en.wikipedia.org/w/api.php?" +
        new URLSearchParams({
          action: "query",
          list: "search",
          srsearch: phrase,
          srlimit: "3",
          format: "json",
          utf8: "1",
          origin: "*",
        }).toString();
      const search = await wikiJson<WikiSearch>(searchUrl);
      const hits = search?.query?.search ?? [];
      for (const hit of hits) {
        if (seen.has(hit.title) || found.length >= 5) continue;
        seen.add(hit.title);
        const extractUrl =
          "https://en.wikipedia.org/w/api.php?" +
          new URLSearchParams({
            action: "query",
            prop: "extracts",
            exintro: "1",
            explaintext: "1",
            redirects: "1",
            titles: hit.title,
            format: "json",
            utf8: "1",
            origin: "*",
          }).toString();
        const page = await wikiJson<WikiExtract>(extractUrl);
        const pages = page?.query?.pages ?? {};
        for (const p of Object.values(pages)) {
          if (!p.extract || p.missing) continue;
          const extract = p.extract.slice(0, 1800);
          if (extract.split(/\s+/).length < 40) continue;
          found.push({
            title: p.title ?? hit.title,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent((p.title ?? hit.title).replace(/ /g, "_"))}`,
            extract,
          });
        }
      }
      if (found.length >= 5) break;
    }
    return found;
  });
