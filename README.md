<div align="center">
  <h1>Wonder AI</h1>
  <p><strong>AI Journey Planner — Kuriftu Hospitality Hackathon</strong></p>
  <p>A visually intelligent, self-updating travel assistant for modern hospitality experiences. Transform travel from a static checklist into a living, guided experience.</p>
</div>

<br />

<div align="center">
  <img src="/public/opengraph-image.png" alt="Wonder AI Cover" style="max-width: 100%; border-radius: 8px;" />
</div>

---

## Overview

**Wonder AI** is an AI-powered journey planner designed for the Kuriftu Hospitality Hackathon. It plans, visualizes, and simulates a traveler's entire journey — from discovery to reward — in one seamless experience.

---

## Core Experience

| Stage | Description |
| :---- | :---------- |
| **1. Interactive Discovery** | A guided flow captures dates, budget, interests, and must-see places. In moments, it builds a clean itinerary you can trust. |
| **2. Visual Roadmap** | Your itinerary appears as a synced list and map. Tap any stop and jump there instantly with a smooth camera move. |
| **3. Live Interaction** | Start your journey once, and the assistant takes over. It syncs to your calendar and helps you at the right moment. |
| **4. Reward Loop** | Each completed stop earns coins. Guests redeem perks, upgrades, and surprise rewards as they move through the plan. |
| **5. Autonomous Journey Planning** | Planning, navigation, and live guidance work together in one seamless flow. Guests enjoy more and stress less. |

---

## Features

- **AI Journey Planner** — Personalized itineraries based on dates, budget, interests, and preferences
- **Interactive Discovery Flow** — Step-by-step onboarding that builds a complete travel profile
- **Visual Roadmap** — Synced list and map view with instant navigation between stops
- **Live Guidance** — Real-time assistant that syncs to your calendar and helps at the right moment
- **Gamified Rewards** — Earn coins for completing stops; redeem perks, upgrades, and surprises
- **Curated for Kuriftu** — Tailored for Kuriftu Hospitality destinations and experiences

---

## Tech Stack

| Category | Technology |
| :------- | :--------- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (New York style) |
| Authentication | Clerk |
| State Management | Zustand 5 |
| Data Fetching | TanStack React Query |
| Forms | TanStack Form + Zod |
| Charts | Recharts |
| Maps | Leaflet / Mapbox |
| Error Tracking | Sentry |

---

## Getting Started

```bash
bun install
cp env.example.txt .env.local
bun run dev
```

Visit **http://localhost:3000** to start planning.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Sign-in / Sign-up
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/            # Shared components
│   ├── ui/                # shadcn/ui primitives
│   └── journey/           # Journey-specific components
├── features/              # Feature modules
├── lib/                   # Utilities
├── hooks/                 # Custom hooks
├── config/                # Navigation & config
├── constants/             # Mock data
├── styles/                # CSS & themes
└── types/                 # TypeScript types
```

---

## Deployment

```bash
# Node.js
docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_... -t wonderai .

docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_... \
  -e CLERK_SECRET_KEY=sk_... \
  --name wonderai wonderai
```

---

<div align="center">
  <p><strong>Wonder AI</strong> — Built for the Kuriftu Hospitality Hackathon</p>
  <p>Copyright © 2025 All rights reserved.</p>
</div>
