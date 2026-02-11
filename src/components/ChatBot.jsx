import { useState } from 'react';
import { ChatView } from './ChatView';

export function ChatBot() {
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInitialMessage(trimmed);
    setInput('');
    setShowChat(true);
  };

  if (showChat) {
    return (
      <ChatView
        initialMessage={initialMessage}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <div className="chatbot glass-card">
      <h3>AI Chat</h3>
      <form className="chatbot-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask a cooking question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="icon-button" disabled={!input.trim()}>
          <span className="icon-arrow">↑</span>
        </button>
      </form>
    </div>
  );
}
