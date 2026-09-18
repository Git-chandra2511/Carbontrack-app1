# CarbonTrack

CarbonTrack is a lightweight personal carbon-footprint tracker for the **Climate Tech** track. It helps users log everyday transport, energy, and food activities, estimate their CO₂ impact, and monitor progress toward a weekly target.

## Hackathon ID

**AZIS-9CF8RB**

## Track

**Climate Tech**


## Features

- Log transport, electricity, and meal activities.
- Calculate estimated CO₂ emissions using deterministic emission factors.
- View weekly footprint totals and target progress.
- Explore daily trends and category breakdowns.
- Review and filter activity history.
- Export or clear locally stored data.
- Responsive dashboard with an animated video hero.

## Tech Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Recharts
- Lucide React
- date-fns
- Browser `localStorage`

## Run Locally

Requirements:

- Node.js 18+
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:5174/dashboard
```

## Production Build

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The preview server uses port `5174`.

## Test Credentials

No credentials are required.

CarbonTrack does not use authentication. Activity data is stored locally in the browser using `localStorage`.

## Standard API

**Not implemented.** CarbonTrack uses deterministic client-side CO₂ calculations and browser `localStorage`, so features should be evaluated by a browser agent driving the UI rather than by a standard API script.

## Data and Privacy

No backend or external database is required. User activity data stays on the local device unless the user exports it manually from Settings.

## Emission Factors

CarbonTrack uses fixed baseline emission factors for consistent personal tracking. Actual emissions may vary depending on distance, energy source, vehicle, meal composition, and other real-world conditions.

## Project Structure

```text
src/
├── components/       # UI components
├── compat/           # Lightweight client-side routing
├── lib/
│   ├── carbontrack/  # Calculations, dates, and local storage
│   ├── emissions/    # Emission factors
│   └── types/        # Shared TypeScript types
├── pages/            # Dashboard and application pages
├── globals.css       # Global styles
└── main.tsx          # Vite application entry point
```

## Validation

The production build can be checked with:

```bash
npm run build
```
