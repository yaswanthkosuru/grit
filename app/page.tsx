import Link from "next/link";
import { getSyllabus } from "./lib/content";

export default async function Home() {
  const sections = await getSyllabus();
  const first = sections.find((s) => s.files.length > 0);
  const totalNotes = sections.reduce((n, s) => n + s.files.length, 0);

  return (
    <div className="min-h-screen bg-[#fbfaf4]">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <p className="font-handwritten text-2xl leading-none text-blue-700">
          Grit · Sadhinchu
        </p>
        <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.05] tracking-tight text-blue-950 md:text-6xl">
          Python Syllabus
        </h1>
        <div className="mt-5 h-[3px] w-20 rounded-full bg-blue-600" />
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
          A complete learning path from prerequisites to advanced patterns —{" "}
          <span className="font-semibold text-blue-900">
            {sections.length} modules
          </span>{" "}
          covering{" "}
          <span className="font-semibold text-blue-900">
            {totalNotes} lessons
          </span>
          . Pick a topic from the sidebar, or jump in below.
        </p>

        {first && first.files[0] && (
          <Link
            href={first.files[0].href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(29,78,216,0.55)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Start with {first.files[0].title}
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M4 10h12m0 0-4-4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <section
              key={section.name}
              className="rounded-xl border border-blue-100 bg-white p-5 shadow-[0_1px_0_0_rgba(30,64,175,0.04),0_8px_24px_-18px_rgba(15,23,42,0.12)]"
            >
              <h2 className="mb-3 font-serif text-base font-bold tracking-tight text-blue-900">
                {section.title}
              </h2>
              <ul className="space-y-1.5">
                {section.files.map((file) => (
                  <li key={file.href}>
                    <Link
                      href={file.href}
                      className="block truncate text-[13px] text-slate-600 transition-colors hover:text-blue-700"
                    >
                      {file.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
