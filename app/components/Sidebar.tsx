"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ContentSection } from "../lib/content";

function splitTitle(title: string): { prefix: string | null; rest: string } {
  // "0. Prerequisites" → { prefix: "0", rest: "Prerequisites" }
  const m = /^([\dA-Z]+)\.\s+(.+)$/.exec(title);
  if (m) return { prefix: m[1], rest: m[2] };
  return { prefix: null, rest: title };
}

export function Sidebar({ sections }: { sections: ContentSection[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  const totalLessons = sections.reduce((n, s) => n + s.files.length, 0);
  const flat = sections.flatMap((s) => s.files);
  const currentIndex = flat.findIndex((f) => f.href === pathname);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
        className="fixed left-3 top-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-white/90 text-blue-900 shadow-sm backdrop-blur md:hidden"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
          {mobileOpen ? (
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[1px] md:hidden"
          onClick={closeMobile}
          aria-hidden
        />
      )}

      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 flex w-72 transform flex-col border-r border-blue-100 bg-[#f7f4e9] transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0`}
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobile}
          className="group block px-6 pt-7 pb-5 transition-colors"
        >
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-[1.85rem] font-bold leading-none tracking-tight text-blue-950">
              Grit
            </span>
            <span className="font-handwritten text-[1.05rem] leading-none text-blue-600">
              sadhinchu
            </span>
          </div>
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-700">
            Python syllabus
          </div>
        </Link>

        <div className="mx-5 border-t border-blue-200/60" />

        {/* Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <SectionGroup
              key={section.name}
              section={section}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        {/* Progress */}
        <div className="border-t border-blue-200/60 px-6 py-4">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            <span>Progress</span>
            <span className="tabular-nums text-blue-700">
              {currentIndex >= 0 ? currentIndex + 1 : 0}{" "}
              <span className="text-slate-600">/ {totalLessons}</span>
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${
                  currentIndex >= 0
                    ? ((currentIndex + 1) / totalLessons) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionGroup({
  section,
  pathname,
  onNavigate,
}: {
  section: ContentSection;
  pathname: string;
  onNavigate: () => void;
}) {
  const containsActive = section.files.some((f) => pathname === f.href);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const open = manualOpen ?? containsActive;
  const { prefix, rest } = splitTitle(section.title);

  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={() => setManualOpen(!open)}
        aria-expanded={open}
        className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors ${
          containsActive
            ? "text-blue-950"
            : "text-slate-700 hover:bg-blue-100/50 hover:text-blue-900"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
          aria-hidden
        >
          <path
            d="M7 5l6 5-6 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {prefix && (
          <span className="w-5 shrink-0 font-mono text-[11px] font-semibold tabular-nums text-slate-400">
            {prefix}
          </span>
        )}
        <span className="truncate text-[13px] font-semibold tracking-tight">
          {rest}
        </span>
      </button>

      {open && (
        <ul className="mt-0.5 mb-1.5 ml-[18px] space-y-px border-l border-dashed border-blue-200 pl-2">
          {section.files.map((file) => {
            const active = pathname === file.href;
            const { prefix: fp, rest: fr } = splitTitle(file.title);
            return (
              <li key={file.href}>
                <Link
                  href={file.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] leading-snug transition-all ${
                    active
                      ? "bg-blue-600 font-medium text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]"
                      : "text-slate-600 hover:bg-blue-100/60 hover:text-blue-900"
                  }`}
                >
                  {fp && (
                    <span
                      className={`shrink-0 font-mono text-[10.5px] tabular-nums ${
                        active ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {fp}
                    </span>
                  )}
                  <span className="truncate">{fr}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
