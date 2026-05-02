"use client";

import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;
function ensureInit() {
  if (initialized) return;
  // Notebook palette: cream paper, blue ink, slate edges.
  // Mindmap branches use cScale0..cScaleN — set them to a calm blue family
  // so we don't get the default rainbow.
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    fontFamily:
      'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    flowchart: { htmlLabels: true, curve: "basis", padding: 18, nodeSpacing: 60, rankSpacing: 70 },
    mindmap: { padding: 22, maxNodeWidth: 260 },
    themeVariables: {
      background: "#ffffff",
      primaryColor: "#eff6ff",
      primaryTextColor: "#0f172a",
      primaryBorderColor: "#1d4ed8",
      secondaryColor: "#dbeafe",
      tertiaryColor: "#e0f2fe",
      lineColor: "#475569",
      textColor: "#0f172a",
      mainBkg: "#eff6ff",
      nodeBorder: "#1d4ed8",
      clusterBkg: "#f8fafc",
      clusterBorder: "#cbd5e1",
      titleColor: "#1e3a8a",
      edgeLabelBackground: "#ffffff",
      // mindmap branch palette — distinct hue per branch (matches the
      // reference "pastel rainbow" mind-map style, but soft & coherent)
      cScale0: "#dbeafe", // Variables · blue
      cScale1: "#cffafe", // Data types · cyan
      cScale2: "#fed7aa", // Operators · orange
      cScale3: "#ccfbf1", // Control flow · teal
      cScale4: "#dcfce7", // Functions · green
      cScale5: "#d9f99d", // I/O · lime
      cScale6: "#fef3c7", // Errors · amber
      cScale7: "#ede9fe", // Algorithms · violet
      cScale8: "#fce7f3", // Data structures · pink
      cScale9: "#dbeafe",
      cScale10: "#cffafe",
      cScale11: "#fed7aa",
      // dark inkable text for every branch
      cScaleLabel0: "#1e3a8a",
      cScaleLabel1: "#155e75",
      cScaleLabel2: "#9a3412",
      cScaleLabel3: "#115e59",
      cScaleLabel4: "#166534",
      cScaleLabel5: "#3f6212",
      cScaleLabel6: "#92400e",
      cScaleLabel7: "#5b21b6",
      cScaleLabel8: "#9d174d",
      cScaleLabel9: "#1e3a8a",
      cScaleLabel10: "#155e75",
      cScaleLabel11: "#9a3412",
      // matching borders/peers — saturated edge for visual anchoring
      cScalePeer0: "#3b82f6",
      cScalePeer1: "#06b6d4",
      cScalePeer2: "#f97316",
      cScalePeer3: "#14b8a6",
      cScalePeer4: "#22c55e",
      cScalePeer5: "#84cc16",
      cScalePeer6: "#f59e0b",
      cScalePeer7: "#8b5cf6",
      cScalePeer8: "#ec4899",
      // sequence diagrams
      actorBkg: "#eff6ff",
      actorBorder: "#1d4ed8",
      actorTextColor: "#1e3a8a",
      actorLineColor: "#94a3b8",
      signalColor: "#0f172a",
      signalTextColor: "#0f172a",
      labelBoxBkgColor: "#dbeafe",
      labelBoxBorderColor: "#1d4ed8",
      labelTextColor: "#1e3a8a",
      loopTextColor: "#1e3a8a",
      noteBorderColor: "#fbbf24",
      noteBkgColor: "#fef9c3",
      noteTextColor: "#78350f",
      activationBorderColor: "#1d4ed8",
      activationBkgColor: "#dbeafe",
      sequenceNumberColor: "#ffffff",
      // state diagrams
      altBackground: "#f8fafc",
      transitionColor: "#475569",
      transitionLabelColor: "#0f172a",
      stateBkg: "#eff6ff",
      stateBorder: "#1d4ed8",
      // quadrant chart
      quadrant1Fill: "#dbeafe",
      quadrant2Fill: "#e0f2fe",
      quadrant3Fill: "#e0e7ff",
      quadrant4Fill: "#eff6ff",
      quadrant1TextFill: "#1e3a8a",
      quadrant2TextFill: "#1e3a8a",
      quadrant3TextFill: "#1e3a8a",
      quadrant4TextFill: "#1e3a8a",
      quadrantPointFill: "#1d4ed8",
      quadrantPointTextFill: "#0f172a",
      quadrantXAxisTextFill: "#1e3a8a",
      quadrantYAxisTextFill: "#1e3a8a",
      quadrantInternalBorderStrokeFill: "#cbd5e1",
      quadrantExternalBorderStrokeFill: "#94a3b8",
      quadrantTitleFill: "#0f172a",
      fontSize: "20px",
    },
  });
  initialized = true;
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const id = "mmd-" + rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureInit();
    mermaid
      .render(id, chart)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);
        setError(null);
        setReady(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 overflow-x-auto rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-900">
        <div className="mb-2 font-semibold">Mermaid render error</div>
        <pre className="whitespace-pre-wrap">{error}</pre>
        <pre className="mt-2 whitespace-pre-wrap text-zinc-600">{chart}</pre>
      </div>
    );
  }

  return (
    <figure className="mermaid-host my-10 flex items-center justify-center overflow-x-auto rounded-2xl border border-blue-100 bg-white px-4 py-8 shadow-[0_1px_0_0_rgba(30,64,175,0.04),0_24px_48px_-28px_rgba(15,23,42,0.18)] md:px-8 md:py-10">
      <div
        ref={ref}
        className={`w-full text-center transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        } [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-[900px]`}
      />
    </figure>
  );
}
