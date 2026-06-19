import { dartValue, findLastPlayerToThrow } from "../games";
import { Game, GameName, GameOperations, Mark, Multiple, Player } from "../types";

export const shanghaiScore = (player: Player): number =>
  player.darts.reduce((acc, dart) => acc + dartValue(dart), 0);

export const shanghaiOperations = (game: Game): GameOperations => ({
  validThrow: (playerIndex: number, players: Player[], dart) => {
    const roundIndex = Math.floor(players[playerIndex].darts.length / 3);

    // player has thrown all of their rounds
    if (roundIndex >= game.marks.length) {
      return false;
    }

    return dart[0] === Mark.Miss || dart[0] === game.marks[roundIndex];
  },
  didWin: (players: Player[], currentPlayerIndex: number) => {
    // a single, a double and a triple of the round's number
    // in one round is an instant win
    const player = findLastPlayerToThrow(players, currentPlayerIndex);
    if (player && player.darts.length && player.darts.length % 3 === 0) {
      const roundMark = game.marks[player.darts.length / 3 - 1];
      const multiples = player.darts
        .slice(-3)
        .filter((dart) => dart[0] === roundMark)
        .map((dart) => dart[1]);

      if ([Multiple.Single, Multiple.Double, Multiple.Triple].every((multiple) => multiples.includes(multiple))) {
        return player;
      }
    }

    const totalDarts = game.marks.length * 3;
    if (players.length && players.every((player) => player.darts.length >= totalDarts)) {
      const scores = players.map(shanghaiScore);
      const max = Math.max(...scores);
      const winners = players.filter((_, index) => scores[index] === max);

      return winners.length === 1 ? winners[0] : winners;
    }
  },
  stats: (players: Player[]) => ({
    scores: players.map(shanghaiScore),
    marks: players.map((player) => player.darts.filter((dart) => dart[0] !== Mark.Miss).length),
  }),
});

export const shanghai = (shortGame = false): Game => {
  const marks = shortGame
    ? [Mark.Fifteen, Mark.Sixteen, Mark.Seventeen, Mark.Eighteen, Mark.Nineteen, Mark.Twenty]
    : [
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
      ];

  return {
    name: GameName.Shanghai,
    clear: false,
    limit: marks.length,
    marks,
    multiples: [Multiple.Single, Multiple.Double, Multiple.Triple],
    pointing: true,
  };
};
