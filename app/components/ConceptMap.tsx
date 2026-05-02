/* Static, hand-styled grid of the nine programming building blocks.
   Each block is a card with a title and a short sub-list of what lives
   under that idea. Used inside markdown via a ```concept-map fenced block. */

type Block = {
  id: string;
  emoji: string;
  title: string;
  example: string;
  items: string[];
  fill: string;
  border: string;
  text: string;
  textMuted: string;
  swatch: string;
  marker: string;
};

const BLOCKS: Block[] = [
  {
    id: "var",
    emoji: "🔵",
    title: "Variables",
    example: "age = 21",
    items: ["Declaration", "Assignment", "Scope", "Constants"],
    fill: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-900",
    textMuted: "text-blue-800/80",
    swatch: "bg-blue-500",
    marker: "marker:text-blue-500",
  },
  {
    id: "type",
    emoji: "🧊",
    title: "Data types",
    example: "int · str · bool · list",
    items: ["Numbers", "Strings", "Booleans", "Collections"],
    fill: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-900",
    textMuted: "text-orange-800/80",
    swatch: "bg-orange-500",
    marker: "marker:text-orange-500",
  },
  {
    id: "op",
    emoji: "➕",
    title: "Operators",
    example: "+ − × == and or",
    items: [
      "Arithmetic — + − × ÷ %",
      "Comparison — == != < >",
      "Logical — and · or · not",
      "Bitwise — & | ^ ~",
      "Assignment — = += -=",
    ],
    fill: "bg-cyan-50",
    border: "border-cyan-300",
    text: "text-cyan-900",
    textMuted: "text-cyan-800/80",
    swatch: "bg-cyan-500",
    marker: "marker:text-cyan-500",
  },
  {
    id: "ctrl",
    emoji: "🔀",
    title: "Control flow",
    example: "if · for · while",
    items: [
      "Sequence — break · continue",
      "Conditionals — if · elif · else",
      "Loops — for · while",
    ],
    fill: "bg-teal-50",
    border: "border-teal-300",
    text: "text-teal-900",
    textMuted: "text-teal-800/80",
    swatch: "bg-teal-500",
    marker: "marker:text-teal-500",
  },
  {
    id: "fn",
    emoji: "🛠️",
    title: "Functions",
    example: "def greet(name)",
    items: [
      "Definition — def · lambda",
      "Parameters — args · kwargs",
      "Return values",
      "Scope — local · global · closures",
      "Best practices — DRY · single purpose",
    ],
    fill: "bg-green-50",
    border: "border-green-300",
    text: "text-green-900",
    textMuted: "text-green-800/80",
    swatch: "bg-green-500",
    marker: "marker:text-green-500",
  },
  {
    id: "io",
    emoji: "📨",
    title: "Input / Output",
    example: "input() · print()",
    items: [
      "Input — keyboard · file · CLI · API",
      "Output — print · file · network",
      "Formatted output — f-strings",
    ],
    fill: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-900",
    textMuted: "text-amber-800/80",
    swatch: "bg-amber-500",
    marker: "marker:text-amber-500",
  },
  {
    id: "err",
    emoji: "⚠️",
    title: "Error handling",
    example: "try / except",
    items: [
      "try / except",
      "Catch by exception type",
      "else · finally blocks",
      "raise · custom errors",
    ],
    fill: "bg-violet-50",
    border: "border-violet-300",
    text: "text-violet-900",
    textMuted: "text-violet-800/80",
    swatch: "bg-violet-500",
    marker: "marker:text-violet-500",
  },
  {
    id: "algo",
    emoji: "🧮",
    title: "Algorithms",
    example: "sort · search · sum",
    items: [
      "Searching — linear · binary",
      "Sorting — bubble · merge · quick",
      "Techniques — recursion · DP · greedy",
    ],
    fill: "bg-pink-50",
    border: "border-pink-300",
    text: "text-pink-900",
    textMuted: "text-pink-800/80",
    swatch: "bg-pink-500",
    marker: "marker:text-pink-500",
  },
  {
    id: "ds",
    emoji: "🗂️",
    title: "Data structures",
    example: "list · dict · set · tree",
    items: [
      "Linear — list · stack · queue",
      "Associative — dict · hash table",
      "Tree-based — tree · heap · trie",
      "Graph",
    ],
    fill: "bg-indigo-50",
    border: "border-indigo-300",
    text: "text-indigo-900",
    textMuted: "text-indigo-800/80",
    swatch: "bg-indigo-500",
    marker: "marker:text-indigo-500",
  },
];

export function ConceptMap() {
  return (
    <figure className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BLOCKS.map((b, i) => (
        <div
          key={b.id}
          className={`relative flex h-full flex-col overflow-hidden rounded-xl border-2 ${b.border} ${b.fill} p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-18px_rgba(15,23,42,0.18)]`}
        >
          <div
            className={`absolute left-0 top-0 h-full w-1 ${b.swatch}`}
            aria-hidden
          />
          <div className="flex items-start gap-3 pl-2">
            <span className="text-2xl leading-none" aria-hidden>
              {b.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className={`font-serif text-lg font-bold ${b.text}`}>
                  {b.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full bg-white/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider ${b.text}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <code
                className={`mt-1 block font-mono text-[12px] ${b.textMuted}`}
              >
                {b.example}
              </code>
            </div>
          </div>
          <ul
            className={`mt-3 ml-2 list-disc space-y-1 pl-5 text-[12.5px] leading-snug ${b.textMuted} ${b.marker}`}
          >
            {b.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </figure>
  );
}
