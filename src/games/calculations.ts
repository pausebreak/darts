import { currentRound, dartValue } from "../games";
import { Dart, Game, Mark, Player } from "../types";

export const actualMarksNotPointing = (multiple: number, playerMarksSoFar: number): number => {
  // sanity
  if (playerMarksSoFar >= 3 || playerMarksSoFar < 0 || multiple > 3 || multiple < 0) {
    return 0;
  }

  if (playerMarksSoFar + multiple <= 3) {
    return multiple;
  }

  return 3 - playerMarksSoFar;
};

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

    if (game.pointing && otherPlayersHaveNotClosedMark) {
      if (playerMarksSoFar + multiple > 3) {
        playersToScore[playerIndex] += dartValue([mark, playerMarksSoFar + multiple - 3]);
      }
      playersToCountableMarksTotal[playerIndex] += multiple;
    } else {
      playersToCountableMarksTotal[playerIndex] += actualMarksNotPointing(multiple, playerMarksSoFar);
    }

    // finally add to player marks to keep track
    playerToMarks[playerIndex][mark] += multiple;
  });

  return { scores: playersToScore, marks: playersToCountableMarksTotal };
};
