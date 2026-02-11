const QUICK_PROMPTS = [
  { label: 'Indian veg', apply: (filters) => ({ ...filters, cuisine: 'indian', diet: 'veg' }) },
  { label: '15 min', apply: (filters) => ({ ...filters, maxTime: '15' }) },
  { label: 'Budget friendly', apply: (filters) => ({ ...filters, budget: true }) },
  { label: 'Healthy', apply: (filters) => ({ ...filters, healthy: true }) },
  { label: 'No onion/garlic', apply: (filters) => ({ ...filters, noOnionGarlic: true }) },
];

export function FiltersBar({ filters, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <section className="filters-bar">
      <div className="filters-header">
        <h3>Smart Prompting</h3>
        <p>Tell the assistant exactly what you want beyond ingredients.</p>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Cuisine</label>
          <select
            value={filters.cuisine}
            onChange={(e) => handleChange('cuisine', e.target.value)}
          >
            <option value="any">Any</option>
            <option value="indian">Indian</option>
            <option value="north-indian">North Indian</option>
            <option value="south-indian">South Indian</option>
            <option value="chinese">Chinese</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Diet</label>
          <select
            value={filters.diet}
            onChange={(e) => handleChange('diet', e.target.value)}
          >
            <option value="all">All</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-vegetarian</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Max time (mins)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 15"
            value={filters.maxTime}
            onChange={(e) => handleChange('maxTime', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="toggle-row">
        <label className="toggle">
          <input
            type="checkbox"
            checked={filters.healthy}
            onChange={(e) => handleChange('healthy', e.target.checked)}
          />
          Healthy
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={filters.budget}
            onChange={(e) => handleChange('budget', e.target.checked)}
          />
          Budget friendly
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={filters.noOnionGarlic}
            onChange={(e) => handleChange('noOnionGarlic', e.target.checked)}
          />
          No onion/garlic
        </label>
      </div>

      <div className="prompt-row">
        <label>Extra notes</label>
        <input
          type="text"
          placeholder="e.g. 15 min, low oil, high protein, tiffin friendly"
          value={filters.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="prompt-chips">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            className="prompt-chip"
            onClick={() => onChange(prompt.apply(filters))}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
