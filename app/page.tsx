'use client';

import { useEffect, useMemo, useState } from 'react';
import LessonCard from '@/components/LessonCard';
import { safeLocalStorageGet } from '@/lib/storage';
import lessonsData from '@/data/lessons.json';

const lessons = lessonsData as Array<{
  slug: string;
  title: string;
  titleUrdu: string;
  section: string;
  sectionUrdu: string;
}>;

const totalTargetLessons = lessons.length;

const sectionStyles: Record<string, { label: string; tint: string }> = {
  'Parts of Speech': { label: 'Parts of Speech', tint: 'bg-[var(--section-parts)]' },
  Grammar: { label: 'Grammar', tint: 'bg-[var(--section-grammar)]' },
  Punctuation: { label: 'Punctuation', tint: 'bg-[var(--section-punctuation)]' },
};

function keyForLesson(slug: string) {
  return `easyenglish_completed_${slug}`;
}

function groupLessonsBySection(items: typeof lessons) {
  const grouped: Record<string, typeof items> = {};

  items.forEach((lesson) => {
    if (!grouped[lesson.section]) {
      grouped[lesson.section] = [];
    }
    grouped[lesson.section].push(lesson);
  });

  return grouped;
}

export default function HomePage() {
  const [completedLessonSlugs, setCompletedLessonSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const slugs = lessons
        .map((lesson) => lesson.slug)
        .filter((slug) => safeLocalStorageGet(keyForLesson(slug)) === 'true');
      setCompletedLessonSlugs(slugs);
    } catch {
      setCompletedLessonSlugs([]);
    }
  }, []);

  const grouped = useMemo(() => groupLessonsBySection(lessons), []);
  const totalDone = completedLessonSlugs.length;
  const progress = Math.min((totalDone / totalTargetLessons) * 100, 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="notebook-card p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">EasyEnglish</p>
        <p className="mt-3 text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-[var(--ink)]">
          Learn English step by step. Ask the assistant when you are stuck.
        </p>

        <div className="mt-5 border-[2px] border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-[var(--ink)]">
            <span>{totalDone} of {totalTargetLessons} lessons done</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden border-[2px] border-[var(--border)] bg-[var(--surface)]">
            <div className="h-full bg-[var(--primary)]" style={{ width: `${progress}%` }} />
          </div>
        </div>

      </section>

      <section className="mt-6 space-y-6">
        {Object.entries(grouped).map(([section, sectionLessons]) => {
          const sectionMeta = sectionStyles[section] ?? { label: section, tint: 'bg-[var(--section-parts)]' };

          return (
            <div key={section} className="space-y-3">
              <div className={`inline-flex items-center rounded-[10px] border-[2px] border-[var(--border)] px-3 py-1.5 text-sm font-bold ${sectionMeta.tint}`}>
                {sectionMeta.label}
              </div>

              <div className="space-y-3">
                {sectionLessons.map((lesson, index) => (
                  <LessonCard
                    key={lesson.slug}
                    slug={lesson.slug}
                    title={lesson.title}
                    titleUrdu={lesson.titleUrdu}
                    section={lesson.section}
                    sectionUrdu={lesson.sectionUrdu}
                    number={index + 1}
                    isComplete={completedLessonSlugs.includes(lesson.slug)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
