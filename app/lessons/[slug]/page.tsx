import { notFound } from 'next/navigation';
import LessonPageClient from '@/components/LessonPageClient';
import lessonsData from '@/data/lessons.json';

const lessons = lessonsData as Lesson[];

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

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = lessons.find((item) => item.slug === params.slug);

  if (!lesson) {
    notFound();
  }

  return <LessonPageClient lesson={lesson} lessons={lessons} />;
}
