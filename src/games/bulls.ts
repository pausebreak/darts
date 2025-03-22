import { dartValue, findLastPlayerToThrow } from "../games";
import { Game, Mark, Multiple, Player, GameOperations, GameName } from "../types";

export const bullsOperations = (game: Game): GameOperations => ({
  didWin: (players: Player[], currentPlayerIndex) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);
    const score = player?.darts.map(dartValue).reduce((acc, value) => acc + value, 0);

    if (score >= game.limit) {
      return player;
    }
  },
  validThrow: (playerIndex, players, dart) => {
    const validMarks = game.marks.concat([Mark.Miss]);
    if (!validMarks.includes(dart[0])) {
      return false;
    }

    if (dart[0] === Mark.Bull && dart[1] === Multiple.Triple) {
      return false;
    }

    return true;
  },
});

export const bulls = (): Game => ({
  name: GameName.Bulls,
  checkIn: Multiple.Single,
  checkOut: Multiple.Single,
  clear: false,
  limit: Mark.Bull * 21,
  marks: [Mark.Bull],
  pointing: false,
  multiples: [Multiple.Single, Multiple.Double],
});
