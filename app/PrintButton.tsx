"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_-10px_rgba(0,0,0,0.55)] transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 print:hidden"
      aria-label="Download all notes as PDF"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M10 3v9m0 0 3-3m-3 3-3-3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 14v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      Download as PDF
    </button>
  );
}
