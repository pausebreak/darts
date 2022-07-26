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
        setGame: (game) =>
          set((state) => {
            state.game = game;
            state.currentPlayerIndex = 0;
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
        goBack: () =>
          set((state) => {
            let player = state.players[state.currentPlayerIndex];
            const length = state.players.length;

            // no thrown darts .. bail
            if (
              !state.players.some((player) => {
                player.darts.length !== 0;
              })
            ) {
              return;
            }

            // player has not thrown yet this round
            // have to set previous player
            if (player.darts.length % 3 === 0) {
              if (state.currentPlayerIndex === 0) {
                player = state.players[length - 1];
                state.currentPlayerIndex = length - 1;
              } else {
                state.currentPlayerIndex--;
                player = state.players[state.currentPlayerIndex];
              }
            }

            player.darts.pop();
          }),
      }))
    ),
    {
      name: "dart-game-state", // name of item in the storage (must be unique)
    }
  )
);

useStore.subscribe(
  (state) => state.players,
  (players) => {
    const game = useStore.getState().game;
    const currentPlayerIndex = useStore.getState().currentPlayerIndex;
    const winner = gameOperations(game).didWin(players, currentPlayerIndex);

    if (winner) {
      // last person to throw won
      useStore.getState().setPlayerWon(winner);
    }
  }
);
