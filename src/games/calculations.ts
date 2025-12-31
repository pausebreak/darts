import { Dart, Player } from "../types";

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
