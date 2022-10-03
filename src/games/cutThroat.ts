import { areMarksCleared, findLastPlayerToThrow, isMarkClearedForEveryone, playersScoresCutThroat } from "../games";
import { Game, Mark, GameOperations, GameName, Multiple } from "../types";

export const cutThroatOperations = (game: Game): GameOperations => ({
  didWin: (players, currentPlayerIndex: number) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);

    if (!player) {
      return;
    }

    const cleared = areMarksCleared(game, player);

    if (cleared) {
      const scores = playersScoresCutThroat(game, players);
      const playerIndex = players.findIndex((p) => p.name === player.name);
      const playerScore = scores[playerIndex];

      if (scores.filter((s, index) => index !== playerIndex).every((score) => score >= playerScore)) {
        return player;
      }
    }
  },
  validThrow: (playerIndex, players, dart) => {
    if (dart[0] === Mark.Miss) {
      return true;
    }

    if (!game.marks.includes(dart[0])) {
      return false;
    }

    return !isMarkClearedForEveryone(players, dart[0]);
  },
});

export const cutThroat = (): Game => ({
  name: GameName.CutThroat,
  checkIn: null,
  checkOut: null,
  limit: 0,
  clear: true,
  pointing: true,
  marks: [Mark.Twenty, Mark.Nineteen, Mark.Eighteen, Mark.Seventeen, Mark.Sixteen, Mark.Fifteen, Mark.Bull],
  multiples: [Multiple.Single, Multiple.Double, Multiple.Triple],
});
