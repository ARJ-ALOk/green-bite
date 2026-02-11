import { useEffect, useRef, useState } from 'react';
import { HomePage } from './pages/Home';
import { FavoritesPage } from './pages/Favorites';
import { RecipesView } from './pages/RecipesView';
import { ChatBot } from './components/ChatBot';
import { getRecipesFromIngredients } from './services/groqService';
import { useLocalStorage } from './hooks/useLocalStorage';
import apple from './assets/ingredients/apple.png';
import banana from './assets/ingredients/banana.png';
import avocado from './assets/ingredients/avocado.png';
import broccoli from './assets/ingredients/broccoli.png';
import carrot from './assets/ingredients/carrot.png';
import corn from './assets/ingredients/corn.png';
import cucumber from './assets/ingredients/cucumber.png';
import eggplant from './assets/ingredients/eggplant.png';
import garlic from './assets/ingredients/garlic.png';
import onion from './assets/ingredients/onion.png';
import potato from './assets/ingredients/potato.png';
import tomato from './assets/ingredients/tomato.png';
import mushroom from './assets/ingredients/mushroom.png';
import bellPepper from './assets/ingredients/bell-pepper.png';
import lemon from './assets/ingredients/lemon.png';
import orange from './assets/ingredients/orange.png';
import strawberry from './assets/ingredients/strawberry.png';
import grapes from './assets/ingredients/grapes.png';
import cheese from './assets/ingredients/cheese.png';
import bread from './assets/ingredients/bread.png';
import chili from './assets/ingredients/chili.png';
import leafyGreens from './assets/ingredients/leafy-greens.png';
import peanut from './assets/ingredients/peanut.png';
import coconut from './assets/ingredients/coconut.png';
import kiwi from './assets/ingredients/kiwi.png';
import pineapple from './assets/ingredients/pineapple.png';
import watermelon from './assets/ingredients/watermelon.png';
import peach from './assets/ingredients/peach.png';
import cherries from './assets/ingredients/cherries.png';
import milk from './assets/ingredients/milk.png';

const VIEW_HOME = 'home';
const VIEW_FAVORITES = 'favorites';
const VIEW_RECIPES = 'recipes';

function getRecipeId(recipe, index) {
  if (recipe.id) return recipe.id;
  const base = recipe.name || 'recipe';
  return `${base}-${index}`.toLowerCase().replace(/\s+/g, '-');
}

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    cuisine: 'indian',
    diet: 'all',
    maxTime: '',
    difficulty: 'all',
    healthy: false,
    budget: false,
    noOnionGarlic: false,
    notes: '',
  });
  const [favorites, setFavorites] = useLocalStorage('green-bite-favorites', []);
  const [view, setView] = useState(VIEW_HOME);
  const bgRef = useRef(null);

  const bgItems = [
    { src: apple, x: 6, y: 10, size: 64, dx: 8, dy: 6, fx: 120, fy: 160, dur: 46, delay: -6 },
    { src: banana, x: 18, y: 30, size: 72, dx: -10, dy: 8, fx: -140, fy: 150, dur: 52, delay: -18 },
    { src: avocado, x: 34, y: 14, size: 68, dx: 10, dy: -8, fx: 130, fy: -170, dur: 44, delay: -10 },
    { src: broccoli, x: 48, y: 36, size: 74, dx: 12, dy: 6, fx: 150, fy: 140, dur: 58, delay: -22 },
    { src: carrot, x: 62, y: 12, size: 70, dx: -8, dy: 10, fx: -120, fy: 180, dur: 49, delay: -12 },
    { src: corn, x: 74, y: 28, size: 76, dx: 9, dy: -10, fx: 160, fy: -150, dur: 60, delay: -30 },
    { src: cucumber, x: 88, y: 18, size: 66, dx: -9, dy: 8, fx: -130, fy: 150, dur: 47, delay: -16 },
    { src: eggplant, x: 10, y: 58, size: 78, dx: 12, dy: -8, fx: 140, fy: -160, dur: 63, delay: -28 },
    { src: garlic, x: 24, y: 70, size: 64, dx: -8, dy: 9, fx: -120, fy: 170, dur: 50, delay: -20 },
    { src: onion, x: 38, y: 58, size: 72, dx: 10, dy: -9, fx: 150, fy: -140, dur: 56, delay: -26 },
    { src: potato, x: 54, y: 70, size: 70, dx: -11, dy: 7, fx: -150, fy: 150, dur: 62, delay: -34 },
    { src: tomato, x: 68, y: 56, size: 68, dx: 9, dy: -8, fx: 130, fy: -150, dur: 48, delay: -14 },
    { src: mushroom, x: 82, y: 66, size: 74, dx: -9, dy: 10, fx: -140, fy: 170, dur: 58, delay: -24 },
    { src: bellPepper, x: 92, y: 42, size: 66, dx: 8, dy: -9, fx: 120, fy: -140, dur: 52, delay: -32 },
    { src: lemon, x: 8, y: 84, size: 64, dx: 10, dy: 6, fx: 130, fy: 140, dur: 54, delay: -36 },
    { src: orange, x: 22, y: 90, size: 70, dx: -8, dy: 9, fx: -140, fy: 160, dur: 60, delay: -40 },
    { src: strawberry, x: 40, y: 86, size: 76, dx: 12, dy: -6, fx: 160, fy: -130, dur: 66, delay: -44 },
    { src: grapes, x: 58, y: 88, size: 68, dx: -10, dy: 8, fx: -150, fy: 150, dur: 57, delay: -38 },
    { src: cheese, x: 76, y: 84, size: 72, dx: 9, dy: -8, fx: 140, fy: -140, dur: 61, delay: -42 },
    { src: bread, x: 90, y: 82, size: 70, dx: -9, dy: 10, fx: -130, fy: 170, dur: 59, delay: -46 },
    { src: chili, x: 12, y: 40, size: 62, dx: 8, dy: -7, fx: 120, fy: -150, dur: 50, delay: -20 },
    { src: leafyGreens, x: 28, y: 44, size: 70, dx: -9, dy: 8, fx: -130, fy: 140, dur: 55, delay: -28 },
    { src: peanut, x: 44, y: 46, size: 60, dx: 10, dy: -8, fx: 140, fy: -120, dur: 48, delay: -16 },
    { src: coconut, x: 60, y: 40, size: 72, dx: -8, dy: 9, fx: -120, fy: 150, dur: 58, delay: -34 },
    { src: kiwi, x: 74, y: 46, size: 64, dx: 9, dy: -7, fx: 130, fy: -130, dur: 52, delay: -24 },
    { src: pineapple, x: 86, y: 52, size: 78, dx: -10, dy: 8, fx: -140, fy: 140, dur: 62, delay: -36 },
    { src: watermelon, x: 14, y: 22, size: 74, dx: 10, dy: 7, fx: 150, fy: 120, dur: 60, delay: -30 },
    { src: peach, x: 32, y: 24, size: 66, dx: -8, dy: -9, fx: -130, fy: -150, dur: 54, delay: -26 },
    { src: cherries, x: 50, y: 22, size: 68, dx: 9, dy: 8, fx: 140, fy: 140, dur: 56, delay: -32 },
    { src: milk, x: 66, y: 24, size: 62, dx: -9, dy: -8, fx: -120, fy: -140, dur: 50, delay: -18 },
  ];

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients((prev) => (prev.includes(ingredient) ? prev : [...prev, ingredient]));
  };

  const handleRemoveIngredient = (ingredient) => {
    setSelectedIngredients((prev) => prev.filter((item) => item !== ingredient));
  };

  const handleToggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === recipe.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== recipe.id);
      }
      return [...prev, recipe];
    });
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please select at least one ingredient.');
      return;
    }

    setError(null);
    setLoading(true);
    setRecipes([]);
    setView(VIEW_RECIPES);

    try {
      const result = await getRecipesFromIngredients(selectedIngredients, filters, { timeoutMs: 15000 });
      const list = Array.isArray(result) ? result : result?.recipes || [];
      const limited = list.slice(0, 3).map((recipe, index) => ({
        ...recipe,
        id: getRecipeId(recipe, index),
      }));
      setRecipes(limited);
    } catch (err) {
      const message = err?.message || 'Server busy, try again.';
      setError(message);
      setView(VIEW_HOME);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFavorites((prev) =>
      prev.map((recipe, index) =>
        recipe.id ? recipe : { ...recipe, id: getRecipeId(recipe, index) }
      )
    );
  }, [setFavorites]);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    let raf = 0;
    let pulseTimer = 0;
    const canHover = window.matchMedia('(hover: hover)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = (evt) => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollPct = Math.min(1, scrollY / maxScroll);
      el.style.setProperty('--scroll', String(scrollPct));

      if (evt && evt.clientX != null) {
        const mx = (evt.clientX / window.innerWidth) * 2 - 1;
        const my = (evt.clientY / window.innerHeight) * 2 - 1;
        el.style.setProperty('--mx', String(mx));
        el.style.setProperty('--my', String(my));
      }
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update());
    };

    const onMove = (evt) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(evt));
    };

    const onClick = () => {
      if (reduceMotion) return;
      el.classList.remove('bg-field--pulse');
      requestAnimationFrame(() => {
        el.classList.add('bg-field--pulse');
      });
      if (pulseTimer) window.clearTimeout(pulseTimer);
      pulseTimer = window.setTimeout(() => {
        el.classList.remove('bg-field--pulse');
      }, 600);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (canHover) {
      window.addEventListener('mousemove', onMove, { passive: true });
    }
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (canHover) {
        window.removeEventListener('mousemove', onMove);
      }
      window.removeEventListener('click', onClick);
      if (raf) cancelAnimationFrame(raf);
      if (pulseTimer) window.clearTimeout(pulseTimer);
    };
  }, []);

  return (
    <>
      <div className="bg-field" ref={bgRef} aria-hidden="true">
        {bgItems.map((item, i) => (
          <span
            key={i}
            className="bg-item"
            style={{
              '--x': `${item.x}%`,
              '--y': `${item.y}%`,
              '--size': `${item.size}px`,
              '--dx': `${item.dx}px`,
              '--dy': `${item.dy}px`,
              '--fx': `${item.fx}px`,
              '--fy': `${item.fy}px`,
              '--dur': `${item.dur}s`,
              '--delay': `${item.delay}s`,
            }}
          >
            <img src={item.src} alt="" loading="lazy" />
          </span>
        ))}
      </div>
      <div className="app">
        <header>
          <div className="brand">
            <h1>Green Bite</h1>
            <p>Pick your ingredients, get delicious recipes</p>
          </div>
          <nav className="nav-tabs">
            <button
              type="button"
              className={view === VIEW_HOME ? 'active' : ''}
              onClick={() => setView(VIEW_HOME)}
            >
              Home
            </button>
            <button
              type="button"
              className={view === VIEW_FAVORITES ? 'active' : ''}
              onClick={() => setView(VIEW_FAVORITES)}
            >
              Favorites
            </button>
          </nav>
        </header>

        {view === VIEW_HOME && (
          <HomePage
            selectedIngredients={selectedIngredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {view === VIEW_RECIPES && (
          <RecipesView
            recipes={recipes}
            loading={loading}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onBack={() => setView(VIEW_HOME)}
          />
        )}

        {view === VIEW_FAVORITES && (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
      <ChatBot />
    </>
  );
}

export default App;
