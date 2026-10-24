import Link from 'next/link';

type LessonCardProps = {
  slug: string;
  title: string;
  titleUrdu: string;
  section: string;
  sectionUrdu: string;
  number: number;
  isComplete?: boolean;
  bestScore?: string;
};

export default function LessonCard({
  slug,
  title,
  titleUrdu,
  section,
  sectionUrdu,
  number,
  isComplete = false,
  bestScore,
}: LessonCardProps) {
  return (
    <Link
      href={`/lessons/${slug}`}
      className="group flex w-full items-center gap-3 rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--surface)] p-3 text-left shadow-[3px_3px_0_#1B2430] transition hover:-translate-y-0.5 hover:shadow-[1px_1px_0_#1B2430] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--section-parts)] text-sm font-bold text-[var(--ink)]">
        {number}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold text-[var(--ink)] sm:text-lg">{title}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{sectionUrdu}</span>
        </div>
        <p className="urdu-text mt-1 text-base text-[var(--muted)]">{titleUrdu}</p>
      </div>

      <div className="flex items-center gap-3">
        {bestScore ? (
          <span className="hidden rounded-[6px] border-[2px] border-[var(--border)] bg-[var(--section-grammar)] px-2 py-1 text-[11px] font-semibold text-[var(--ink)] md:inline-flex">
            Best: {bestScore}
          </span>
        ) : null}

        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border-[2px] border-[var(--border)] bg-[var(--surface)] text-lg font-bold text-[var(--primary)]">
          {isComplete ? '✓' : '→'}
        </span>
      </div>
    </Link>
  );
}
