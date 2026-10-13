import sanitizeHtml from "sanitize-html";

const TABLE_TAGS = [
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "colgroup",
  "col",
];

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
  "span",
  "div",
  ...TABLE_TAGS,
];

const TABLE_STYLE_PROPS = {
  border: [/^.*$/],
  "border-collapse": [/^.*$/],
  "border-color": [/^.*$/],
  "border-width": [/^.*$/],
  "border-style": [/^.*$/],
  padding: [/^.*$/],
  margin: [/^.*$/],
  width: [/^.*$/],
  height: [/^.*$/],
  "max-width": [/^.*$/],
  "background-color": [/^.*$/],
  background: [/^.*$/],
  color: [/^.*$/],
  "text-align": [/^.*$/],
  "vertical-align": [/^.*$/],
  "font-weight": [/^.*$/],
  "font-size": [/^.*$/],
  "line-height": [/^.*$/],
};

const SANITIZE_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height"],
    code: ["class"],
    span: ["class", "style"],
    p: ["class"],
    pre: ["class"],
    h1: ["id"],
    h2: ["id"],
    h3: ["id"],
    div: ["class", "data-type", "data-html"],
    table: ["class", "style", "border", "cellpadding", "cellspacing", "width"],
    thead: ["class", "style"],
    tbody: ["class", "style"],
    tfoot: ["class", "style"],
    tr: ["class", "style"],
    th: ["class", "style", "colspan", "rowspan", "scope", "width"],
    td: ["class", "style", "colspan", "rowspan", "width"],
    caption: ["class", "style"],
    colgroup: ["span", "style"],
    col: ["span", "style", "width"],
  },
  allowedStyles: {
    "*": TABLE_STYLE_PROPS,
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  },
};

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
}

export function encodeCustomHtmlAttr(html) {
  return encodeURIComponent(String(html || ""));
}

export function decodeCustomHtmlAttr(value) {
  return safeDecode(value);
}

export function sanitizeCustomHtml(html) {
  return sanitizeHtml(String(html || ""), SANITIZE_OPTIONS);
}

function expandCustomHtmlBlocks(html) {
  return String(html || "").replace(
    /<div\b([^>]*\bdata-type=(["'])custom-html\2[^>]*)>([\s\S]*?)<\/div>/gi,
    (match, attrs, _quote, inner) => {
      const dataHtml = attrs.match(/\bdata-html=(["'])([\s\S]*?)\1/i);
      const content = dataHtml ? safeDecode(dataHtml[2]) : inner;
      return `<div class="blog-custom-html" data-type="custom-html">${content}</div>`;
    },
  );
}

export function sanitizeBlogHtml(html) {
  const expanded = expandCustomHtmlBlocks(html);
  return sanitizeHtml(expanded, SANITIZE_OPTIONS);
}
