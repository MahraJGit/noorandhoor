"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, List } from "lucide-react";

export default function BlogTableOfContents({ items = [] }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id || "");

  useEffect(() => {
    if (!items.length) return undefined;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!headings.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#171717]"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] sm:px-6"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ba8a44]/35 bg-[#ba8a44]/10 text-[#eec876]">
            <List className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-white sm:text-base">
              Table of contents
            </span>
            <span className="mt-0.5 block truncate text-xs text-white/45">
              {items.length} section{items.length === 1 ? "" : "s"}
              {!open && activeId
                ? ` · ${items.find((item) => item.id === activeId)?.text || ""}`
                : ""}
            </span>
          </span>
        </span>
        <ChevronDown
          className={[
            "h-5 w-5 shrink-0 text-[#ba8a44] transition-transform duration-300",
            open ? "rotate-180" : "",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>

      <div
        id={panelId}
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <ol className="space-y-1 border-t border-white/8 px-3 py-3 sm:px-4 sm:py-4">
            {items.map((item, index) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm leading-6 transition-colors",
                      item.level >= 3 ? "pl-7" : "",
                      isActive
                        ? "bg-[#ba8a44]/12 font-medium text-[#eec876]"
                        : "text-white/65 hover:bg-white/[0.04] hover:text-[#eec876]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 w-5 shrink-0 text-right text-xs tabular-nums",
                        isActive ? "text-[#ba8a44]" : "text-white/30",
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.text}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
