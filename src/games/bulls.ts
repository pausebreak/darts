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
  validThrow: (playerIndex, players, _throw) => {
    const validMarks = game.marks.concat([Mark.Miss]);
    if (!validMarks.includes(_throw[0])) {
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
});
