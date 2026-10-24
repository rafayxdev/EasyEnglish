'use client';

import { useState } from 'react';
import ChatBox from '@/components/ChatBox';

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
        <div className="fixed bottom-4 right-3 z-50 w-[calc(100vw-1.5rem)] max-w-md sm:right-4 sm:w-[92vw]">
          <ChatBox isFloating initialOpen />
        </div>
      ) : null}
    </>
  );
}
