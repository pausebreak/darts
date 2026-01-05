import { currentRound, findLastPlayerToThrow, gameOperations } from "./games";
import { countAllDarts } from "./games/calculations";
import { applyNextPlayer, useStore as machineUseStore } from "./machine";
import { sayPhrase, sound } from "./sound";
import { Mark, Multiple, Player } from "./types";

const autoForwardTimeoutInMillis = 9000;

export const initializeSubscribers = (useStore: typeof machineUseStore) => {
  useStore.subscribe(
    (state) => state.players,
    (players) => {
      const game = useStore.getState().game;
      const currentPlayerIndex = useStore.getState().currentPlayerIndex;
      const currentPlayer = players[currentPlayerIndex];
      const winner = gameOperations(game).didWin(players, currentPlayerIndex);
      const round = currentRound(players);
      const dartsCount = countAllDarts(players);

      if (winner) {
        useStore.getState().setWinner(winner);

        // never auto advance if no darts have been entered for the round
        // or if the feature is turned off
      } else if (useStore.getState().useAutoForward && currentPlayer?.darts.length % 3) {
        setTimeout(() => {
          useStore.setState((state) => {
            const roundIsSame = round === currentRound(state.players);
            const playerIsSame = currentPlayerIndex === state.currentPlayerIndex;
            const dartsAreSame = dartsCount === countAllDarts(state.players);

            // make sure state is the same as when we started the timeout via closures
            if (roundIsSame && playerIsSame && dartsAreSame) {
              const { players, currentPlayerIndex } = state;
              const numberThrown = players[currentPlayerIndex].darts.length;
              const player = state.players[currentPlayerIndex];

              for (let i = numberThrown % 3; i < 3; i++) {
                player.darts.push([Mark.Miss, Multiple.Single]);
              }

              applyNextPlayer(currentPlayerIndex, state);
            }
          });
        }, autoForwardTimeoutInMillis);
      }
    }
  );

  useStore.subscribe(
    (state) => [state.invalidThrow, state.useSound],
    ([invalidThrow, useSound]) => {
      if (invalidThrow && useSound) {
        sound().error.play();
      }
    }
  );

  useStore.subscribe(
    (state) => [state.playerBusted, state.useSound],
    ([playerBusted, useSound]) => {
      if (playerBusted) {
        if (useSound) {
          sound().broken.play("start");
        }
        useStore.getState().setPlayerBusted(null);
      }
    }
  );

  if ("speechSynthesis" in window) {
    useStore.subscribe(
      (state) => [state.currentPlayerIndex, state.players, state.game, state.useSound, state.voiceIndex],
      ([currentPlayerIndex, players, game, useSound, voiceIndex], [previousPlayerIndex]) => {
        if (useSound && currentPlayerIndex !== previousPlayerIndex && game !== null) {
          const name = players[currentPlayerIndex as number].name;

          sayPhrase(name, voiceIndex as number);
        }
      }
    );
  }

  useStore.subscribe(
    (state) => [state.players, state.currentPlayerIndex, state.useSound],
    ([players, currentPlayerIndex, useSound], [oldPlayers]) => {
      if (useSound) {
        const newLength = (players as Player[]).reduce((acc, player) => acc + player.darts.length, 0);
        const oldLength = (oldPlayers as Player[]).reduce((acc, player) => acc + player.darts.length, 0);
        const lastPlayer = findLastPlayerToThrow(players as Player[], currentPlayerIndex as number);
        const dartsLength = lastPlayer?.darts.length;

        if (dartsLength) {
          const dart = lastPlayer.darts[dartsLength - 1];
          if (newLength > oldLength && dart[0] !== Mark.Miss) {
            sound().dart.play();
          }
        }
      }
    }
  );
};
