import { currentRound, dartValue } from "../games";
import { Dart, Game, Mark, Player } from "../types";

export const dartsInThrownOrder = (highestRound: number, players: Player[]): [dart: Dart, playerIndex: number][] => {
  const orderedDarts = [];

  for (let round = 0; round <= highestRound; round++) {
    players.forEach((player, playerIndex) => {
      const first = player.darts[round * 3];
      const second = player.darts[round * 3 + 1];
      const third = player.darts[round * 3 + 2];

      if (first) {
        orderedDarts.push([first, playerIndex]);
      }

      if (second) {
        orderedDarts.push([second, playerIndex]);
      }

      if (third) {
        orderedDarts.push([third, playerIndex]);
      }
    });
  }

  return orderedDarts;
};

export const calculateStatsForCricketOrTactical = (
  game: Game,
  players: Player[]
): { scores: number[]; marks: number[] } => {
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

  dartsInThrownOrder(highestRound, players).forEach(([[mark, multiple], playerIndex]) => {
    if (mark === Mark.Miss) {
      return;
    }

    // this will go over 3 because we are blindly summing so clamp it to 3
    const playerMarksSoFar = Math.min(playerToMarks[playerIndex][mark], 3);

    const otherPlayersHaveNotClosedMark = playerToMarks
      .filter((_, index) => index !== playerIndex)
      .some((p) => p[mark] < 3);

    if (game.pointing && otherPlayersHaveNotClosedMark) {
      if (playerMarksSoFar + multiple > 3) {
        playersToScore[playerIndex] += dartValue([mark, playerMarksSoFar + multiple - 3]);
      }
      playersToCountableMarksTotal[playerIndex] += multiple;
    } else {
      // account for partial marks when going over 3
      const diff = playerMarksSoFar + multiple <= 3 ? multiple : 3 - playerMarksSoFar;
      playersToCountableMarksTotal[playerIndex] += diff;
    }

    // finally add to player marks to keep track
    playerToMarks[playerIndex][mark] += multiple;
  });

  return { scores: playersToScore, marks: playersToCountableMarksTotal };
};
