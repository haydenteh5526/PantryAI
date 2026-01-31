# PantryAI - AI Recipe Companion

A React Native (Expo) mobile app that transforms photos of ingredients into recipes based on your lifestyle "Vibe" - Eco-friendly, Health-focused, or Cultural exploration.

## Tech Stack

- **Frontend:** React Native with Expo (Managed workflow)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router
- **Backend:** Supabase (to be integrated)
- **AI:** Google Gemini API (free tier) - can switch to OpenAI for production

## Setup

1. Install dependencies:

```bash
npm install
```

2. **Environment variables (API keys):**

   - Fill in your keys (see [Environment (.env)](#environment-env) below)
   - Restart the dev server after changing `.env`
3. Start the development server:

```bash
npm start
```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your physical device

## Features (MVP)

✅ Camera screen with mock ingredient scanning
✅ Ingredient confirmation/edit screen
✅ Vibe selector (Eco, Health, Travel)
✅ Recipe detail view with steps and ingredients
✅ Tab navigation (Home, Social, Profile)
✅ Dark mode theme

## Environment (.env)

Create a `.env` file in the project root (copy from `.env.example`). Structure:

```env
# Required for ingredient scanning & recipe generation (Gemini free tier)
GEMINI_API_KEY=your_gemini_key_here

# Optional – for future OpenAI switch
OPENAI_API_KEY=
```

| Variable           | Required | Description                                                                                 |
| ------------------ | -------- | ------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | Yes      | [Get key](https://aistudio.google.com/app/apikey) – used for Vision (scan) and Text (recipes) |
| `OPENAI_API_KEY` | No       | Reserved for production OpenAI switch                                                       |

- `.env` is gitignored; never commit real keys.
- The app uses mock data if `GEMINI_API_KEY` is missing or empty.

## API Configuration

**Current Status:**

- ✅ **Using Google Gemini API (free tier)** for testing
- ✅ Falls back to mock data if API key is not configured
- ✅ Vision API: Scans images and returns ingredient list
- ✅ Text API: Generates recipes based on ingredients and vibe
- ✅ Can easily switch to OpenAI for production (config preserved)

## Next Steps

- [X] Integrate OpenAI Vision API for ingredient detection
- [X] Integrate OpenAI Text API for recipe generation
- [ ] Implement social feed backend
- [ ] Add premium subscription logic
- [ ] Implement calorie tracking
- [ ] Add voice chatbot for further inquiries during cooking

## Notes

- The app uses mock data until you set `GEMINI_API_KEY` in `.env`
- Premium features (Health & Travel vibes) are clickable for development but should be gated in production
- Assets folder needs icon, splash, and adaptive-icon images
- Web support is now enabled (react-native-web installed)
