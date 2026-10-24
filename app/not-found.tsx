import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="notebook-card max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--ink)]">Page not found</h1>
        <p className="mt-3 text-[var(--muted)]">This lesson is not available yet.</p>
        <Link
          href="/"
          className="notebook-button mt-6 bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
