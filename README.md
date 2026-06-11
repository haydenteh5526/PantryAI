<div align="center">
  <h1>🍳 PantryAI</h1>
  <p><strong>AI-powered recipe companion app</strong></p>
  <p>Scan your ingredients, get personalized recipes, and cook with voice-guided instructions.</p>

  ![License](https://img.shields.io/github/license/haydenteh5526/PantryAI)
  ![Last Commit](https://img.shields.io/github/last-commit/haydenteh5526/PantryAI)
  ![Top Language](https://img.shields.io/github/languages/top/haydenteh5526/PantryAI)
</div>

---

## Features

- **Ingredient Scanning** — Point your camera at your fridge, AI identifies what you have
- **AI Recipe Generation** — Personalized recipes based on your ingredients and vibe
- **Voice-Guided Cooking** — Hands-free step-by-step instructions with auto-detected timers
- **Recipe Favorites** — Save and revisit your best recipes
- **Cooking History** — Track completed sessions with photos and ratings
- **Social Sharing** — Share your creations with the community
- **Safety-First** — USDA temperature rules injected into every recipe
- **Offline Support** — Works in guest mode, syncs when connected

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Expo SDK 54, React Native 0.81, TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| Navigation | Expo Router v6 (file-based) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| AI | Google Gemini API (Vision + Text) |
| Crash Reporting | Sentry |
| Testing | Jest + ts-jest |
| Deploy | EAS Build (mobile) |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app (for device testing) or Android Studio / Xcode

### Setup

```bash
git clone https://github.com/haydenteh5526/PantryAI.git
cd PantryAI
npm install
cp .env.example .env
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon public key |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `SENTRY_DSN` | No | Sentry crash reporting DSN |

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Create a `recipe-photos` storage bucket (public)

### Run

```bash
npm start
# Press: i (iOS) | a (Android) | w (Web) | Scan QR (Expo Go)
```

## Project Structure

```
PantryAI/
├── app/                → Screens (file-based routing)
│   ├── (tabs)/         → Tab navigator (Home, History, Social, Profile)
│   ├── auth.tsx        → Sign in / Sign up
│   ├── active-cooking.tsx → Voice-guided cooking mode
│   └── ...
├── components/         → Reusable UI components
├── lib/                → Core modules
│   ├── supabase.ts     → Supabase client
│   ├── auth-context.tsx → Auth state provider
│   ├── database.ts     → CRUD operations
│   ├── favorites.ts    → Recipe bookmarks
│   ├── network-context.tsx → Offline detection
│   └── sentry.ts       → Crash reporting
├── services/           → Business logic
│   ├── ai.ts           → Gemini API integration
│   └── recipeEngine.ts → Safety rules, method selection
├── constants/          → Static data (cooking methods, safety rules)
├── supabase/           → Database schema
└── __tests__/          → Unit tests
```

## Testing

```bash
npm test
```

## Deployment (EAS Build)

```bash
npm install -g eas-cli
eas build --profile preview --platform ios      # TestFlight
eas build --profile preview --platform android  # Internal APK
eas build --profile production --platform all   # Store submission
```

## API Behavior

- **With Gemini key** — Real AI scanning and recipe generation
- **Without key** — Falls back to mock data for development
- **Guest mode** — All data stored locally (AsyncStorage)
- **Authenticated** — Data synced to Supabase cloud

## License

ISC
