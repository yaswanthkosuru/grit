/* Lightweight YouTube embed — uses youtube-nocookie + lazy-load. */

function extractId(input: string): string | null {
  const trimmed = input.trim();
  // Plain 11-char video id (the standard YouTube length)
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  // Any URL form: youtube.com/watch?v=, youtu.be/, embed/, shorts/
  const m =
    /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/.exec(trimmed);
  return m ? m[1] : null;
}

export function YouTube({ raw }: { raw: string }) {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const id = extractId(lines[0] ?? "");
  const title = lines.slice(1).join(" ").trim();

  if (!id) {
    return (
      <div className="my-6 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-900">
        Could not parse YouTube ID from: <code className="font-mono">{raw}</code>
      </div>
    );
  }

  return (
    <figure className="my-8 touch-pan-y overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_1px_0_0_rgba(30,64,175,0.04),0_24px_48px_-28px_rgba(15,23,42,0.18)]">
      <div className="relative aspect-video w-full touch-pan-y bg-slate-100">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={title || "YouTube video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
          style={{ touchAction: "pan-y" }}
        />
      </div>
      {title && (
        <figcaption className="border-t border-blue-100 bg-[#fbfaf4] px-4 py-2.5 text-[12.5px] text-slate-700">
          ▶ {title}
        </figcaption>
      )}
    </figure>
  );
}
