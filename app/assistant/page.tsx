import Link from 'next/link';
import ChatBox from '@/components/ChatBox';

export default function AssistantPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 border-[2px] border-[var(--border)] bg-[var(--surface)] p-4 shadow-[3px_3px_0_#1B2430]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Assistant</p>
            <h1 className="mt-2 text-2xl font-bold text-[var(--ink)]">Ask a question</h1>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-[42px] items-center justify-center rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--highlight)]"
          >
            Home
          </Link>
        </div>
      </div>
      <ChatBox />
    </main>
  );
}
