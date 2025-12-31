import {
  areMarksCleared,
  currentRound,
  dartValue,
  findLastPlayerToThrow,
  isMarkCleared,
  isMarkClearedForEveryone,
} from "../games";
import { Game, Mark, GameOperations, GameName, Multiple, Player } from "../types";
import { actualMarksNotPointing, dartsInThrownOrder } from "./calculations";

const calculateStats = (game: Game, players: Player[]): { scores: number[]; marks: number[] } => {
  const emptyMarks = game.marks.reduce((acc, mark) => {
    acc[mark] = 0;

    return acc;
  }, {});
  const playerToMarks: { [mark: number]: number }[] = new Array(players.length)
    .fill({})
    .map(() => JSON.parse(JSON.stringify(emptyMarks)));
  const playersToCountableMarksTotal: number[] = new Array(players.length).fill(0);
  const playersToScore: number[] = new Array(players.length).fill(0);
  const highestRound = currentRound(players);

  dartsInThrownOrder(highestRound, players).forEach((dartTuple) => {
    const [[mark, multiple], playerIndex] = dartTuple;

    if (mark === Mark.Miss) {
      return;
    }

    // this will go over 3 because we are blindly summing so clamp it to 3
    const playerMarksSoFar = Math.min(playerToMarks[playerIndex][mark], 3);

    const otherPlayersHaveNotClosedMark = playerToMarks
      .filter((_, index) => index !== playerIndex)
      .some((p) => p[mark] < 3);

    if (otherPlayersHaveNotClosedMark) {
      if (playerMarksSoFar + multiple > 3) {
        playersToScore[playerIndex] += dartValue([mark, playerMarksSoFar + multiple - 3]);
      }
      // count all the marks either way
      playersToCountableMarksTotal[playerIndex] += multiple;
    } else {
      // when everyone else has closed you get marks like we're not pointing
      playersToCountableMarksTotal[playerIndex] += actualMarksNotPointing(multiple, playerMarksSoFar);
    }

    // finally add to player marks
    playerToMarks[playerIndex][mark] += multiple;
  });

  return { scores: playersToScore, marks: playersToCountableMarksTotal };
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
