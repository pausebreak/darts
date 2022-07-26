export enum Mark {
  Miss = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Eleven = 11,
  Twelve = 12,
  Thirteen = 13,
  Fourteen = 14,
  Fifteen = 15,
  Sixteen = 16,
  Seventeen = 17,
  Eighteen = 18,
  Nineteen = 19,
  Twenty = 20,
  Bull = 25,
  Double,
  Triple,
}

export enum Multiple {
  Single = 1,
  Double = 2,
  Triple = 3,
}

export type Dart = [dart: Mark, multiple: Multiple];

export type Player = {
  name: string;
  darts: Dart[];
};

export enum GameName {
  Bulls = "Bulls",
  Oh1 = "Oh1",
  Cricket = "Cricket",
}

export type Game = {
  name: GameName;
  checkIn?: Multiple;
  checkOut?: Multiple;
  limit: number;
  marks: Mark[];
  clear: boolean;
  pointing: boolean;
};

export type GameOperations = {
  validThrow(playerIndex: number, players: Player[], dart: Dart): boolean;
  didWin(players: Player[], currentPlayerIndex: number): Player;
};
