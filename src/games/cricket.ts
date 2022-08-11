import {
  areMarksCleared,
  findLastPlayerToThrow,
  isMarkCleared,
  isMarkClearedForEveryone,
  playersScoresCricket,
} from "../games";
import { Game, Mark, GameOperations, GameName } from "../types";

export const cricketOperations = (game: Game): GameOperations => ({
  didWin: (players, currentPlayerIndex: number) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);
    const cleared = areMarksCleared(game, player);

    if (!game.pointing && cleared) {
      return player;
    }

    if (cleared) {
      const scores = playersScoresCricket(game, players);
      const playerIndex = players.findIndex((p) => p.name === player.name);
      const playerScore = scores[playerIndex];

      if (scores.filter((s, index) => index !== playerIndex).every((score) => score < playerScore)) {
        return player;
      }
    }
  },
  validThrow: (playerIndex, players, dart) => {
    const currentPlayer = players[playerIndex];

    if (dart[0] === Mark.Miss) {
      return true;
    }

    if (!game.marks.includes(dart[0])) {
      return false;
    }

    if (game.pointing) {
      return !isMarkClearedForEveryone(players, dart[0]);
    } else {
      return !isMarkCleared(currentPlayer, dart[0]);
    }
  },
});

export const cricket = (pointing: boolean): Game => ({
  name: GameName.Cricket,
  checkIn: null,
  checkOut: null,
  limit: 0,
  clear: true,
  pointing,
  marks: [Mark.Twenty, Mark.Nineteen, Mark.Eighteen, Mark.Seventeen, Mark.Sixteen, Mark.Fifteen, Mark.Bull],
});
