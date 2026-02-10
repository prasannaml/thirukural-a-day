# CLAUDE.md

This file provides guidance for AI assistants working on the Thirukural-A-Day codebase.

## Project Overview

A Next.js web application that displays a daily Thirukkural (Tamil classical poetry) with Tamil meanings, English translations, and explanations. A new kural is shown each day, determined by an FNV-1a hash of the current date in IST (UTC+5:30). The app is deployed on Vercel at https://thirukural-a-day.com.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **React:** v19 with React Compiler enabled (`reactCompiler: true` in next.config.ts)
- **Styling:** Tailwind CSS v4 via PostCSS
- **Linter/Formatter:** Biome 2.2
- **Analytics:** Vercel Analytics
- **Fonts:** Geist Sans and Geist Mono (from `next/font/google`)

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run Biome linter (biome check)
npm run format    # Auto-format with Biome (biome format --write)
```

## Project Structure

```
src/
  app/                      # Next.js App Router pages
    layout.tsx              # Root layout (metadata, fonts, Analytics)
    page.tsx                # Home page - daily kural display
    globals.css             # Global styles + Tailwind imports
    fortune-cookie/
      page.tsx              # Fortune cookie interactive page
  components/
    DailyKuralFortune.tsx   # Modal for daily kural
    KuralFortuneCookie.tsx  # Fortune cookie with localStorage persistence
    RandomKural.tsx         # Random kural picker
    ShareLinkButtons.tsx    # WhatsApp + Web Share API sharing
    TestDateOverride.tsx    # Dev-only date override via ?date= query param
  lib/
    kuralOfDay.ts           # Core logic: date hashing, kural selection
  data/
    thirukkural.json        # Source data: all 1330 kurals
    gemini_translation.json # AI-generated English translations
    thirukural_with_mk.json # Merged kurals + translations (used by app)
    thirukkural_number_mk.json  # Simplified Number + mk extract
scripts/
  merge_translations.py    # Merges gemini translations into kural data
  extract_number_mk.py     # Extracts Number + mk fields
```

## Architecture & Key Patterns

### Data Flow
- All kural data is statically embedded via JSON imports at build time (no API routes, no database)
- The primary data source used by the app is `src/data/thirukural_with_mk.json`
- Daily kural selection uses FNV-1a hash of the IST date string for deterministic, repeatable results

### Core Logic (`src/lib/kuralOfDay.ts`)
- `getDateKeyIST()` - returns current date in IST as `YYYY-MM-DD`
- `getKuralOfDay(dateKey)` - deterministic daily kural via `fnv1a32(dateKey) % totalKurals`
- `getRandomKural()` - random kural selection
- `Kural` type: `{ Number, Line1, Line2, mk?, explanation?, english_mk_translation? }`

### Component Patterns
- Client components use `"use client"` directive
- Props are typed with `Readonly<>` wrapper
- Modal/animation patterns use state transitions (`isOpening` -> `isOpen`) with CSS transitions
- `TestDateOverride` only renders when `NODE_ENV !== "production"`
- `KuralFortuneCookie` uses localStorage for daily persistence (same fortune per day)

### Path Alias
- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Code Style & Conventions

### Biome Configuration
- 2-space indentation
- Recommended rules enabled for general, React, and Next.js domains
- `noUnknownAtRules` disabled (for Tailwind CSS directives)
- Import organization enabled
- Git-aware: respects `.gitignore`

### Styling
- Tailwind CSS utility classes exclusively (no CSS modules or styled-components)
- Dark mode via `dark:` prefix and CSS custom properties
- Theme variables defined in `globals.css` under `:root` and `@media (prefers-color-scheme: dark)`

### TypeScript
- Strict mode enabled
- Target: ES2017
- JSON imports enabled (`resolveJsonModule: true`)
- Data casting pattern: `(data as { kural: Kural[] }).kural`

## Development Notes

- **No test framework** is currently configured
- **No CI/CD pipelines** exist; deployment is via Vercel's git integration
- **No environment variables** are required to run the project
- The IST timezone offset is hardcoded (not using Intl API), so kural-of-the-day is consistent regardless of server timezone
- Python scripts in `scripts/` are standalone data processing utilities using only the standard library
