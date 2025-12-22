import { Dart, Player } from "../types";

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
