"use client";

import { useEffect, useId, useState } from "react";
import AdminButton from "@/components/admin/ui/AdminButton";
import { sanitizeCustomHtml } from "@/lib/blog/sanitizeHtml";

export default function CustomHtmlModal({
  open,
  initialHtml = "",
  onCancel,
  onInsert,
  insertLabel = "Insert",
}) {
  const titleId = useId();
  const [draft, setDraft] = useState(initialHtml || "");

  useEffect(() => {
    if (!open) return;
    setDraft(initialHtml || "");
  }, [open, initialHtml]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const previewHtml = sanitizeCustomHtml(draft);
  const canInsert = Boolean(previewHtml.trim());

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#ba8a44]/35 bg-[#171717] shadow-2xl"
      >
        <div className="border-b border-white/8 px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className="text-lg font-semibold tracking-wide text-[#eec876]"
          >
            Custom HTML
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-white/55">
            Paste a table or any other HTML. It is rendered on the article. The
            code button still shows code as text.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            placeholder={'<table>\n  <tr><th>Name</th><th>Email</th></tr>\n</table>'}
            className="min-h-40 w-full resize-y rounded-xl border border-white/10 bg-[#101010] px-4 py-3 font-mono text-sm leading-6 text-white/85 outline-none focus:border-[#ba8a44]/50"
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[1.4px] text-white/45">
              Preview
            </p>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#101010] px-4 py-4">
              {previewHtml.trim() ? (
                <div
                  className="blog-custom-html blog-custom-html--preview"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-sm text-white/35">
                  Preview appears here once you paste valid HTML.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/8 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <AdminButton variant="secondary" onClick={onCancel}>
            Cancel
          </AdminButton>
          <AdminButton
            disabled={!canInsert}
            onClick={() => onInsert?.(previewHtml)}
          >
            {insertLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
