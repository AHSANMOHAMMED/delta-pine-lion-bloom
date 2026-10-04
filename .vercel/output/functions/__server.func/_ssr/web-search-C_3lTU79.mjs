import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/web-search-C_3lTU79.js
var UA = "ProvenanceOriginality/1.0 (educational originality checker)";
async function wikiJson(url) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), 8e3);
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA,
				Accept: "application/json"
			},
			signal: ctrl.signal
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
}
var searchPublicSources_createServerFn_handler = createServerRpc({
	id: "9d7bfef2b285e86efd5a016762b58800693ece56dc8546a33f66d929b48787e1",
	name: "searchPublicSources",
	filename: "src/lib/web-search.ts"
}, (opts) => searchPublicSources.__executeServer(opts));
var searchPublicSources = createServerFn({ method: "POST" }).validator((input) => input).handler(searchPublicSources_createServerFn_handler, async ({ data }) => {
	const phrases = data.phrases.filter((p) => p.trim().length > 12).slice(0, 3);
	if (!phrases.length) return [];
	const found = [];
	const seen = /* @__PURE__ */ new Set();
	for (const phrase of phrases) {
		const hits = (await wikiJson("https://en.wikipedia.org/w/api.php?" + new URLSearchParams({
			action: "query",
			list: "search",
			srsearch: phrase,
			srlimit: "3",
			format: "json",
			utf8: "1",
			origin: "*"
		}).toString()))?.query?.search ?? [];
		for (const hit of hits) {
			if (seen.has(hit.title) || found.length >= 5) continue;
			seen.add(hit.title);
			const pages = (await wikiJson("https://en.wikipedia.org/w/api.php?" + new URLSearchParams({
				action: "query",
				prop: "extracts",
				exintro: "1",
				explaintext: "1",
				redirects: "1",
				titles: hit.title,
				format: "json",
				utf8: "1",
				origin: "*"
			}).toString()))?.query?.pages ?? {};
			for (const p of Object.values(pages)) {
				if (!p.extract || p.missing) continue;
				const extract = p.extract.slice(0, 1800);
				if (extract.split(/\s+/).length < 40) continue;
				found.push({
					title: p.title ?? hit.title,
					url: `https://en.wikipedia.org/wiki/${encodeURIComponent((p.title ?? hit.title).replace(/ /g, "_"))}`,
					extract
				});
			}
		}
		if (found.length >= 5) break;
	}
	return found;
});
//#endregion
export { searchPublicSources_createServerFn_handler };
