'use client';

import { useRouter } from 'next/navigation';
import lessonsData from '@/data/lessons.json';

const lessons = lessonsData as Array<{
  slug: string;
  title: string;
  titleUrdu: string;
}>;

export default function LessonSwitcher() {
  const router = useRouter();

  return (
    <div className="w-full min-w-0 sm:w-auto">
      <label htmlFor="lessonSwitcher" className="sr-only">
        Select lesson
      </label>
      <select
        id="lessonSwitcher"
        defaultValue=""
        onChange={(event) => {
          const value = event.target.value;
          if (value) {
            router.push(`/lessons/${value}`);
          }
        }}
        className="min-h-[42px] w-full rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] shadow-[2px_2px_0_#1B2430] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 sm:w-[185px]"
      >
        <option value="">Select lesson</option>
        {lessons.map((lesson) => (
          <option key={lesson.slug} value={lesson.slug}>
            {lesson.title}
          </option>
        ))}
      </select>
    </div>
  );
}
