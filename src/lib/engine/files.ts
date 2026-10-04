function decodeLatin1(buf: ArrayBuffer): string {
  return new TextDecoder("latin1").decode(buf);
}

function unescapePdfString(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\(\d{1,3})/g, (_, oct: string) => String.fromCharCode(parseInt(oct, 8)));
}

export function extractPdfText(buf: ArrayBuffer): string {
  const raw = decodeLatin1(buf);
  const chunks: string[] = [];
  const tj = /\((?:\\.|[^\\)])*\)\s*Tj/g;
  let m: RegExpExecArray | null;
  while ((m = tj.exec(raw))) {
    const inner = m[0].slice(1, m[0].lastIndexOf(")"));
    chunks.push(unescapePdfString(inner));
  }
  const TJ = /\[(.*?)\]\s*TJ/gs;
  while ((m = TJ.exec(raw))) {
    const body = m[1] ?? "";
    const parts = body.match(/\((?:\\.|[^\\)])*\)/g) ?? [];
    for (const p of parts) chunks.push(unescapePdfString(p.slice(1, -1)));
  }
  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

export async function extractFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const api =
      "extractRawText" in mammoth
        ? mammoth
        : (mammoth as { default: typeof mammoth }).default;
    const buf = await file.arrayBuffer();
    const result = await api.extractRawText({ arrayBuffer: buf });
    return result.value.replace(/\n{3,}/g, "\n\n").trim();
  }
  if (name.endsWith(".pdf")) {
    const buf = await file.arrayBuffer();
    const text = extractPdfText(buf);
    if (text.split(/\s+/).length < 20) {
      throw new Error(
        "Could not read enough text from this PDF. Paste the text, or try a .txt or .docx file.",
      );
    }
    return text;
  }
  return (await file.text()).trim();
}
