import * as React from "react";
import { useState } from "react";
import "./GameInfo.css";
import { useStore } from "../machine";
import { GameName, Multiple } from "../types";
import { PlayerChooser } from "./PlayerChooser";
import { SettingsSection } from "./SettingsSection";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const GameInfo = () => {
  const game = useStore((state) => state.game);
  const winner = useStore((state) => state.winner);
  const setGame = useStore((state) => state.setGame);
  const setWinner = useStore((state) => state.setWinner);
  const [showSettings, setShowSettings] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  const stopGame = () => {
    if (window.confirm("Are you sure?")) {
      setGame(null);
      setWinner(null);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowPlayers(false);
  };

  const togglePlayers = () => {
    setShowPlayers(!showPlayers);
    setShowSettings(false);
  };

  const oh1Game = game?.name === GameName.Oh1;

  return (
    <>
      {game && !winner && (
        <>
          <div className="gameInfoWrapper">
            <div className="gameInfo">
              {!oh1Game && <span className="name">{game.name}</span>}
              {oh1Game && <span className="name">{game.limit}</span>}

              {game.checkIn && <span>{Multiple[game.checkIn]} In</span>}
              {game.checkOut && <span>{Multiple[game.checkOut]} Out</span>}
            </div>
            <div className="iconButtons">
              <button
                className="iconButton"
                onClick={togglePlayers}
                aria-label="Players"
                title="Players"
              >
                <svg {...iconProps}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </button>
              <button
                className="iconButton"
                onClick={toggleSettings}
                aria-label="Settings"
                title="Settings"
              >
                <svg {...iconProps}>
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                className="iconButton destructive"
                onClick={stopGame}
                aria-label="Stop game"
                title="Stop game"
              >
                <svg {...iconProps}>
                  <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </button>
            </div>
          </div>
          {showPlayers && (
            <div className="settingsOverlay">
              <PlayerChooser />
              <button onClick={togglePlayers}>Close</button>
            </div>
          )}
          {showSettings && (
            <div className="settingsOverlay">
              <SettingsSection />
              <button onClick={toggleSettings}>Close</button>
            </div>
          )}
        </>
      )}
    </>
  );
};
