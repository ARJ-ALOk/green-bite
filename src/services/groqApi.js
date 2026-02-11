const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_TIMEOUT_MS = 15000;

function toTitleCase(value) {
  return String(value)
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function buildPreferenceBlock(filters) {
  if (!filters) return '';
  const lines = [];

  if (filters.cuisine && filters.cuisine !== 'any') {
    lines.push(`Cuisine: ${toTitleCase(filters.cuisine)}`);
  }
  if (filters.diet && filters.diet !== 'all') {
    lines.push(`Diet: ${filters.diet === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}`);
  }
  if (filters.maxTime) {
    lines.push(`Max total time: ${filters.maxTime} minutes`);
  }
  if (filters.difficulty && filters.difficulty !== 'all') {
    lines.push(`Difficulty: ${toTitleCase(filters.difficulty)}`);
  }
  if (filters.healthy) {
    lines.push('Healthy focus: light oil, balanced nutrition, plenty of vegetables.');
  }
  if (filters.budget) {
    lines.push('Budget-friendly: use common, low-cost ingredients.');
  }
  if (filters.noOnionGarlic) {
    lines.push('No onion or garlic. Avoid them completely.');
  }
  if (filters.notes && filters.notes.trim()) {
    lines.push(`Other request: ${filters.notes.trim()}`);
  }

  if (!lines.length) return '';
  return `Preferences:\n- ${lines.join('\n- ')}`;
}

async function fetchWithTimeout(url, options, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getRecipesFromIngredients(ingredients, filters = {}, { timeoutMs } = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const ingredientsList = ingredients.join(', ');
  const preferenceBlock = buildPreferenceBlock(filters);
  const systemPrompt = [
    'You are a professional cooking assistant.',
    'Always generate COMPLETE recipes.',
    'Follow constraints strictly and avoid forbidden ingredients.',
    'If a constraint conflicts with the provided ingredients, ignore the conflicting ingredients.',
    'Return JSON only, no markdown and no extra text.',
  ].join('\n');
  const userPrompt = `Given these ingredients: ${ingredientsList}

${preferenceBlock ? `${preferenceBlock}\n\n` : ''}Provide 2-3 recipe suggestions. For each recipe, return a JSON object with this exact structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description of the dish",
      "cuisine": "Cuisine name",
      "dietType": "veg | non-veg",
      "difficulty": "Easy | Medium | Hard",
      "calories": "Approx kcal per serving",
      "healthTag": "Short health tag (e.g., High Protein)",
      "costLevel": "Budget | Standard | Premium",
      "prepTime": "X minutes",
      "cookTime": "X minutes",
      "totalTime": "X minutes",
      "servings": number,
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["Step 1...", "Step 2...", ...],
      "tips": "Optional cooking tips"
    }
  ]
}

Rules:
- Instructions must be 6-10 clear steps.
- Always include measurements.
- Keep totalTime within the max time if provided.
- The dietType must be "veg" or "non-veg".
- If "No onion/garlic" is requested, do not use onion or garlic.
- If budget-friendly is requested, set costLevel to "Budget", otherwise "Standard".

IMPORTANT: Append this exact line as the FINAL instruction step for each recipe: "Enjoy your food! Your recipe is ready. Happy cooking!"`;

  let response;
  try {
    response = await fetchWithTimeout(
      GROQ_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      },
      timeoutMs
    );
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Network error. Please try again.');
  }

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '';

  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.recipes || parsed;
  } catch {
    throw new Error('Could not parse recipe response. Please try again.');
  }
}

export async function getChatResponse(messages, { systemPrompt, timeoutMs } = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const formatted = [
    { role: 'system', content: systemPrompt || 'You are a helpful cooking assistant.' },
    ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
  ];

  let response;
  try {
    response = await fetchWithTimeout(
      GROQ_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: formatted,
          temperature: 0.7,
          max_tokens: 512,
        }),
      },
      timeoutMs
    );
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Network error. Please try again.');
  }

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || 'No response.';
}
