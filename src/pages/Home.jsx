import { IngredientSelector } from '../components/IngredientSelector';
import { GenerateButton } from '../components/GenerateButton';
import { FiltersBar } from '../components/FiltersBar';

export function HomePage({
  selectedIngredients,
  onAddIngredient,
  onRemoveIngredient,
  onGenerate,
  loading,
  error,
  filters,
  onFiltersChange,
}) {
  return (
    <main className="glass-card">
      <IngredientSelector
        selected={selectedIngredients}
        onAdd={onAddIngredient}
        onRemove={onRemoveIngredient}
      />
      <FiltersBar filters={filters} onChange={onFiltersChange} />
      <GenerateButton
        onClick={onGenerate}
        loading={loading}
        disabled={loading || selectedIngredients.length === 0}
      />
      {error && <p className="error">{error}</p>}
    </main>
  );
}
