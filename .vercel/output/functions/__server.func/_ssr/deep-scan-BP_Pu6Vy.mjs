import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deep-scan-BP_Pu6Vy.js
var runDeepScan_createServerFn_handler = createServerRpc({
	id: "e6e745116775371aa55fd6e107333f3324d9aa5677e6c07af414c0edb52248b8",
	name: "runDeepScan",
	filename: "src/lib/deep-scan.ts"
}, (opts) => runDeepScan.__executeServer(opts));
var runDeepScan = createServerFn({ method: "POST" }).validator((input) => input).handler(runDeepScan_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Deep scan is not available in this environment."
	};
	const text = data.text.slice(0, 5e3);
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 500,
			temperature: 0,
			messages: [{
				role: "system",
				content: "You assist an originality checker. Identify likely paraphrases of well-known public texts or textbook passages, and comment on writing-style regularity. Do not help disguise plagiarism. Reply with compact JSON only: {\"paraphraseNotes\": string[], \"likelySources\": string[], \"aiNote\": string}."
			}, {
				role: "user",
				content: text
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const raw = (await res.json()).choices?.[0]?.message?.content ?? "";
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) return {
		ok: false,
		error: "Could not parse the model response."
	};
	try {
		const parsed = JSON.parse(raw.slice(start, end + 1));
		const asStr = (v) => Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 6) : [];
		return {
			ok: true,
			paraphraseNotes: asStr(parsed.paraphraseNotes),
			likelySources: asStr(parsed.likelySources),
			aiNote: typeof parsed.aiNote === "string" ? parsed.aiNote : ""
		};
	} catch {
		return {
			ok: false,
			error: "Could not parse the model response."
		};
	}
});
//#endregion
export { runDeepScan_createServerFn_handler };
