import { Spinner } from './Spinner';

export function ChatPanel({ messages, input, onInputChange, onSend, loading }) {
  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="chat-empty">Ask for recipes and the assistant will respond here.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))
        )}
      </div>
      <form className="chat-input" onSubmit={onSend}>
        <input
          type="text"
          placeholder="Add a note, e.g. quick dinner ideas"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {loading && (
        <div className="chat-loading">
          <Spinner />
          <span>Generating recipes...</span>
        </div>
      )}
    </div>
  );
}
