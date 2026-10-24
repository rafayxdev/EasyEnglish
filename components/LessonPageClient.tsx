'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Quiz from '@/components/Quiz';
import { safeLocalStorageGet, safeLocalStorageSet } from '@/lib/storage';

type Lesson = {
  slug: string;
  title: string;
  titleUrdu: string;
  section: string;
  sectionUrdu: string;
  description: string;
  descriptionUrdu: string;
  explanation: {
    english: string;
    urdu: string;
  };
  examples: Array<{
    english: string;
    urdu: string;
  }>;
  remember: {
    english: string;
    urdu: string;
  };
  quiz: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
};

const STORAGE_PREFIX = 'easyenglish_completed_';

export default function LessonPageClient({ lesson, lessons }: { lesson: Lesson; lessons: Lesson[] }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const saved = safeLocalStorageGet(`${STORAGE_PREFIX}${lesson.slug}`);
    setCompleted(saved === 'true');
  }, [lesson.slug]);

  const currentIndex = useMemo(() => lessons.findIndex((item) => item.slug === lesson.slug), [lesson.slug, lessons]);
  const previousLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  const toggleComplete = () => {
    const nextState = !completed;
    setCompleted(nextState);
    const saved = safeLocalStorageSet(`${STORAGE_PREFIX}${lesson.slug}`, String(nextState));
    if (!saved) {
      console.warn('localStorage unavailable');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm font-medium text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="text-[var(--primary)] underline-offset-4 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>{lesson.section}</span>
          <span>/</span>
          <span className="text-[var(--ink)]">{lesson.title}</span>
        </div>
      </nav>

      <section className="notebook-card p-4 sm:p-6">
        <div className="mb-4 inline-flex items-center rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--section-parts)] px-3 py-1.5 text-sm font-bold text-[var(--ink)]">
          {lesson.section} / {lesson.sectionUrdu}
        </div>

        <h1 className="text-[clamp(2rem,3vw,2.7rem)] font-bold text-[var(--ink)]">{lesson.title}</h1>
        <p className="urdu-text mt-2 text-[var(--ink)]">{lesson.titleUrdu}</p>

        <div className="mt-6 border-[2px] border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="text-xl font-bold text-[var(--ink)]">Lesson explanation</h2>
          <p className="mt-3 text-[17px] leading-[1.7] text-[var(--ink)]">{lesson.explanation.english}</p>
          <p className="urdu-text mt-3 text-[var(--ink)]">{lesson.explanation.urdu}</p>
        </div>

        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-bold text-[var(--ink)]">Examples</h2>
          {lesson.examples.map((example, index) => (
            <div key={`${example.english}-${index}`} className="border-[2px] border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-[17px] leading-[1.7] text-[var(--ink)]">{example.english}</p>
              <p className="urdu-text mt-2 text-[var(--ink)]">{example.urdu}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-[2px] border-[var(--border)] bg-[var(--highlight)] p-4">
          <h3 className="text-xl font-bold text-[var(--ink)]">Remember</h3>
          <p className="mt-2 text-[17px] leading-[1.7] text-[var(--ink)]">{lesson.remember.english}</p>
          <p className="urdu-text mt-2 text-[var(--ink)]">{lesson.remember.urdu}</p>
        </div>

        <div className="mt-8">
          <Quiz questions={lesson.quiz} />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t-[2px] border-[var(--border)] bg-[var(--bg)] p-3 sm:static sm:mt-8 sm:p-0">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-between sm:gap-3">
          {previousLesson ? (
            <Link
              href={`/lessons/${previousLesson.slug}`}
              className="notebook-button flex-1 justify-center bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              Previous
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}

          <button
            type="button"
            onClick={toggleComplete}
            className={`notebook-button flex-1 justify-center px-4 py-3 text-sm font-semibold ${
              completed ? 'bg-[var(--success)] text-white' : 'bg-[var(--primary)] text-white'
            }`}
          >
            {completed ? 'Completed' : 'Mark as complete'}
          </button>

          {nextLesson ? (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="notebook-button flex-1 justify-center bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              Next
            </Link>
          ) : (
            <Link
              href="/"
              className="notebook-button flex-1 justify-center bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
