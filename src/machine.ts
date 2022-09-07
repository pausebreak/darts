import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Game, Player, Dart, GameName, Multiple, Mark } from "./types";

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
  playerBusted: Player;
  setPlayerBusted(player: Player): void;
  movePlayerLeft(playerIndex: number): void;
  movePlayerRight(playerIndex: number): void;
};

// this is mutating
const applyNextPlayer = (currentPlayerIndex: number, draft: GameState) => {
  if (currentPlayerIndex + 1 === draft.players.length) {
    draft.currentPlayerIndex = 0;
  } else {
    draft.currentPlayerIndex++;
  }
};

// this is mutating
const applyDart = (draft: GameState, currentPlayerIndex: number, dart: Dart) => {
  draft.invalidThrow = false;
  const player = draft.players[currentPlayerIndex];
  player.darts.push(dart);

  // end of the round for the current player
  if (player.darts.length % 3 === 0) {
    applyNextPlayer(currentPlayerIndex, draft);
  }
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
        playerBusted: null,
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
            if (game.name === GameName.Oh1 && gameOperations(game).didBust(currentPlayerIndex, players, dart)) {
              set((draft) => {
                const player = draft.players[currentPlayerIndex];
                const brokenThrows = player.darts.length % 3;

                player.darts.splice(-brokenThrows);

                player.darts.push(
                  [Mark.Miss, Multiple.Single],
                  [Mark.Miss, Multiple.Single],
                  [Mark.Miss, Multiple.Single]
                );

                draft.playerBusted = player;

                applyNextPlayer(currentPlayerIndex, draft);
              });
            } else {
              set((draft) => {
                applyDart(draft, currentPlayerIndex, dart);
              });
            }
          }
        },
        setPlayerBusted: (player) =>
          set((draft) => {
            draft.playerBusted = player;
          }),
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
        movePlayerLeft: (index) => {
          set((state) => {
            const newIndex = index === 0 ? state.players.length - 1 : index - 1;
            state.players.splice(newIndex, 0, state.players.splice(index, 1)[0]);
          });
        },
        movePlayerRight: (index) => {
          set((state) => {
            const newIndex = index === state.players.length - 1 ? 0 : index + 1;
            state.players.splice(newIndex, 0, state.players.splice(index, 1)[0]);
          });
        },
      }))
    ),
    {
      name: "dart-game-state", // name of item in the storage (must be unique)
    }
  )
);
