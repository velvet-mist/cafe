# Cafe To-Do

Cafe To-Do is a cozy React planner app for daily tasks, study planning, yearly tracking, music saves, and journal-style daily stories.

Live app: https://cafe-umtb.vercel.app/

## Features

- Daily planner with tasks, notes, schedule blocks, and a task picker wheel
- Home dashboard with quick tasks and coffee-style progress
- Yearly planner for marking important days
- Study planner for assignments, class schedules, and notes
- Music list with Spotify track embeds
- Daily story journal with mood tracking and word count
- Login and signup pages backed by API authentication

## Tech Stack

- React
- React Scripts / Create React App
- CSS
- Vercel
- Backend API configured through `REACT_APP_API_BASE`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app runs at http://localhost:3000.

## Environment Variables

Create a `.env` file in the project root if you need to point the frontend at a backend other than the local default:

```bash
REACT_APP_API_BASE=http://localhost:8000
```

For production on Vercel, set `REACT_APP_API_BASE` to the deployed backend URL.

## Available Scripts

```bash
npm start
```

Runs the app in development mode.

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

```bash
npm test
```

Runs the test watcher.

## Deployment

This project is deployed on Vercel:

https://cafe-umtb.vercel.app/

Before deploying, make sure `npm run build` passes locally and the production `REACT_APP_API_BASE` environment variable is set in Vercel.
