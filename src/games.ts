import { bullsOperations } from "./games/bulls";
import { cricketOperations } from "./games/cricket";
import { ohGamesOperations } from "./games/oh1";
import { Game, Dart, GameOperations, GameName, Player, Mark } from "./types";

export const dartValue = (dart: Dart): number => dart[0] * dart[1];

export const playerMarks = (player: Player) =>
  player.darts.reduce((acc, dart) => {
    if (acc.hasOwnProperty(dart[0])) {
      acc[dart[0]] = acc[dart[0]] + dart[1];
    } else {
      acc[dart[0]] = dart[1];
    }

    return acc;
  }, {});

export const areMarksCleared = (game: Game, player: Player): boolean =>
  game.marks.every((mark) => 3 <= playerMarks(player)[mark]);

export const findLastPlayerToThrow = (players, currentPlayerIndex) => {
  let player = players[currentPlayerIndex];
  const dartsLength = player.darts.length;

  // player has not thrown yet this round
  // so the last player was the last to throw
  if (dartsLength % 3 === 0) {
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
    default:
      return {
        validThrow: () => false,
        didWin: () => null,
      };
  }
};

// account for closed Marks

export { bulls } from "./games/bulls";
export { cricket } from "./games/cricket";
export { ohGames } from "./games/oh1";
