# Football Analytics Web App

A modern football analytics web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Homepage
- Displays today's football matches
- Shows team names, logos, match time, and status
- Clickable match cards that navigate to match details

### Match Details Page
- Teams, score, match time
- Lineups (starting XI for both teams)
- Match events (goals, cards, substitutions) with timeline
- Match statistics:
  - Possession percentage
  - Shots (total and on target)
  - Pass accuracy
- Player ratings (0-10)
- Tactical analysis with formation visualization and descriptions

### Player Page
- Player information (name, position, team)
- Match statistics:
  - Minutes played
  - Goals and assists
  - Pass accuracy
  - Duels won
  - Overall rating

### UI Features
- Clean, modern design
- Dark mode support (follows system preference)
- Fully responsive layout
- Card-based components
- Grid layouts for optimal space usage

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data:** Mock JSON data (easily replaceable with real API)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── match/[id]/page.tsx   # Match details
│   └── player/[id]/page.tsx  # Player details
├── components/
│   ├── MatchCard.tsx
│   ├── MatchStats.tsx
│   ├── Lineup.tsx
│   ├── PlayerCard.tsx
│   └── TacticalBoard.tsx
├── data/
│   ├── teams.json
│   ├── players.json
│   ├── matches.json
│   └── playerStats.json
├── lib/
│   └── data.ts               # Data loading utilities
└── types/
    └── index.ts              # TypeScript interfaces
```

## Data Structure

The app uses mock JSON data stored in `src/data/`. The data includes:

- Teams with basic info and formations
- Players with team associations
- Matches with detailed stats and events
- Player performance stats per match

## Future Enhancements

- Integrate with real football APIs (e.g., Football-Data.org)
- Add live match updates
- Implement charts for statistics visualization
- Add match timeline with interactive events
- User authentication and favorites
- Multiple leagues support
- Search and filtering functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Football data and logos are property of their respective owners.
