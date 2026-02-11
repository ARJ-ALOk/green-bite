import { RecipeList } from '../components/RecipeList';

export function FavoritesPage({ favorites, onToggleFavorite }) {
  return (
    <main className="glass-card">
      <div className="favorites-header">
        <h2>Favorites</h2>
        <p>Saved recipes you loved.</p>
      </div>
      {favorites.length === 0 ? (
        <p className="empty-hint">No favorites yet. Tap the heart on any recipe.</p>
      ) : (
        <RecipeList
          recipes={favorites}
          loading={false}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
        />
      )}
    </main>
  );
}
