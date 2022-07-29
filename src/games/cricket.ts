import { areMarksCleared, playerMarks } from "../games";
import { Game, Mark, GameOperations, GameName } from "../types";

export const cricketOperations = (game: Game): GameOperations => ({
  didWin: (players) => {
    // this needs to total all players scores and check if the last
    // player cleared the marks
    const player = players.slice().sort((a, b) => a.darts.length - b.darts.length)[0];

    if (areMarksCleared(game, player)) {
      return player;
    }
  },
  validThrow: (playerIndex, players, dart) => {
    const validMarks = game.marks.concat([Mark.Miss]);

    if (!validMarks.includes(dart[0])) {
      return false;
    }

    if (playerMarks(players[playerIndex])[dart[0]] < 3) {
      return true;
    }

    const otherPlayersHaveCleared = players.every((player) => playerMarks(player)[dart[0]] >= 3);

    if (otherPlayersHaveCleared) {
      return false;
    }

    return true;
  },
});

export const cricket = (pointing: boolean): Game => ({
  name: GameName.Cricket,
  checkIn: null,
  checkOut: null,
  limit: 0,
  clear: true,
  pointing,
  marks: [Mark.Fifteen, Mark.Sixteen, Mark.Seventeen, Mark.Eighteen, Mark.Nineteen, Mark.Twenty, Mark.Bull],
});
