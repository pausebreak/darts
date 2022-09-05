import { findLastPlayerToThrow, gameOperations } from "./games";
import { useStore as machineUseStore } from "./machine";
import { brokenSound, dartSound, errorSound } from "./sound";
import { Mark, Player } from "./types";

export const initializeSubscribers = (useStore: typeof machineUseStore) => {
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

  useStore.subscribe(
    (state) => state.invalidThrow,
    (invalidThrow) => {
      if (invalidThrow) {
        errorSound.play();
      }
    }
  );

  useStore.subscribe(
    (state) => state.playerBusted,
    (playerBusted) => {
      if (playerBusted) {
        brokenSound.play("start");
        useStore.getState().setPlayerBusted(null);
      }
    }
  );

  if ("speechSynthesis" in window) {
    useStore.subscribe(
      (state) => [state.currentPlayerIndex, state.players, state.game],
      ([currentPlayerIndex, players, game], [previousPlayerIndex]) => {
        if (currentPlayerIndex !== previousPlayerIndex && game !== null) {
          const name = players[currentPlayerIndex as number].name;
          const utterance = new SpeechSynthesisUtterance(name);

          window.speechSynthesis.speak(utterance);
        }
      }
    );
  }

  useStore.subscribe(
    (state) => [state.players, state.currentPlayerIndex],
    ([players, currentPlayerIndex], [oldPlayers]) => {
      const newLength = (players as Player[]).reduce((acc, player) => acc + player.darts.length, 0);
      const oldLength = (oldPlayers as Player[]).reduce((acc, player) => acc + player.darts.length, 0);
      const lastPlayer = findLastPlayerToThrow(players as Player[], currentPlayerIndex as number);
      const dartsLength = lastPlayer?.darts.length;

      if (dartsLength) {
        const dart = lastPlayer.darts[dartsLength - 1];
        if (newLength !== oldLength && dart[0] !== Mark.Miss) {
          dartSound.play();
        }
      }
    }
  );
};
