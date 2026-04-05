# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A dart game scoring app built with React, Zustand (with Immer middleware), and Parcel. Designed for mobile/touch use — maximizes tap targets for small screens, with scores legible from ~1 meter away. Deployed to GitHub Pages at https://pausebreak.github.io/darts/.

## Commands

- `pnpm start` — dev server (Parcel)
- `pnpm run build` — production build (outputs to `docs/` for GitHub Pages)
- `pnpm test` — type-check (`tsc --noEmit`) then run Jest
- `pnpm run check` — type-check only
- `pnpm exec jest path/to/file.test.ts` — run a single test file
- `pnpm exec jest --testPathPattern="bulls"` — run tests matching a pattern
- `pnpm run lint` — ESLint on `src/`
- `pnpm run coverage` — Jest with coverage (100% required on `src/games/**` and `src/games.ts`)

## Architecture

### State Management (`src/machine.ts`)

Single Zustand store (`useStore`) with Immer + persist + subscribeWithSelector middleware. This is the central state for the entire app — game selection, players, throws, current player index, winner, sound preferences. State is persisted to localStorage under `"dart-game-state"`.

### Subscribers (`src/subscribers.ts`)

Zustand `subscribeWithSelector` drives side effects: win detection, sound playback (Howler), speech synthesis for player names, and auto-advance timer (9s timeout that auto-fills misses and advances to next player).

### Game Logic (`src/games/`)

Each game type (Bulls, Cricket, CutThroat, Oh1, Tactical) has its own file exporting a config object and a `GameOperations` implementation with `validThrow`, `didWin`, and optional `didBust`/`stats`. The `gameOperations()` function in `src/games.ts` dispatches to the right implementation based on `GameName`.

Game logic has 100% test coverage enforced in `jest.config.js` — all game logic changes must maintain this.

### Core Types (`src/types.ts`)

- `Dart` — tuple of `[Mark, Multiple, points?]`
- `Player` — name + array of Darts
- `Game` — config (marks, multiples, checkIn/checkOut, limit, pointing flag)
- `GameOperations` — interface each game implements

### UI Flow (`src/components/App.tsx`)

Three states: GamePrep (player + game selection) → GameLayout (active game with scoreboard/touch input) → PostGame (winner display). Cricket/CutThroat/Tactical use `TouchScoreBoard`; Bulls/Oh1 use `Players` + `TouchInput`.

### Build

Parcel bundles from `src/index.html`. The `prebuild`/`prestart` scripts copy static assets from `src/static/` to `dist/`. Production build targets `docs/` directory for GitHub Pages deployment.
