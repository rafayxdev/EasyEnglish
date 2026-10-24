'use client';

import { useEffect, useMemo, useState } from 'react';

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type QuizProps = {
  questions: QuizQuestion[];
};

function shuffleArray<T>(items: T[]) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}

function buildQuestionPool(questions: QuizQuestion[]) {
  const base = questions.map((question) => ({
    ...question,
    options: [...question.options],
  }));

  if (base.length === 0) {
    return [];
  }

  const pool: QuizQuestion[] = [...base];
  const reviewPrompts = [
    'Quick review:',
    'Choose the best answer:',
    'Revision check:',
    'Practice question:',
    'Remember this:',
  ];

  for (let index = 0; pool.length < 20 && index < base.length; index += 1) {
    const question = base[index];
    const prompt = reviewPrompts[index % reviewPrompts.length];
    pool.push({
      ...question,
      question: `${prompt} ${question.question}`,
    });
  }

  while (pool.length < 20) {
    const question = base[pool.length % base.length];
    pool.push({
      ...question,
      question: `Review round: ${question.question}`,
    });
  }

  return pool.slice(0, 20);
}

function createRandomSet(questions: QuizQuestion[]) {
  if (questions.length === 0) {
    return [];
  }

  return shuffleArray(buildQuestionPool(questions)).slice(0, Math.min(5, questions.length));
}

export default function Quiz({ questions }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(() => questions.slice(0, Math.min(5, questions.length)));

  useEffect(() => {
    setActiveQuestions(createRandomSet(questions));
    setSelectedAnswers({});
    setShowResults(false);
  }, [questions]);

  const score = useMemo(() => {
    return activeQuestions.reduce((total, question, index) => {
      if (selectedAnswers[index] === question.answer) {
        return total + 1;
      }
      return total;
    }, 0);
  }, [activeQuestions, selectedAnswers]);

  const handleOptionClick = (questionIndex: number, option: string) => {
    setSelectedAnswers((current) => ({ ...current, [questionIndex]: option }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setActiveQuestions(createRandomSet(questions));
  };

  return (
    <div className="space-y-6 border-[2px] border-[var(--border)] bg-[var(--surface)] p-4 shadow-[3px_3px_0_#1B2430] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-[var(--ink)]">Quiz</h3>
          <p className="text-sm font-medium text-[var(--muted)]">{activeQuestions.length} random questions from a larger review bank</p>
        </div>
        <button
          type="button"
          onClick={resetQuiz}
          className="notebook-button bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
        >
          New set
        </button>
      </div>

      {activeQuestions.map((question, index) => {
        const selected = selectedAnswers[index];
        const isCorrect = selected === question.answer;
        const reveal = selected !== undefined;

        return (
          <div key={`${question.question}-${index}`} className="border-[2px] border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-base font-semibold text-[var(--ink)]">
              {index + 1}. {question.question}
            </p>

            <div className="mt-3 grid gap-2">
              {question.options.map((option) => {
                const isSelected = selected === option;
                const showCorrect = reveal && option === question.answer;
                const showWrong = reveal && isSelected && !isCorrect;

                let classes = 'w-full border-[2px] border-[var(--border)] px-3 py-3 text-left text-sm font-medium transition';

                if (showCorrect) {
                  classes += ' bg-[var(--section-grammar)] text-[var(--ink)]';
                } else if (showWrong) {
                  classes += ' bg-[#FDECEC] text-[var(--danger)]';
                } else if (isSelected) {
                  classes += ' bg-[var(--section-parts)] text-[var(--ink)]';
                } else {
                  classes += ' bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--section-parts)]';
                }

                return (
                  <button
                    key={`${question.question}-${option}`}
                    type="button"
                    onClick={() => handleOptionClick(index, option)}
                    className={classes}
                    disabled={reveal}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {reveal ? (
              <p className={`mt-3 text-sm font-semibold ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {isCorrect ? 'Correct ✓' : `Wrong ✕ Correct answer: ${question.answer}`}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="border-[2px] border-[var(--border)] bg-[var(--section-grammar)] p-4 text-[var(--ink)]">
        <p className="text-sm font-medium">Your score</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-3xl font-black text-[var(--primary)]">
            {score}/{activeQuestions.length}
          </span>
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="notebook-button bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Finish
          </button>
        </div>
        {showResults ? (
          <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
            {score === activeQuestions.length
              ? 'Excellent! You got every answer correct.'
              : score >= Math.ceil(activeQuestions.length / 2)
                ? 'Good job! You are learning well.'
                : 'Keep practicing. You will improve soon.'}
          </p>
        ) : null}
      </div>
    </div>
  );
}
