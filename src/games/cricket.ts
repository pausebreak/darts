import {
  areMarksCleared,
  currentRound,
  dartValue,
  findLastPlayerToThrow,
  isMarkCleared,
  isMarkClearedForEveryone,
} from "../games";
import { Game, Mark, GameOperations, GameName, Multiple, Player } from "../types";
import { dartsInThrownOrder } from "./calculations";

const calculateStats = (
  game: Game,
  players: Player[]
): { scores: number[]; marks: number[]; countableMarks: number[] } => {
  const emptyMarks = game.marks.reduce((acc, mark) => {
    acc[mark] = 0;

    return acc;
  }, {});
  const playerToMarks: { [mark: number]: number }[] = new Array(players.length)
    .fill({})
    .map(() => JSON.parse(JSON.stringify(emptyMarks)));
  const playersToMarkTotal: number[] = new Array(players.length).fill(0);
  const playersToCountableMarksTotal: number[] = new Array(players.length).fill(0);
  const playersToScore: number[] = new Array(players.length).fill(0);
  const highestRoundOverall = currentRound(players);

  dartsInThrownOrder(highestRoundOverall, players).forEach((dartTuple) => {
    const [[mark, multiple], playerIndex] = dartTuple;

    if (mark === Mark.Miss) {
      return;
    }

    const playerMarksSoFar = playerToMarks[playerIndex][mark];
    const marksWithCurrentDart = playerMarksSoFar + multiple;

    if (game.pointing) {
      const otherPlayersHaveNotClosedMark = playerToMarks
        .filter((p, index) => index !== playerIndex)
        .some((p) => p[mark] < 3);

      if (otherPlayersHaveNotClosedMark) {
        if (marksWithCurrentDart > 3) {
          if (playerMarksSoFar >= 3) {
            playersToScore[playerIndex] += dartValue([mark, multiple]);
          } else {
            const diff = playerMarksSoFar - 3 + multiple;
            playersToScore[playerIndex] += dartValue([mark, diff]);
          }
        }
        playersToCountableMarksTotal[playerIndex] += multiple;
      } else {
        if (marksWithCurrentDart > 3) {
          const diff = 3 - playerMarksSoFar;
          playersToCountableMarksTotal[playerIndex] += diff;
        }
      }
    } else {
      if (marksWithCurrentDart > 3) {
        const diff = 3 - playerMarksSoFar;
        playersToCountableMarksTotal[playerIndex] += diff;
      } else {
        playersToCountableMarksTotal[playerIndex] += multiple;
      }
    }

    playersToMarkTotal[playerIndex] += multiple;

    // finally add to player marks
    playerToMarks[playerIndex][mark] += multiple;
  });

  return { scores: playersToScore, marks: playersToMarkTotal, countableMarks: playersToCountableMarksTotal };
};

export const cricketOperations = (game: Game): GameOperations => ({
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

    if (dart[0] === Mark.Miss) {
      return true;
    }

    if (!game.marks.includes(dart[0])) {
      return false;
    }

    if (dart[0] === Mark.Bull && dart[1] === Multiple.Triple) {
      return false;
    }

    if (game.pointing) {
      return !isMarkClearedForEveryone(players, dart[0]);
    } else {
      return !isMarkCleared(currentPlayer, dart[0]);
    }
  },
  stats: (players) => calculateStats(game, players),
});

export const cricket = (pointing: boolean): Game => ({
  name: GameName.Cricket,
  checkIn: null,
  checkOut: null,
  limit: 0,
  clear: true,
  pointing,
  marks: [Mark.Twenty, Mark.Nineteen, Mark.Eighteen, Mark.Seventeen, Mark.Sixteen, Mark.Fifteen, Mark.Bull],
  multiples: [Multiple.Single, Multiple.Double, Multiple.Triple],
});
