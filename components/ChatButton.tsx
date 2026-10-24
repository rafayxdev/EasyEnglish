'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const ChatBox = dynamic(() => import('@/components/ChatBox'), {
  ssr: false,
});

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="notebook-button fixed bottom-5 right-4 z-50 bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          Assistant
        </button>
      ) : null}

      {open ? (
        <div className="fixed bottom-3 right-2 z-50 w-[calc(100vw-1rem)] max-w-2xl sm:bottom-4 sm:right-4 sm:w-[min(92vw,640px)]">
          <ChatBox isFloating initialOpen />
        </div>
      ) : null}
    </>
  );
}
