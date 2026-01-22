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

2. **Configure API Keys:**
   - Open `lib/config.ts`
   - Replace `"your-openai-api-key-here"` with your actual OpenAI API key
   - Get your API key from: https://platform.openai.com/api-keys
   - ⚠️ **For production:** Use environment variables instead of hardcoding

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home/Camera screen
│   │   ├── social.tsx     # Social feed (placeholder)
│   │   └── profile.tsx    # Profile & settings
│   ├── ingredient-confirmation.tsx
│   ├── vibe-selector.tsx
│   └── recipe-detail.tsx
├── services/              # API services
│   └── ai.ts             # OpenAI service (mock for now)
├── components/            # Reusable components (to be added)
└── lib/                   # Utilities (to be added)
```

## Features (MVP)

✅ Camera screen with mock ingredient scanning
✅ Ingredient confirmation/edit screen
✅ Vibe selector (Eco, Health, Travel)
✅ Recipe detail view with steps and ingredients
✅ Tab navigation (Home, Social, Profile)
✅ Dark mode theme

## API Configuration

**Where to add your API keys:**
- Edit `lib/config.ts` and replace `"your-gemini-api-key-here"` with your Gemini API key
- Get your free API key from: https://aistudio.google.com/app/apikey
- The app will automatically use mock data if no API key is set
- Both Vision (ingredient scanning) and Text (recipe generation) APIs are ready to use

**Current Status:**
- ✅ **Using Google Gemini API (free tier)** for testing
- ✅ Falls back to mock data if API key is not configured
- ✅ Vision API: Scans images and returns ingredient list
- ✅ Text API: Generates recipes based on ingredients and vibe
- ✅ Can easily switch to OpenAI for production (config preserved)

## Next Steps

- [x] Integrate OpenAI Vision API for ingredient detection
- [x] Integrate OpenAI Text API for recipe generation
- [ ] Set up Supabase for authentication and database
- [ ] Implement social feed backend
- [ ] Add premium subscription logic
- [ ] Implement calorie tracking

## Notes

- The app uses mock data by default until you add your OpenAI API key
- Premium features (Health & Travel vibes) are clickable for development but should be gated in production
- Assets folder needs icon, splash, and adaptive-icon images
- Web support is now enabled (react-native-web installed)
