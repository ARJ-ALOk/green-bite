import { RecipeCard } from '../components/RecipeCard';
import { SkeletonCard } from '../components/SkeletonCard';

export function RecipesView({ recipes, loading, onToggleFavorite, favorites, onBack }) {
  return (
    <main className="glass-card recipes-view">
      <div className="recipes-header">
        <h2>Recipes</h2>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="carousel">
        {loading
          ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
          : recipes.map((recipe, index) => (
              <div key={recipe.id || `${recipe.name}-${index}`} className="carousel-slide">
                <RecipeCard
                  recipe={recipe}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some((fav) => fav.id === recipe.id)}
                />
              </div>
            ))}
      </div>
    </main>
  );
}
