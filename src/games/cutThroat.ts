import { areMarksCleared, currentRound, dartValue, findLastPlayerToThrow, isMarkClearedForEveryone } from "../games";
import { Game, Mark, GameOperations, GameName, Multiple, Player, Dart } from "../types";

const calculateStats = (game: Game, players: Player[]): { scores: number[]; marks: number[] } => {
  const emptyMarks = game.marks.reduce((acc, mark) => {
    acc[mark] = 0;
    return acc;
  }, {});
  const playersToMarks: { [mark: number]: number }[] = new Array(players.length)
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

    const canScore = playersToMarks[playerIndex][dart[0]] + dart[1] > 3;

    if (canScore) {
      const playersWhoGetScored = playersToMarks.slice();
      delete playersWhoGetScored[playerIndex];

      playersToMarks.forEach((playerMarks, index) => {
        if (playerMarks[dart[0]] >= 3) {
          delete playersWhoGetScored[index];
        }
      });

      playersWhoGetScored.forEach((scoredPlayer, index) => {
        const playerMarksSoFar = playersToMarks[playerIndex][dart[0]];

        let scoringValue = 0;
        if (playerMarksSoFar >= 3) {
          scoringValue = dartValue(dart);
        } else {
          const diff = Math.abs(playerMarksSoFar - 3);

          scoringValue = dartValue([dart[0], dart[1] - diff]);
        }

        playersToScore[index] = playersToScore[index] + scoringValue;
      });
    }

    playersToMarkTotal[playerIndex] = playersToMarkTotal[playerIndex] + dart[1];

    playersToMarks[playerIndex][dart[0]] = playersToMarks[playerIndex][dart[0]] + dart[1];
  });

  return { scores: playersToScore, marks: playersToMarkTotal };
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
