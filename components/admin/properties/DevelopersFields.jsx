"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import useAdminDevelopers from "@/hooks/useAdminDevelopers";
import { normalizePropertyDevelopers } from "@/lib/admin/propertyDevelopers";

export default function DevelopersFields({ value = [], onChange }) {
  const { developers, isReady, error } = useAdminDevelopers();
  const selected = normalizePropertyDevelopers(value);
  const selectedIds = new Set(selected.map((item) => item.id));

  const toggle = (developer) => {
    if (selectedIds.has(developer.id)) {
      onChange(selected.filter((item) => item.id !== developer.id));
      return;
    }

    onChange([
      ...selected,
      {
        id: developer.id,
        developerName: developer.developerName,
        title: developer.title || "",
        imagePath: developer.imagePath || "",
      },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[1.4px] text-white/60">
            Developers
          </p>
          <p className="mt-1 text-xs text-white/40">
            Attach one or more developers from the catalog. Shown on the public
            property details grid.
          </p>
        </div>
        <Link
          href="/admin/developers/new"
          className="text-xs text-[#eec876] transition hover:text-[#ba8a44]"
        >
          Add developer
        </Link>
      </div>

      {!isReady ? (
        <p className="text-sm text-white/40">Loading developers...</p>
      ) : error ? (
        <p className="text-sm text-red-300/80">{error}</p>
      ) : !developers.length ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-white/40">
          No developers in the catalog yet.{" "}
          <Link href="/admin/developers/new" className="text-[#eec876]">
            Create one
          </Link>{" "}
          first.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {developers.map((developer) => {
            const isSelected = selectedIds.has(developer.id);
            return (
              <button
                key={developer.id}
                type="button"
                onClick={() => toggle(developer)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  isSelected
                    ? "border-[#ba8a44] bg-[#ba8a44]/15 text-[#eec876]"
                    : "border-white/10 text-white/70 hover:border-[#ba8a44]/50 hover:text-[#eec876]"
                }`}
              >
                {isSelected ? <Check className="h-3 w-3" /> : null}
                {developer.developerName}
              </button>
            );
          })}
        </div>
      )}

      {selected.length ? (
        <p className="text-xs text-white/40">
          {selected.length} developer{selected.length === 1 ? "" : "s"} attached
        </p>
      ) : null}
    </div>
  );
}
