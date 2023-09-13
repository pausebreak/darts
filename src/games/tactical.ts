import {
  areMarksCleared,
  currentRound,
  dartValue,
  findLastPlayerToThrow,
  isMarkCleared,
  isMarkClearedForEveryone,
} from "../games";
import { Game, Mark, GameOperations, GameName, Multiple, Player, Dart } from "../types";

const calculateStats = (game: Game, players: Player[]): { scores: number[]; marks: number[] } => {
  const emptyMarks = game.marks.reduce((acc, mark) => {
    acc[mark] = 0;

    return acc;
  }, {});
  const playerToMarks: { [mark: number]: number }[] = new Array(players.length)
    .fill({})
    .map(() => JSON.parse(JSON.stringify(emptyMarks)));
  const playersToMarkTotal: number[] = new Array(players.length).fill(0);
  const playersToScore: number[] = new Array(players.length).fill(0);
  const highestRound = currentRound(players);
  const dartsInOrderThrown: [dart: Dart, playerIndex: number][] = [];

  for (let round = 0; round <= highestRound; round++) {
    players.forEach((player, playerIndex) => {
      const first = player.darts[round * 3];
      const second = player.darts[round * 3 + 1];
      const third = player.darts[round * 3 + 2];

      if (first) {
        dartsInOrderThrown.push([first, playerIndex]);
      }

      if (second) {
        dartsInOrderThrown.push([second, playerIndex]);
      }

      if (third) {
        dartsInOrderThrown.push([third, playerIndex]);
      }
    });
  }

  dartsInOrderThrown.forEach((dartTuple) => {
    const playerIndex = dartTuple[1];
    const dart = dartTuple[0];

    if (dart[0] === Mark.Miss) {
      return;
    }

    const otherPlayersHaveNotClosedMark = playerToMarks
      .filter((p, index) => index !== playerIndex)
      .some((p) => p[dart[0]] < 3);

    if (otherPlayersHaveNotClosedMark) {
      const playerMarksSoFar = playerToMarks[playerIndex][dart[0]];
      const marksWithCurrentDart = playerMarksSoFar + dart[1];

      if (marksWithCurrentDart > 3) {
        if (playerMarksSoFar >= 3) {
          playersToScore[playerIndex] = playersToScore[playerIndex] + dartValue(dart);
        } else {
          const diff = playerMarksSoFar - 3 + dart[1];
          playersToScore[playerIndex] = playersToScore[playerIndex] + dartValue([dart[0], diff]);
        }
      }
    }

    playersToMarkTotal[playerIndex] = playersToMarkTotal[playerIndex] + dart[1];

    // finally add to player marks
    playerToMarks[playerIndex][dart[0]] = playerToMarks[playerIndex][dart[0]] + dart[1];
  });

  return { scores: playersToScore, marks: playersToMarkTotal };
};

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

    if (dart[0] === Mark.Miss) {
      return true;
    }

    if (!game.marks.includes(dart[0])) {
      return false;
    }

    if ([Mark.Double, Mark.Triple].includes(dart[0]) && dart[1] !== Multiple.Single) {
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
