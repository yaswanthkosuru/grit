"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MarkdownView } from "./MarkdownView";

function splitSections(content: string): string[] {
  // Top-level "---" separator lines split the note into pedagogical chunks.
  // A blank line either side keeps us from chopping inside code/tables.
  return content
    .split(/\n[ \t]*---[ \t]*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function NoteContent({
  content,
  pager,
}: {
  content: string;
  pager?: ReactNode;
}) {
  const sections = splitSections(content);
  const total = sections.length;
  const [revealed, setRevealed] = useState(1);
  const allShown = revealed >= total;
  const newestRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest section after a click reveal.
  useEffect(() => {
    if (revealed > 1 && newestRef.current) {
      newestRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [revealed]);

  // Keyboard: ArrowRight / Space advances when not focused on inputs.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (allShown) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setRevealed((r) => Math.min(total, r + 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allShown, total]);

  return (
    <div>
      {sections.slice(0, revealed).map((section, i) => {
        const isLast = i === revealed - 1;
        return (
          <div
            key={i}
            ref={isLast && i > 0 ? newestRef : undefined}
            className={i > 0 ? "fade-in-section" : undefined}
            style={
              i > 0 ? { animation: "fadeInSection 420ms ease-out" } : undefined
            }
          >
            <MarkdownView content={section} />
          </div>
        );
      })}

      {!allShown ? (
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-dashed border-blue-200 pt-8 px-2">
          <div className="flex w-full items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < revealed ? "bg-blue-600" : "bg-blue-100"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
            <span className="tabular-nums">
              <span className="text-blue-700">{revealed}</span>
              <span className="text-slate-600"> / {total}</span>
            </span>
            <span className="text-slate-400" aria-hidden>
              ·
            </span>
            <button
              type="button"
              onClick={() => setRevealed(total)}
              className="text-slate-700 hover:text-blue-700 hover:underline"
            >
              show all
            </button>
          </div>

          <button
            type="button"
            onClick={() => setRevealed((r) => Math.min(total, r + 1))}
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(29,78,216,0.5)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
          >
            Continue
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M4 10h12m0 0-4-4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <p className="font-handwritten text-[1rem] text-blue-700">
            press space or → to continue
          </p>
        </div>
      ) : (
        pager
      )}

    </div>
  );
}
