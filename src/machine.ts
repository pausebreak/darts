import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Game, Player, Dart } from "./types";

import { subscribeWithSelector } from "zustand/middleware";
import { gameOperations } from "./games";

export type GameState = {
  players: Player[];
  addPlayer(player: Player): void;
  removePlayer(playerId: number): void;
  game: Game;
  setGame(game: Game): void;
  currentPlayerIndex: number;
  invalidThrow: boolean;
  setInvalidThrow(valid: boolean): void;
  addThrowToCurrentPlayer(_throw: Dart): void;
  goBack(): void;
  playerWon: Player;
  setPlayerWon(player: Player): void;
};

export const useStore = create<GameState>()(
  persist(
    immer(
      subscribeWithSelector((set, get) => ({
        players: [],
        playerWon: null,
        currentPlayerIndex: null,
        game: null,
        invalidThrow: false,
        setPlayerWon: (player) => {
          set((state) => {
            state.playerWon = player;
          });
        },
        addPlayer: (player) =>
          set((state) => {
            state.players.push(player);
          }),
        removePlayer: (playerId) =>
          set((state) => {
            state.players.splice(playerId, 1);
          }),
        setInvalidThrow: (valid) =>
          set((state) => {
            state.invalidThrow = valid;
          }),
        setGame: (game) =>
          set((state) => {
            state.game = game;
            state.currentPlayerIndex = game ? 0 : null;
            state.playerWon = null;
            state.invalidThrow = false;

            // clear throws
            state.players = state.players.map((player) => {
              player.darts = [];
              return player;
            });
          }),
        addThrowToCurrentPlayer: (dart) => {
          const { game, players, currentPlayerIndex } = get();
          if (!gameOperations(game).validThrow(currentPlayerIndex, players, dart)) {
            set((draft) => {
              draft.invalidThrow = true;
            });
          } else {
            set((draft) => {
              draft.invalidThrow = false;
              const player = draft.players[currentPlayerIndex];
              player.darts.push(dart);

              // end of the round for the current player
              if (player.darts.length % 3 === 0) {
                if (currentPlayerIndex + 1 === players.length) {
                  draft.currentPlayerIndex = 0;
                } else {
                  draft.currentPlayerIndex++;
                }
              }
            });
          }
        },
        goBack: () => {
          set((state) => {
            const players = state.players;
            let player = players[state.currentPlayerIndex];
            const noThrowsYet = !players.find((player) => player.darts.length !== 0);

            if (noThrowsYet) {
              return;
            }

            // player has not thrown yet this round
            // have to set previous player
            if (player.darts.length % 3 === 0) {
              if (state.currentPlayerIndex === 0) {
                player = state.players[players.length - 1];
                state.currentPlayerIndex = players.length - 1;
              } else {
                state.currentPlayerIndex--;
                player = state.players[state.currentPlayerIndex];
              }
            }

            player.darts.pop();
          });
        },
      }))
    ),
    {
      name: "dart-game-state", // name of item in the storage (must be unique)
    }
  )
);
