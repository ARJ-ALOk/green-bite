import { RecipeCard } from './RecipeCard';
import { SkeletonCard } from './SkeletonCard';

export function RecipeList({ recipes, loading, onToggleFavorite, favorites = [] }) {
  if ((!recipes || recipes.length === 0) && !loading) return null;

  return (
    <div className="recipe-list">
      <h2>Your Recipes</h2>
      <div className="recipe-grid">
        {loading
          ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
          : recipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id || `${recipe.name}-${i}`}
                recipe={recipe}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.some((fav) => fav.id === recipe.id)}
              />
            ))}
      </div>
    </div>
  );
}
