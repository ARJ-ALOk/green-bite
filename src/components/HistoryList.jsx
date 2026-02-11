export function HistoryList({ history, onSelect }) {
  if (!history.length) return null;

  return (
    <div className="history">
      <h4>Recent searches</h4>
      <div className="history-list">
        {history.map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            className="history-item"
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
