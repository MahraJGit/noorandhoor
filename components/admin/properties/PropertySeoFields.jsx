"use client";

import { TextArea, TextField } from "@/components/admin/ui/Fields";

export default function PropertySeoFields({ form, setField }) {
  const seoTitleLen = form.seoTitle.trim().length;
  const seoDescLen = form.seoDescription.trim().length;

  return (
    <div className="space-y-5 rounded-2xl border border-white/8 bg-[#161616] p-5 sm:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[1.4px] text-white/60">
          SEO
        </p>
        <p className="mt-1 text-xs text-white/40">
          Used for the property detail page title, meta tags, and search snippets.
        </p>
      </div>

      <TextField
        id="seoTitle"
        label="Meta title"
        value={form.seoTitle}
        onChange={(event) => setField("seoTitle", event.target.value)}
        placeholder="Leave blank to use the property title"
        hint={`${seoTitleLen}/60 characters recommended`}
        tooltip="Appears in the browser tab and Google results. Aim for about 50–60 characters."
      />
      <TextArea
        id="seoDescription"
        label="Meta description"
        rows={3}
        value={form.seoDescription}
        onChange={(event) => setField("seoDescription", event.target.value)}
        placeholder="Leave blank to use the category description"
        hint={`${seoDescLen}/160 characters recommended`}
        tooltip="Short summary shown under the title in search results. Aim for about 140–160 characters."
      />
    </div>
  );
}
