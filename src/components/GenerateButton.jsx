export function GenerateButton({ onClick, disabled, loading }) {
  return (
    <div className="actions">
      <button type="button" className="btn-primary" onClick={onClick} disabled={disabled}>
        {loading ? 'Generating...' : 'Generate Recipes'}
      </button>
    </div>
  );
}
