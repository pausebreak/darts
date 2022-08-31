import { dartValue, findLastPlayerToThrow } from "../games";
import { Game, Mark, Multiple, Player, Dart, GameOperations, GameName } from "../types";

export const ohGamesOperations = (game: Game): GameOperations => ({
  didWin: (players: Player[], currentPlayerIndex: number) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);
    const score = player?.darts.map(dartValue).reduce((acc, value) => acc + value, 0);

    if (score === game.limit) {
      return player;
    }
  },
  validThrow: (playerIndex: number, players: Player[], dart: Dart): boolean => {
    if (dart[0] === Mark.Miss) {
      return true;
    }

    const { checkOut, checkIn, limit } = game;
    const player = players[playerIndex];
    const firstNonMiss = player.darts.find((_throw) => _throw[0] !== Mark.Miss);
    const total = player.darts.reduce((acc, _throw) => acc + dartValue(_throw), 0);
    const throwValue = dartValue(dart);

    if ((player.darts.length === 0 || !firstNonMiss) && checkIn !== Multiple.Single && dart[1] !== checkIn) {
      return false;
    }

    if (total + throwValue > limit) {
      return false;
    }

    if (checkOut !== Multiple.Single) {
      const leftOver = limit - total - throwValue;

      if (leftOver === 0 && dart[1] === checkOut) {
        return true;
      }

      return leftOver >= checkOut;
    }

    return true;
  },
});

export const ohGames = (limit?: number): Game => ({
  name: GameName.Oh1,
  checkIn: Multiple.Double,
  checkOut: Multiple.Double,
  limit,
  clear: false,
  marks: [
    Mark.One,
    Mark.Two,
    Mark.Three,
    Mark.Four,
    Mark.Five,
    Mark.Six,
    Mark.Seven,
    Mark.Eight,
    Mark.Nine,
    Mark.Ten,
    Mark.Eleven,
    Mark.Twelve,
    Mark.Thirteen,
    Mark.Fourteen,
    Mark.Fifteen,
    Mark.Sixteen,
    Mark.Seventeen,
    Mark.Eighteen,
    Mark.Nineteen,
    Mark.Twenty,
    Mark.Bull,
  ],
  pointing: false,
});
