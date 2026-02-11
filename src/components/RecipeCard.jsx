import { useMemo } from 'react';

function normalizeSteps(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(/\d+\./)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeDiet(value) {
  if (value === true) return { label: 'Veg', tone: 'veg' };
  if (value === false) return { label: 'Non-Veg', tone: 'non-veg' };
  if (!value) return null;
  const text = String(value).toLowerCase();
  if (text.includes('non')) return { label: 'Non-Veg', tone: 'non-veg' };
  if (text.includes('veg')) return { label: 'Veg', tone: 'veg' };
  return null;
}

function normalizeDifficulty(value) {
  if (!value) return null;
  const text = String(value).toLowerCase();
  if (!text) return null;
  return text[0].toUpperCase() + text.slice(1);
}

function normalizeCalories(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return `${value} kcal`;
  const text = String(value).trim();
  if (!text) return null;
  return /kcal|cal/i.test(text) ? text : `${text} kcal`;
}

function normalizeCost(value) {
  if (!value) return null;
  const text = String(value).toLowerCase();
  if (!text) return null;
  return text[0].toUpperCase() + text.slice(1);
}

export function RecipeCard({ recipe, onToggleFavorite, isFavorite }) {
  const heart = '\u2665';
  const heartOutline = '\u2661';

  const instructions = useMemo(() => normalizeSteps(recipe.instructions), [recipe.instructions]);
  const timeLabel = recipe.totalTime || recipe.prepTime || recipe.cookTime || 'N/A';
  const dietBadge = normalizeDiet(recipe.dietType || recipe.diet || recipe.vegNonVeg);
  const difficulty = normalizeDifficulty(recipe.difficulty);
  const calories = normalizeCalories(recipe.calories);
  const healthTag = recipe.healthTag || recipe.health || recipe.healthLabel;
  const costLevel = normalizeCost(recipe.costLevel || recipe.cost || recipe.budgetTag);

  return (
    <article className="recipe-card">
      <div className="recipe-card-top">
        <div>
          <h3>{recipe.name}</h3>
          <p className="recipe-desc">{recipe.description}</p>
        </div>
      </div>
      <div className="recipe-meta">
        {timeLabel && timeLabel !== 'N/A' && (
          <span className="badge time">Time: {timeLabel}</span>
        )}
        {calories && <span className="badge calories">{calories}</span>}
        {difficulty && <span className="badge difficulty">{difficulty}</span>}
        {dietBadge && (
          <span className={`badge diet ${dietBadge.tone}`}>{dietBadge.label}</span>
        )}
        {healthTag && <span className="badge health">{healthTag}</span>}
        {costLevel && <span className="badge cost">{costLevel}</span>}
      </div>
      <div className="recipe-details">
        <section>
          <h4>Instructions</h4>
          <ol>
            {instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
      <button
        type="button"
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={() => onToggleFavorite(recipe)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? heart : heartOutline}
      </button>
    </article>
  );
}
