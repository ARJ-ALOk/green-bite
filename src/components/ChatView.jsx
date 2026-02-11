import { useEffect, useRef, useState } from 'react';
import { getChatResponse } from '../services/groqApi';

const SYSTEM_PROMPT = [
  'You are a helpful cooking assistant.',
  'Answer directly and stay relevant to the question.',
  'Do not start replies with filler like "Here is your meal idea".',
  'If the user mentions hostel/dorm/student/budget, prioritize low-cost, minimal equipment, and common pantry ingredients.',
  'Avoid expensive or rare items unless the user asks for them.',
  'Be accurate and realistic: do not invent ingredients, steps, or claims.',
  'If the request is unclear or missing key details (budget, equipment, servings), ask 1-2 short clarifying questions.',
  'Adapt the format to the request:',
  '- If the user asks for a table or comparison, return a markdown table.',
  '- If the user asks for steps or instructions, use numbered steps.',
  '- If the user asks for a list, use short bullet points, one item per line.',
  '- Otherwise, respond in 2-4 short sentences.',
  'Keep it concise and practical.',
  'Avoid long paragraphs and unnecessary prefaces.',
].join('\n');

export function ChatView({ initialMessage = '', welcomeMessage = '', onClose }) {
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

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const displayMessages = welcomeMessage
    ? [{ role: 'assistant', content: welcomeMessage, key: 'welcome' }, ...messages]
    : messages;

  return (
    <div className="chatbot glass-card chatview">
      <div className="recipes-header">
        <h3>AI Chat</h3>
        {onClose && (
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        )}
      </div>
      <div className="chatbot-messages" ref={listRef}>
        {displayMessages.map((msg, index) => (
          <div key={msg.key || `${msg.role}-${index}`} className={`chatbot-bubble ${msg.role}`}>
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
          autoFocus
        />
        <button type="submit" className="icon-button" disabled={!input.trim() || loading}>
          <span className="icon-arrow">&gt;</span>
        </button>
      </form>
    </div>
  );
}
