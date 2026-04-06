import * as React from "react";
import { useState } from "react";
import "./GameInfo.css";
import { useStore } from "../machine";
import { GameName, Multiple } from "../types";
import { PlayerChooser } from "./PlayerChooser";
import { SettingsSection } from "./SettingsSection";

export const GameInfo = () => {
  const game = useStore((state) => state.game);
  const winner = useStore((state) => state.winner);
  const setGame = useStore((state) => state.setGame);
  const setWinner = useStore((state) => state.setWinner);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  const stopGame = () => {
    if (window.confirm("Are you sure?")) {
      setGame(null);
      setWinner(null);
      setMenuOpen(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowPlayers(false);
    setMenuOpen(false);
  };

  const togglePlayers = () => {
    setShowPlayers(!showPlayers);
    setShowSettings(false);
    setMenuOpen(false);
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
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span />
              <span />
              <span />
            </button>
            {menuOpen && (
              <>
                <div className="menuBackdrop" onClick={() => setMenuOpen(false)} />
                <div className="menu">
                  <button onClick={togglePlayers}>Players</button>
                  <button onClick={toggleSettings}>Settings</button>
                  <button onClick={stopGame}>Stop Game</button>
                </div>
              </>
            )}
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
