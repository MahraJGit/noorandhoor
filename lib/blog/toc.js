import { slugify } from "@/lib/admin/utils";

function headingText(innerHtml) {
  return String(innerHtml || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueHeadingId(base, used) {
  let id = base || "section";
  let next = 2;
  while (used.has(id)) {
    id = `${base}-${next}`;
    next += 1;
  }
  used.add(id);
  return id;
}

export function enrichHtmlWithToc(html) {
  const source = String(html || "");
  if (!source.trim()) return { html: "", toc: [] };

  const used = new Set();
  const toc = [];

  const nextHtml = source.replace(
    /<(h[123])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs = "", inner) => {
      const text = headingText(inner);
      if (!text) return match;

      const level = Number(tag[1]);
      const existingId = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
      const id = uniqueHeadingId(slugify(existingId || text) || "section", used);

      toc.push({ id, text, level });

      const cleanAttrs = String(attrs)
        .replace(/\s*id\s*=\s*["'][^"']*["']/gi, "")
        .trim();
      const attrPart = cleanAttrs ? ` ${cleanAttrs}` : "";
      return `<${tag}${attrPart} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: nextHtml, toc };
}
