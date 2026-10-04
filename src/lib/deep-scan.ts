import { createServerFn } from "@tanstack/react-start";

export type DeepScanResult = {
  ok: true;
  paraphraseNotes: string[];
  aiNote: string;
  likelySources: string[];
} | { ok: false; error: string };

export const runDeepScan = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => input)
  .handler(async ({ data }): Promise<DeepScanResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "Deep scan is not available in this environment." };
    }
    const text = data.text.slice(0, 5000);
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 500,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You assist an originality checker. Identify likely paraphrases of well-known public texts or textbook passages, and comment on writing-style regularity. Do not help disguise plagiarism. Reply with compact JSON only: {\"paraphraseNotes\": string[], \"likelySources\": string[], \"aiNote\": string}.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `xAI API error ${res.status}` };
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = body.choices?.[0]?.message?.content ?? "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) {
      return { ok: false, error: "Could not parse the model response." };
    }
    try {
      const parsed = JSON.parse(raw.slice(start, end + 1)) as {
        paraphraseNotes?: unknown;
        likelySources?: unknown;
        aiNote?: unknown;
      };
      const asStr = (v: unknown) =>
        Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 6) : [];
      return {
        ok: true,
        paraphraseNotes: asStr(parsed.paraphraseNotes),
        likelySources: asStr(parsed.likelySources),
        aiNote: typeof parsed.aiNote === "string" ? parsed.aiNote : "",
      };
    } catch {
      return { ok: false, error: "Could not parse the model response." };
    }
  });
