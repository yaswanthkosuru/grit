"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Mermaid } from "./Mermaid";
import { ConceptMap } from "./ConceptMap";

const components: Components = {
  h1: (props) => (
    <h1
      className="mt-10 mb-5 font-serif text-3xl font-bold leading-tight tracking-tight text-blue-950 md:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 mb-4 border-b border-dashed border-blue-200 pb-2 font-serif text-2xl font-bold tracking-tight text-blue-900 md:text-[1.75rem]"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-9 mb-3 font-serif text-xl font-semibold text-blue-900 md:text-2xl"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-7 mb-2 font-serif text-lg font-semibold text-blue-800"
      {...props}
    />
  ),
  h5: (props) => (
    <h5
      className="mt-6 mb-2 font-sans text-[15px] font-semibold uppercase tracking-[0.14em] text-blue-700"
      {...props}
    />
  ),
  h6: (props) => (
    <h6
      className="mt-6 mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="my-4 text-[15.5px] leading-[1.85] text-slate-700"
      {...props}
    />
  ),
  a: ({ href, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="font-medium text-blue-700 underline decoration-blue-300 decoration-1 underline-offset-[3px] transition-colors hover:text-blue-900 hover:decoration-blue-500"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-slate-900" {...props} />
  ),
  em: (props) => <em className="italic text-slate-800" {...props} />,
  ul: (props) => (
    <ul
      className="my-4 ml-6 list-disc space-y-1.5 text-[15.5px] leading-[1.8] text-slate-700 marker:text-blue-400"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-4 ml-6 list-decimal space-y-1.5 text-[15.5px] leading-[1.8] text-slate-700 marker:font-semibold marker:text-blue-600"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 rounded-r-lg border-l-[3px] border-blue-500 bg-blue-50/80 px-5 py-3 font-handwritten text-[1.35rem] leading-snug tracking-wide text-slate-800"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-10 border-0 border-t border-dashed border-blue-200" />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-blue-100 shadow-[0_1px_0_0_rgba(30,64,175,0.04)]">
      <table
        className="w-full border-collapse text-[14px] text-slate-700"
        {...props}
      />
    </div>
  ),
  thead: (props) => (
    <thead
      className="bg-blue-50/80 text-left text-[12.5px] font-semibold uppercase tracking-[0.08em] text-blue-900"
      {...props}
    />
  ),
  tbody: (props) => <tbody className="divide-y divide-blue-100" {...props} />,
  tr: (props) => <tr className="hover:bg-blue-50/40" {...props} />,
  th: (props) => <th className="px-3.5 py-2.5 align-bottom" {...props} />,
  td: (props) => (
    <td className="px-3.5 py-2.5 align-top leading-relaxed" {...props} />
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className="my-5 rounded-lg border border-blue-100 shadow-sm"
      {...props}
    />
  ),
  pre: ({ children }) => {
    // If the inner code block is a mermaid diagram, skip the dark <pre>
    // wrapper — Mermaid renders its own card.
    const child = Array.isArray(children) ? children[0] : children;
    const isCustomBlock =
      child &&
      typeof child === "object" &&
      "props" in child &&
      /language-(mermaid|concept-map)/.test(
        (child as { props?: { className?: string } }).props?.className ?? ""
      );
    if (isCustomBlock) return <>{children}</>;
    return (
      <pre className="my-5 overflow-x-auto rounded-lg border border-blue-100 bg-[#f3efe2] px-5 py-4 text-[13.5px] leading-relaxed text-slate-900 shadow-[inset_3px_0_0_0_#1d4ed8]">
        {children}
      </pre>
    );
  },
  code({ className, children, ...props }) {
    const text = String(children ?? "").replace(/\n$/, "");
    const match = /language-([\w-]+)/.exec(className || "");
    const lang = match?.[1];

    if (lang === "mermaid") {
      return <Mermaid chart={text} />;
    }
    if (lang === "concept-map") {
      return <ConceptMap />;
    }

    const isInline = !lang && !text.includes("\n");
    if (isInline) {
      return (
        <code
          className="rounded border border-blue-100 bg-blue-50 px-1.5 py-[2px] font-mono text-[0.86em] text-blue-900"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={`${className ?? ""} font-mono text-[13.5px] leading-relaxed text-slate-900`}
        {...props}
      >
        {children}
      </code>
    );
  },
};

export function MarkdownView({ content }: { content: string }) {
  // Drop a leading H1 — the page already shows the file title above the body.
  const cleaned = content.replace(/^\s*#\s+.+\n+/, "");
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={components}
    >
      {cleaned}
    </ReactMarkdown>
  );
}
