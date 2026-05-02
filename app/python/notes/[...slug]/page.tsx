import { notFound } from "next/navigation";
import Link from "next/link";
import { getFlatNotes, getNote, getSyllabus } from "../../../lib/content";
import { NoteContent } from "../../../components/NoteContent";

export async function generateStaticParams() {
  const sections = await getSyllabus();
  return sections.flatMap((s) =>
    s.files.map((f) => ({ slug: [s.name, f.slug[1]] }))
  );
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();

  const flat = await getFlatNotes();
  const href = `/python/notes/${slug.join("/")}`;
  const current = flat.find((n) => n.href === href);

  return (
    <div className="relative min-h-screen bg-[#fbfaf4]">
      {/* faint left margin line — notebook feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[1px] bg-gradient-to-b from-transparent via-rose-200 to-transparent md:block md:left-[6%]"
      />

      <article className="relative mx-auto w-full max-w-3xl px-6 py-12 md:px-12 md:py-16">
        <header className="mb-10">
          <p className="mb-3 font-handwritten text-[1.35rem] leading-none text-blue-700">
            {note.sectionTitle}
          </p>
          <h1 className="font-serif text-[2.25rem] font-bold leading-[1.1] tracking-tight text-blue-950 md:text-[2.75rem]">
            {note.title}
          </h1>
          <div className="mt-5 h-[3px] w-16 rounded-full bg-blue-600" />
        </header>

        <NoteContent
          content={note.raw}
          pager={
            current && (current.prev || current.next) ? (
              <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-dashed border-blue-200 pt-6 sm:grid-cols-2">
                {current.prev ? (
                  <Link
                    href={current.prev.href}
                    className="group flex flex-col rounded-lg border border-blue-100 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]"
                  >
                    <span className="font-handwritten text-[1rem] text-blue-600">
                      ← previous
                    </span>
                    <span className="mt-1 truncate text-sm font-semibold text-slate-800 group-hover:text-blue-900">
                      {current.prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {current.next ? (
                  <Link
                    href={current.next.href}
                    className="group flex flex-col rounded-lg border border-blue-100 bg-white px-4 py-3 text-right transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] sm:col-start-2"
                  >
                    <span className="font-handwritten text-[1rem] text-blue-600">
                      next →
                    </span>
                    <span className="mt-1 truncate text-sm font-semibold text-slate-800 group-hover:text-blue-900">
                      {current.next.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            ) : null
          }
        />
      </article>
    </div>
  );
}
