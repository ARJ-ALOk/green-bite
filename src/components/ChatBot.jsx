import { useEffect, useRef, useState } from 'react';
import { ChatView } from './ChatView';

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef(null);
  const welcomeMessage =
    'Hi! I am here to assist with any meal ideas, recipes, or ingredient questions. Ask me anything.';

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event) => {
      if (!launcherRef.current) return;
      if (!launcherRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="chatbot-launcher" ref={launcherRef}>
      <button
        type="button"
        className="chatbot-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="chatbot-popover"
      >
        Chat
      </button>
      <div
        id="chatbot-popover"
        className={`chatbot-popover ${open ? 'open' : ''}`}
        role="dialog"
        aria-label="Chat assistant"
        aria-hidden={!open}
      >
        <ChatView welcomeMessage={welcomeMessage} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
