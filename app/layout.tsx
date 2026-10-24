import type { Metadata } from 'next';
import Link from 'next/link';
import { Lexend } from 'next/font/google';
import { Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import ChatButton from '@/components/ChatButton';
import LessonSwitcher from '@/components/LessonSwitcher';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'English Learning Website with Chatbot Assistant',
  description: 'EasyEnglish helps beginner students learn English with short lessons and a friendly chatbot assistant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${urdu.variable}`}>
      <body className="min-h-screen bg-[var(--bg)] pb-24 text-[var(--ink)] antialiased">
        <header className="sticky top-0 z-40 border-b-[2px] border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-2xl" aria-label="Go to home page">
                <span className="relative inline-block">
                  <span className="absolute -inset-x-1 -inset-y-1 -z-10 rounded-[4px] bg-[var(--highlight)]" />
                  <span className="relative">Easy</span>
                </span>
                <span>English</span>
              </Link>

              <nav className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--highlight)]"
                >
                  Home
                </Link>
              </nav>
            </div>

            <div className="w-full sm:max-w-[260px]">
              <LessonSwitcher />
            </div>
          </div>
        </header>

        {children}
        <ChatButton />
      </body>
    </html>
  );
}
