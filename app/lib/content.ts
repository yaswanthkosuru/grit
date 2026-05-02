import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "app", "content");

export type ContentFile = {
  slug: [string, string];
  href: string;
  title: string;
  fileName: string;
};

export type ContentSection = {
  name: string;
  title: string;
  files: ContentFile[];
};

type SortKey = [number, string];

function parsePrefix(name: string): { prefix: string | null; rest: string; sortKey: SortKey } {
  const match = /^([\dA-Za-z]+)\.(.+)$/.exec(name);
  if (match) {
    const [, prefix, rest] = match;
    if (/^\d+$/.test(prefix)) {
      return { prefix, rest, sortKey: [parseInt(prefix, 10), rest] };
    }
    return { prefix, rest, sortKey: [10_000 + prefix.toUpperCase().charCodeAt(0), rest] };
  }
  return { prefix: null, rest: name, sortKey: [100_000, name] };
}

function titleize(rest: string): string {
  return rest
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileTitle(fileName: string): string {
  const base = fileName.replace(/\.md$/, "");
  const { prefix, rest } = parsePrefix(base);
  const t = titleize(rest);
  return prefix ? `${prefix}. ${t}` : t;
}

function sectionTitle(folderName: string): string {
  const { prefix, rest } = parsePrefix(folderName);
  const t = titleize(rest);
  return prefix ? `${prefix}. ${t}` : t;
}

export async function getSyllabus(): Promise<ContentSection[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());

  const sections = await Promise.all(
    dirs.map(async (dir) => {
      const fullDir = path.join(CONTENT_DIR, dir.name);
      const fileEntries = await fs.readdir(fullDir, { withFileTypes: true });
      const files: (ContentFile & { sortKey: SortKey })[] = fileEntries
        .filter((f) => f.isFile() && f.name.endsWith(".md"))
        .map((f) => {
          const base = f.name.replace(/\.md$/, "");
          return {
            slug: [dir.name, base] as [string, string],
            href: `/python/notes/${dir.name}/${base}`,
            title: fileTitle(f.name),
            fileName: f.name,
            sortKey: parsePrefix(base).sortKey,
          };
        })
        .sort(
          (a, b) =>
            a.sortKey[0] - b.sortKey[0] || a.sortKey[1].localeCompare(b.sortKey[1])
        );

      return {
        name: dir.name,
        title: sectionTitle(dir.name),
        files: files.map((f) => ({
          slug: f.slug,
          href: f.href,
          title: f.title,
          fileName: f.fileName,
        })),
        sortKey: parsePrefix(dir.name).sortKey,
      };
    })
  );

  return sections
    .sort(
      (a, b) =>
        a.sortKey[0] - b.sortKey[0] || a.sortKey[1].localeCompare(b.sortKey[1])
    )
    .map((s) => ({ name: s.name, title: s.title, files: s.files }));
}

export type FlatNote = {
  href: string;
  title: string;
  sectionTitle: string;
  prev: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
};

export async function getFlatNotes(): Promise<FlatNote[]> {
  const sections = await getSyllabus();
  const flat: { href: string; title: string; sectionTitle: string }[] = [];
  for (const s of sections) {
    for (const f of s.files) {
      flat.push({ href: f.href, title: f.title, sectionTitle: s.title });
    }
  }
  return flat.map((entry, i) => ({
    ...entry,
    prev: i > 0 ? { href: flat[i - 1].href, title: flat[i - 1].title } : null,
    next:
      i < flat.length - 1
        ? { href: flat[i + 1].href, title: flat[i + 1].title }
        : null,
  }));
}

export async function getNote(
  slug: string[]
): Promise<{ title: string; sectionTitle: string; raw: string } | null> {
  if (slug.length !== 2) return null;
  const [section, file] = slug;
  if (
    section.includes("..") ||
    file.includes("..") ||
    section.includes("/") ||
    file.includes("/") ||
    section.includes("\\") ||
    file.includes("\\")
  ) {
    return null;
  }
  const filePath = path.join(CONTENT_DIR, section, `${file}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return {
      title: fileTitle(`${file}.md`),
      sectionTitle: sectionTitle(section),
      raw,
    };
  } catch {
    return null;
  }
}
