# PantryAI - AI Recipe Companion

A React Native (Expo) mobile app that transforms photos of ingredients into personalized recipes with voice-guided cooking.

## Tech Stack

- **Framework:** React Native + Expo 54 (Managed workflow)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router v6 (file-based)
- **Backend:** Supabase (auth, database, storage)
- **AI:** Google Gemini API (Vision + Text)
- **Crash Reporting:** Sentry
- **Testing:** Jest + ts-jest

## Features

- 📸 Camera ingredient scanning (Gemini Vision API)
- 🤖 AI recipe generation with safety rules
- 🎙️ Voice-guided step-by-step cooking mode
- ⏱️ Auto-detected timers from recipe steps
- 📖 Cooking history with photos and ratings
- 🔖 Save/favorite recipes
- 👤 Auth (email/password) + guest mode
- 🌐 Offline detection with banner
- 💥 Error boundary with crash recovery
- 🔔 Haptic feedback throughout

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Required | Source |
|----------|----------|--------|
| `SUPABASE_URL` | Yes | [supabase.com](https://supabase.com) → Project Settings → API |
| `SUPABASE_ANON_KEY` | Yes | Same as above |
| `GEMINI_API_KEY` | Yes | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `SENTRY_DSN` | No | [sentry.io](https://sentry.io) → Project → Client Keys |
| `OPENAI_API_KEY` | No | Reserved for future use |

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Create a storage bucket named `recipe-photos` (set to public)

### 4. Start development

```bash
npm start
```

- `i` → iOS simulator
- `a` → Android emulator
- `w` → Web browser
- Scan QR → Physical device (Expo Go)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm test` | Run unit tests |
| `npm run generate-assets` | Regenerate app icons and splash screen |

## Project Structure

```
├── app/                   # Screens (file-based routing)
│   ├── (tabs)/           # Tab navigator (Home, History, Social, Profile)
│   ├── auth.tsx          # Sign in / Sign up
│   ├── active-cooking.tsx # Voice-guided cooking mode
│   └── ...
├── components/           # Reusable components
├── lib/                  # Core modules
│   ├── supabase.ts      # Supabase client
│   ├── auth-context.tsx  # Auth state provider
│   ├── database.ts      # CRUD operations
│   ├── favorites.ts     # Recipe bookmarks
│   ├── network-context.tsx # Offline detection
│   └── sentry.ts        # Crash reporting
├── services/            # Business logic
│   ├── ai.ts            # Gemini API integration
│   └── recipeEngine.ts  # Safety rules, method selection
├── constants/           # Static data
├── supabase/            # Database schema
└── __tests__/           # Unit tests
```

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure (first time)
eas build:configure

# Build for internal testing
eas build --profile preview --platform all

# Build for store submission
eas build --profile production --platform all
```

## API Behavior

- With `GEMINI_API_KEY` set: Uses Gemini Vision for scanning, Gemini Text for recipes
- Without API key: Falls back to mock data (for development/demo)
- Guest mode: All data stored locally (AsyncStorage)
- Authenticated: Data synced to Supabase cloud

## License

ISC
