import { bullsOperations } from "./games/bulls";
import { cricketOperations } from "./games/cricket";
import { cutThroatOperations } from "./games/cutThroat";
import { ohGamesOperations } from "./games/oh1";
import { tacticalOperations } from "./games/tactical";
import { Game, Dart, GameOperations, GameName, Player, Mark } from "./types";

export const dartValue = (dart: Dart): number => dart[0] * dart[1];

export const currentRound = (players: Player[]) => {
  const highestDart = players.reduce((acc, player) => {
    if (acc > player.darts.length) {
      return acc;
    }

    return player.darts.length;
  }, 0);

  return Math.ceil(highestDart / 3);
};

export const playerMarks = (player: Player): { [key: number]: number } =>
  player.darts.reduce((acc, dart) => {
    if (Object.prototype.hasOwnProperty.call(acc, dart[0])) {
      acc[dart[0]] = acc[dart[0]] + dart[1];
    } else {
      acc[dart[0]] = dart[1];
    }

    return acc;
  }, {});

export const isMarkCleared = (player: Player, mark: Mark): boolean => 3 <= playerMarks(player)[mark];

export const areMarksCleared = (game: Game, player: Player): boolean =>
  game.marks.every((mark) => isMarkCleared(player, mark));

export const isMarkClearedForEveryone = (players: Player[], mark: Mark) =>
  players.reduce((acc, player) => {
    if (!isMarkCleared(player, mark)) {
      return false;
    }

    return acc;
  }, true);

export const findLastPlayerToThrow = (players: Player[], currentPlayerIndex: number): Player => {
  let player = players[currentPlayerIndex];
  const dartsLength = player?.darts.length;

  const anyoneThrownYet = players.reduce((acc, player) => (player.darts.length ? true : acc), false);

  // player has not thrown yet this round
  // so the last player was the last to throw
  if (anyoneThrownYet && dartsLength % 3 === 0) {
    if (currentPlayerIndex === 0) {
      player = players[players.length - 1];
    } else {
      player = players[currentPlayerIndex - 1];
    }
  }

  return player;
};

export const gameOperations = (game: Game): GameOperations => {
  switch (game?.name) {
    case GameName.Oh1:
      return ohGamesOperations(game);
    case GameName.Bulls:
      return bullsOperations(game);
    case GameName.Cricket:
      return cricketOperations(game);
    case GameName.CutThroat:
      return cutThroatOperations(game);
    case GameName.Tactical:
      return tacticalOperations(game);
    default:
      return {
        validThrow: () => false,
        didWin: () => null,
      };
  }
};

export const mprForPlayerAsOfRound = (player: Player, round: number) => {
  const numDarts = round * 3;
  const darts = player.darts.slice(0, numDarts);
  const playerAsOfRound = {name: player.name, darts}
  const marks = playerMarks(playerAsOfRound);
  const totalMarks = Object.keys(marks).filter(key => key !== "0").reduce((prev, curr, i) => prev + marks[curr], 0)
  return((Number(totalMarks)/round).toFixed(2));
}

export { bulls } from "./games/bulls";
export { cricket } from "./games/cricket";
export { ohGames } from "./games/oh1";
export { cutThroat } from "./games/cutThroat";
export { tactical } from "./games/tactical";
