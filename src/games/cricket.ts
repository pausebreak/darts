import { areMarksCleared, findLastPlayerToThrow, playerMarks } from "../games";
import { Game, Mark, GameOperations, GameName } from "../types";

export const cricketOperations = (game: Game): GameOperations => ({
  didWin: (players, currentPlayerIndex: number) => {
    const player = findLastPlayerToThrow(players, currentPlayerIndex);

    // this needs to total all players scores and check if the last
    // player cleared the marks

    if (!game.pointing && areMarksCleared(game, player)) {
      return player;
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

    const allPlayersHaveCleared = players.every((player) => playerMarks(player)[dart[0]] >= 3);

    if (allPlayersHaveCleared) {
      return false;
    }

    if (!game.pointing) {
      const currentPlayerMarks = playerMarks(currentPlayer);
      if (!Object.prototype.hasOwnProperty.call(currentPlayerMarks, dart[0])) {
        return true;
      }

      if (currentPlayerMarks[dart[0]] < 3) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  },
});

export const cricket = (pointing: boolean): Game => ({
  name: GameName.Cricket,
  checkIn: null,
  checkOut: null,
  limit: 0,
  clear: true,
  pointing,
  marks: [Mark.Twenty, Mark.Nineteen, Mark.Eighteen, Mark.Seventeen, Mark.Sixteen, Mark.Fifteen, Mark.Bull],
});
