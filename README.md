# Green Bite 🥗

A recipe finder web app. Select ingredients and get AI-generated recipes powered by Groq + Mixtral.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your Groq API key**
   - Copy `.env.example` to `.env`
   - Get a free API key from [console.groq.com](https://console.groq.com)
   - Add: `VITE_GROQ_API_KEY=your_key_here`

3. **Run the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

Output will be in the `dist/` folder.

## Project Structure

```
green-bite/
├── src/
│   ├── components/
│   │   ├── IngredientSelector.jsx
│   │   ├── RecipeCard.jsx
│   │   └── RecipeList.jsx
│   ├── data/
│   │   └── ingredients.js
│   ├── services/
│   │   └── groqService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```
