'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageRemove, safeLocalStorageSet } from '@/lib/storage';

export type ChatItem = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  compact?: boolean;
  isFloating?: boolean;
  initialOpen?: boolean;
};

const STORAGE_KEY = 'easyenglish_chat';
const MAX_MESSAGES = 50;

export default function ChatBox({ compact = false, isFloating = false, initialOpen = false }: Props) {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [canUseStorage, setCanUseStorage] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const quickActions = useMemo(
    () => [
      'Translate to Urdu',
      'Translate to English',
      'Check my sentence',
      'Explain this word',
      'Write for me',
    ],
    [],
  );

  useEffect(() => {
    try {
      const stored = safeLocalStorageGet(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatItem[];
        if (Array.isArray(parsed)) {
          setMessages(parsed.slice(-MAX_MESSAGES));
        }
      }
    } catch {
      setCanUseStorage(false);
    }
  }, []);

  useEffect(() => {
    if (!canUseStorage) {
      return;
    }

    const trimmed = messages.slice(-MAX_MESSAGES);
    const data = JSON.stringify(trimmed);
    safeLocalStorageSet(STORAGE_KEY, data);
  }, [messages, canUseStorage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const saveHistory = (nextMessages: ChatItem[]) => {
    if (!canUseStorage) {
      return;
    }

    const trimmed = nextMessages.slice(-MAX_MESSAGES);
    const value = JSON.stringify(trimmed);
    safeLocalStorageSet(STORAGE_KEY, value);
  };

  const getCurrentLessonName = () => {
    if (typeof window === 'undefined') {
      return '';
    }

    const path = window.location.pathname;
    if (!path.startsWith('/lessons/')) {
      return '';
    }

    const slug = path.replace('/lessons/', '').split('/')[0];
    if (!slug) {
      return '';
    }

    return slug
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const sendMessage = async (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text || loading) return;

    const userMessage: ChatItem = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    saveHistory(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const recent = nextMessages.slice(-6);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recent,
          taskType: inferTaskType(text),
          lessonName: getCurrentLessonName(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed');
      }

      const data = (await res.json()) as { reply?: string };
      const reply = data.reply ?? 'Something went wrong. Please try again.';
      const assistantReply: ChatItem = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
      };

      const updated = [...nextMessages, assistantReply];
      setMessages(updated);
      saveHistory(updated);
    } catch {
      const fallback: ChatItem = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
      };

      const updated = [...nextMessages, fallback];
      setMessages(updated);
      saveHistory(updated);
    } finally {
      setLoading(false);
    }
  };

  const inferTaskType = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('translate to urdu')) return 'TRANSLATE_TO_URDU';
    if (lower.includes('translate to english')) return 'TRANSLATE_TO_ENGLISH';
    if (lower.includes('check my sentence') || lower.includes('check sentence') || lower.includes('correct my sentence'))
      return 'CHECK_SENTENCE';
    if (lower.includes('explain this word') || lower.includes('what is')) return 'EXPLAIN_WORD';
    if (lower.includes('write')) return 'WRITE';
    return 'GENERAL';
  };

  const clearChat = () => {
    if (!confirm('Clear all saved chat history?')) return;
    setMessages([]);
    if (canUseStorage) {
      safeLocalStorageRemove(STORAGE_KEY);
    }
  };

  const panelClass = compact
    ? 'border-[2px] border-[var(--border)] bg-[var(--surface)] p-4 shadow-[3px_3px_0_#1B2430]'
    : 'flex h-[min(82vh,760px)] min-h-[520px] flex-col overflow-hidden border-[2px] border-[var(--border)] bg-[var(--surface)] shadow-[3px_3px_0_#1B2430]';

  if (isFloating && !isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-brand-700"
      >
        💬 Assistant
      </button>
    );
  }

  return (
    <div className={panelClass}>
      {!compact ? (
        <div className="flex items-center justify-between border-b-[2px] border-[var(--border)] p-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">EasyEnglish Assistant</h2>
            <p className="text-sm text-[var(--muted)]">Ask any English question</p>
          </div>
          {isFloating ? (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="notebook-button bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
            >
              Close
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="border-b-[2px] border-[var(--border)] px-3 py-2">
        <button
          type="button"
          onClick={() => setShowQuickActions((current) => !current)}
          className="inline-flex min-h-[36px] items-center gap-2 rounded-[8px] border-[2px] border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] transition hover:bg-[var(--section-parts)]"
          aria-expanded={showQuickActions}
        >
          <span aria-hidden="true">{showQuickActions ? '−' : '+'}</span>
          Suggestions
        </button>

        {showQuickActions ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                type="button"
                key={action}
                onClick={() => {
                  setShowQuickActions(false);
                  sendMessage(action);
                }}
                className="border-[2px] border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--ink)] transition hover:bg-[var(--section-parts)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-xs"
                disabled={loading}
              >
                {action}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div ref={scrollRef} className="chat-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
        {messages.length === 0 ? (
          <div className="border-[2px] border-dashed border-[var(--border)] bg-[var(--section-parts)] p-4 text-sm text-[var(--muted)]">
            Ask a question in English or use a quick button.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[92%] whitespace-pre-wrap rounded-[10px] border-[2px] border-[var(--border)] px-3 py-2.5 text-sm leading-6 ${
                message.role === 'user'
                  ? 'ml-auto bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--ink)]'
              }`}
            >
              {message.content}
            </div>
          ))
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500" />
            <span className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500 [animation-delay:0.15s]" />
            <span className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500 [animation-delay:0.3s]" />
            Thinking...
          </div>
        ) : null}
      </div>

      <div className="border-t-[2px] border-[var(--border)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={clearChat}
            className="text-xs font-semibold text-[var(--danger)] transition hover:text-[var(--danger)]"
          >
            Clear chat
          </button>
          <span className="text-[11px] text-slate-400">{messages.length}/50</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 500))}
            rows={2}
            maxLength={500}
            placeholder="Type your English question..."
            className="flex-1 resize-none rounded-[10px] border-[2px] border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none ring-0 transition focus:bg-[var(--section-parts)]"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="notebook-button bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#B9C7C2]"
          >
            Send
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-500">
          AI can make mistakes. Ask your teacher if you are unsure.
        </p>
      </div>
    </div>
  );
}
