import { areMarksCleared, findLastPlayerToThrow, isMarkCleared, isMarkClearedForEveryone } from "../games";
import { Game, Mark, GameOperations, GameName, Multiple } from "../types";
import { calculateStatsForCricketOrTactical } from "./calculations";

const calculateStats = calculateStatsForCricketOrTactical;

export const tacticalOperations = (game: Game): GameOperations => ({
  didWin: (players, currentPlayerIndex: number) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);
    const cleared = areMarksCleared(game, player);

    if (!game.pointing && cleared) {
      return player;
    }

    if (cleared) {
      const scores = calculateStats(game, players).scores;
      const playerIndex = players.findIndex((p) => p.name === player.name);
      const playerScore = scores[playerIndex];

      if (scores.filter((s, index) => index !== playerIndex).every((score) => score < playerScore)) {
        return player;
      }
    }
  },
  validThrow: (playerIndex, players, dart) => {
    const currentPlayer = players[playerIndex];
    const [mark, multiple] = dart;

    if (mark === Mark.Miss) {
      return true;
    }

    if (!game.marks.includes(mark)) {
      return false;
    }

    if ([Mark.Double, Mark.Triple].includes(mark) && multiple !== Multiple.Single) {
      return false;
    }

    if (dart[0] === Mark.Bull && multiple === Multiple.Triple) {
      return false;
    }

    if (game.pointing) {
      return !isMarkClearedForEveryone(players, mark);
    } else {
      return !isMarkCleared(currentPlayer, mark);
    }
  },
  stats: (players) => calculateStats(game, players),
});

export const tactical = (pointing: boolean): Game => ({
  name: GameName.Tactical,
  checkIn: null,
  checkOut: null,
  limit: 0,
  clear: true,
  pointing,
  marks: [
    Mark.Twenty,
    Mark.Nineteen,
    Mark.Eighteen,
    Mark.Seventeen,
    Mark.Sixteen,
    Mark.Fifteen,
    Mark.Bull,
    Mark.Double,
    Mark.Triple,
  ],
  multiples: [Multiple.Single, Multiple.Double, Multiple.Triple],
});
