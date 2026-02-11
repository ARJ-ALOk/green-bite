import { useEffect, useRef, useState } from 'react';
import { getChatResponse } from '../services/groqApi';

const SYSTEM_PROMPT = 'You are a helpful cooking assistant.\nKeep answers SHORT and clear.\nUse bullet points when possible.\nAvoid long paragraphs.\nBe concise.\nUse simple language.\n\nFormat rules:\n- max 4-6 points\n- short sentences\n- easy steps\n- no long explanations';

export function ChatView({ initialMessage, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialMessage || '');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const sendMessage = async (content) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await getChatResponse(nextMessages, { systemPrompt: SYSTEM_PROMPT, timeoutMs: 15000 });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err?.message || 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
  };
  const didSendInitial = useRef(false);

useEffect(() => {
  if (initialMessage && !didSendInitial.current) {
    didSendInitial.current = true;
    sendMessage(initialMessage);
  }
}, [initialMessage]);

  // useEffect(() => {
  //   if (initialMessage) {
  //     sendMessage(initialMessage);
  //   }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="chatbot glass-card chatview">
      <div className="recipes-header">
        <h3>AI Chat</h3>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="chatbot-messages" ref={listRef}>
        {messages.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className={`chatbot-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="chatbot-loading">Typing...</div>}
      </div>
      <form className="chatbot-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask a cooking question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="icon-button" disabled={!input.trim() || loading}>
          <span className="icon-arrow">?</span>
        </button>
      </form>
    </div>
  );
}
