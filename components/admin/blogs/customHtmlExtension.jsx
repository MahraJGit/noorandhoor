"use client";

import { useState } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import CustomHtmlModal from "@/components/admin/blogs/CustomHtmlModal";
import {
  decodeCustomHtmlAttr,
  encodeCustomHtmlAttr,
  sanitizeCustomHtml,
} from "@/lib/blog/sanitizeHtml";

function CustomHtmlView({ node, updateAttributes, deleteNode, selected }) {
  const [open, setOpen] = useState(false);
  const html = sanitizeCustomHtml(node.attrs.html || "");

  return (
    <NodeViewWrapper
      as="div"
      className={
        selected
          ? "blog-custom-html-node is-selected"
          : "blog-custom-html-node"
      }
      data-drag-handle
    >
      <div className="blog-custom-html-frame">
        {html.trim() ? (
          <div
            className="blog-custom-html"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-sm text-white/40">Empty custom HTML block</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            contentEditable={false}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setOpen(true)}
            className="rounded-md border border-[#ba8a44]/45 bg-[#ba8a44]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#eec876] transition hover:bg-[#ba8a44]/25"
          >
            Edit HTML
          </button>
          <button
            type="button"
            contentEditable={false}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => deleteNode()}
            className="rounded-md border border-white/15 bg-transparent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/50 transition hover:border-red-400/40 hover:text-red-200"
          >
            Remove
          </button>
        </div>
      </div>

      <CustomHtmlModal
        open={open}
        initialHtml={node.attrs.html || ""}
        insertLabel="Save"
        onCancel={() => setOpen(false)}
        onInsert={(nextHtml) => {
          updateAttributes({ html: nextHtml });
          setOpen(false);
        }}
      />
    </NodeViewWrapper>
  );
}

export const CustomHtml = Node.create({
  name: "customHtml",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      html: {
        default: "",
        parseHTML: (element) => {
          const encoded = element.getAttribute("data-html");
          if (encoded) return decodeCustomHtmlAttr(encoded);
          return element.innerHTML || "";
        },
        renderHTML: (attributes) => ({
          "data-html": encodeCustomHtmlAttr(attributes.html || ""),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="custom-html"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "custom-html",
        class: "blog-custom-html",
      }),
    ];
  },

  addCommands() {
    return {
      insertCustomHtml:
        (html) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { html: sanitizeCustomHtml(html) },
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomHtmlView);
  },
});
