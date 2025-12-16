import * as React from "react";
import "./App.css";
import { GameChooser } from "./GameChooser";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { GameName } from "../types";
import { Players } from "./Players";
import { TouchInput } from "./TouchInput";
import { GameInfo } from "./GameInfo";
import { PostGame } from "./PostGame";
import { TouchScoreBoard } from "./games/TouchScoreBoard";

const GameLayout = () => {
  const currentGame = useStore((state) => state.game);

  switch (currentGame?.name) {
    case GameName.Cricket:
    case GameName.CutThroat:
      return <TouchScoreBoard />;
    case GameName.Bulls:
    case GameName.Oh1:
      return (
        <>
          <Players />
          <TouchInput />
        </>
      );
    case GameName.Tactical:
      return <TouchScoreBoard />;
  }
};

const Qr = () => {
  const [showQr, setShowQr] = React.useState(false);
  return (
    <div className="qr">
      {!showQr && (
        <button
          onClick={(event) => {
            event.preventDefault();
            setShowQr(true);
          }}
        >
          Show Qr
        </button>
      )}
      {showQr && (
        <>
          <div
            onClick={(event) => {
              event.preventDefault();
              setShowQr(false);
            }}
            aria-label="QR URL CODE"
          >
            <svg viewBox="0 0 33 33" width="50%" xmlns="http://www.w3.org/2000/svg">
              <path
                className="qr"
                d="M2 2h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 3h1v1H2Zm6 0h1v1H8Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm6 0h1v1h-1ZM2 4h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm3 0h1v1h-1Zm5 0h1v1h-1Zm3 0h1v1h-1Zm3 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 5h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 6h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm10 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 7h1v1H2Zm6 0h1v1H8Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1Zm3 0h1v1h-1Zm3 0h1v1h-1Zm6 0h1v1h-1ZM2 8h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM10 9h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1ZM2 10h1v1H2Zm4 0h1v1H6Zm2 0h1v1H8Zm1 0h1v1H9Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1ZM3 11h1v1H3Zm1 0h1v1H4Zm2 0h1v1H6Zm3 0h1v1H9Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 12h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm4 0h1v1H8Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm5 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1ZM2 13h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm2 0h1v1H6Zm1 0h1v1H7Zm2 0h1v1H9Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1ZM2 14h1v1H2Zm2 0h1v1H4Zm2 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1ZM2 15h1v1H2Zm8 0h1v1h-1Zm2 0h1v1h-1Zm5 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 16h1v1H2Zm1 0h1v1H3Zm3 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM9 17h1v1H9Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm6 0h1v1h-1Zm1 0h1v1h-1ZM2 18h1v1H2Zm1 0h1v1H3Zm4 0h1v1H7Zm1 0h1v1H8Zm4 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1ZM2 19h1v1H2Zm3 0h1v1H5Zm5 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1ZM6 20h1v1H6Zm2 0h1v1H8Zm1 0h1v1H9Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm2 0h1v1h-1ZM4 21h1v1H4Zm1 0h1v1H5Zm2 0h1v1H7Zm2 0h1v1H9Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1ZM2 22h1v1H2Zm1 0h1v1H3Zm3 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm-20 1h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm4 0h1v1h-1ZM2 24h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 25h1v1H2Zm6 0h1v1H8Zm4 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1ZM2 26h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 27h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm3 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm7 0h1v1h-1ZM2 28h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm4 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 29h1v1H2Zm6 0h1v1H8Zm4 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1ZM2 30h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm7 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm3 0h1v1h-1Z"
              />
            </svg>
          </div>
          <p>https://pausebreak.github.io/darts/</p>
        </>
      )}
    </div>
  );
};

const GamePrep = () => {
  const players = useStore((state) => state.players);

  return (
    <>
      <h1>Darts</h1>
      <PlayerChooser />
      {players.length > 0 && <GameChooser singlePlayer={players.length === 1} />}
      <Qr />
    </>
  );
};

export const App = () => {
  const winner = useStore((state) => state.winner);
  const game = useStore((state) => state.game);

  return (
    <>
      <GameInfo />
      <div className="App">
        {winner && <PostGame />}
        {!winner && game && <GameLayout />}
        {!winner && !game && <GamePrep />}
      </div>
    </>
  );
};
