import { areMarksCleared, currentRound, dartValue, findLastPlayerToThrow, isMarkClearedForEveryone } from "../games";
import { Game, Mark, GameOperations, GameName, Multiple, Player } from "../types";
import { dartsInThrownOrder } from "./calculations";

const calculateStats = (game: Game, players: Player[]): { scores: number[]; marks: number[] } => {
  const emptyMarks = game.marks.reduce((acc, mark) => {
    acc[mark] = 0;
    return acc;
  }, {});
  const playersToMarks: { [mark: number]: number }[] = new Array(players.length)
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

    const otherPlayersHaveNotClosedMark = playersToMarks
      .filter((p, index) => index !== playerIndex)
      .some((p) => p[mark] < 3);

    const playerMarksSoFar = playersToMarks[playerIndex][mark];

    const canScore = otherPlayersHaveNotClosedMark && playerMarksSoFar + multiple > 3;

    if (canScore) {
      const playersWhoGetScored = playersToMarks.slice();
      delete playersWhoGetScored[playerIndex];

      playersToMarks.forEach((playerMarks, index) => {
        if (playerMarks[mark] >= 3) {
          delete playersWhoGetScored[index];
        }
      });

      // this index can't be right
      playersWhoGetScored.forEach((scoredPlayer, index) => {
        const playerMarksSoFar = playersToMarks[playerIndex][mark];

        let scoringValue = 0;
        if (playerMarksSoFar >= 3) {
          scoringValue = dartValue([mark, multiple]);
        } else {
          const diff = 3 - playerMarksSoFar;
          scoringValue = dartValue([mark, multiple - diff]);
        }

        playersToScore[index] += scoringValue;
      });
    }

    playersToMarks[playerIndex][mark] += multiple;

    if (otherPlayersHaveNotClosedMark) {
      playersToCountableMarksTotal[playerIndex] += multiple;
    } else if (playerMarksSoFar < 3) {
      const overage = playerMarksSoFar + multiple;
      let diff = 0;
      if (overage > 3) {
        diff = 3 - playerMarksSoFar;
      } else {
        diff = multiple;
      }

      playersToCountableMarksTotal[playerIndex] += diff;
    }
  });

  return { scores: playersToScore, marks: playersToCountableMarksTotal };
};

export const cutThroatOperations = (game: Game): GameOperations => ({
  didWin: (players, currentPlayerIndex: number) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);
    const cleared = areMarksCleared(game, player);

    if (cleared) {
      const scores = calculateStats(game, players).scores;
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

    if (dart[0] === Mark.Bull && dart[1] === Multiple.Triple) {
      return false;
    }

    return !isMarkClearedForEveryone(players, dart[0]);
  },
  stats: (players) => calculateStats(game, players),
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
