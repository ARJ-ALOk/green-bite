import { useMemo, useState } from 'react';
import { COMMON_INGREDIENTS } from '../data/ingredients';

export function IngredientSelector({ selected, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return COMMON_INGREDIENTS.filter(
      (ing) =>
        ing.toLowerCase().includes(q) && !selected.includes(ing)
    ).slice(0, 8);
  }, [query, selected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (!selected.includes(trimmed)) {
      onAdd(trimmed);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleSelect = (ing) => {
    onAdd(ing);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="ingredient-selector">
      <h3>Select or add ingredients</h3>
      <form onSubmit={handleSubmit} className="autocomplete-input">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <button type="submit">Add</button>
        {isOpen && suggestions.length > 0 && (
          <div className="autocomplete-list" role="listbox">
            {suggestions.map((ing) => (
              <button
                key={ing}
                type="button"
                className="autocomplete-item"
                onClick={() => handleSelect(ing)}
              >
                {ing}
              </button>
            ))}
          </div>
        )}
      </form>
      <div className="chip-row quick-picks">
        {[
          'Tomato',
          'Onion',
          'Potato',
          'Milk',
          'Egg',
          'Rice',
          'Bread',
          'Paneer',
          'Cheese',
          'Butter',
          'Garlic',
          'Ginger',
          'Lemon',
          'Spinach',
          'Carrot',
          'Capsicum',
          'Chicken',
        ].map((ing) => (
          <button
            key={ing}
            type="button"
            className="chip quick-pick"
            onClick={() => onAdd(ing)}
          >
            {ing}
          </button>
        ))}
      </div>
      {selected.length > 0 ? (
        <div className="chip-row">
          {selected.map((ing) => (
            <span key={ing} className="chip chip-selected">
              {ing}
              <button
                type="button"
                className="chip-remove"
                onClick={() => onRemove(ing)}
                aria-label={`Remove ${ing}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="empty-hint">Start typing to add ingredients.</p>
      )}
    </div>
  );
}
