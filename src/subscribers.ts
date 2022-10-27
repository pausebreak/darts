import isBlank from "@sedan-utils/is-blank";
import { findLastPlayerToThrow, gameOperations } from "./games";
import { useStore as machineUseStore } from "./machine";
import { sound } from "./sound";
import { Mark, Player } from "./types";

export const initializeSubscribers = (useStore: typeof machineUseStore) => {
  useStore.subscribe(
    (state) => state.players,
    (players) => {
      const game = useStore.getState().game;
      const currentPlayerIndex = useStore.getState().currentPlayerIndex;
      const winner = gameOperations(game).didWin(players, currentPlayerIndex);

      if (winner) {
        useStore.getState().setWinner(winner);
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
          const utterance = new SpeechSynthesisUtterance(name);

          if (!isBlank(voiceIndex)) {
            const voices = window.speechSynthesis.getVoices();
            if (voices?.length) {
              utterance.voice = voices[voiceIndex as number];
            }
          }

          // these can stack up if you hit 'next' real fast like
          // cancelling cuts that off
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
      }
    );
  }

  useStore.subscribe(
    (state) => [state.players, state.currentPlayerIndex, state.useSound],
    ([players, currentPlayerIndex, useSound], [oldPlayers]) => {
      const newLength = (players as Player[]).reduce((acc, player) => acc + player.darts.length, 0);
      const oldLength = (oldPlayers as Player[]).reduce((acc, player) => acc + player.darts.length, 0);
      const lastPlayer = findLastPlayerToThrow(players as Player[], currentPlayerIndex as number);
      const dartsLength = lastPlayer?.darts.length;

      if (dartsLength) {
        const dart = lastPlayer.darts[dartsLength - 1];
        if (newLength > oldLength && dart[0] !== Mark.Miss) {
          if (useSound) {
            sound().dart.play();
          }
        }
      }
    }
  );
};
