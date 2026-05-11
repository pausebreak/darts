import React, { useState } from "react";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { GameChooser, GameChooserState, initialChooserState } from "./GameChooser";
import { SettingsSection } from "./SettingsSection";
import { bulls } from "../games/bulls";
import { cricket } from "../games/cricket";
import { tactical } from "../games/tactical";
import { ohGames } from "../games/oh1";
import { cutThroat } from "../games";
import { Game, GameName, Player } from "../types";
import "./GameSetup.css";

type ActiveSection = "players" | "settings" | "game" | "about" | null;

const getPlayersSummary = (players: Player[]): string => {
  if (players.length === 0) return "No players";
  if (players.length === 1) return "1 player";
  return `${players.length} players`;
};

const getGameSummary = (state: GameChooserState, singlePlayer: boolean): string => {
  if (!state.selected) return "No game selected";
  const pointing = !singlePlayer && state.pointing;
  const canPoint = state.selected === GameName.Cricket || state.selected === GameName.Tactical;
  return canPoint && pointing ? `${state.selected} (pointing)` : state.selected;
};

const buildGame = (state: GameChooserState, singlePlayer: boolean): Game | null => {
  if (!state.selected) return null;
  const pointing = singlePlayer ? false : state.pointing;

  switch (state.selected) {
    case GameName.Bulls:
      return { ...bulls(), limit: state.numberOfBulls * 25 };
    case GameName.Cricket:
      return cricket(pointing);
    case GameName.Tactical:
      return tactical(pointing);
    case GameName.CutThroat:
      return cutThroat();
    case GameName.Oh1:
      return { ...ohGames(state.limit), checkIn: state.checkIn, checkOut: state.checkOut };
  }
};

const canStartGame = (state: GameChooserState): boolean => {
  if (!state.selected) return false;
  if (state.selected === GameName.Oh1 && (Number.isNaN(state.limit) || state.limit < 10)) return false;
  if (state.selected === GameName.Bulls && (state.numberOfBulls < 3 || state.numberOfBulls > 100)) return false;
  return true;
};

const Qr = () => {
  return (
    <div className="qr">
      <div aria-label="QR URL CODE">
        <svg viewBox="0 0 33 33" width="50%" xmlns="http://www.w3.org/2000/svg">
          <path
            className="qr"
            d="M2 2h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 3h1v1H2Zm6 0h1v1H8Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm6 0h1v1h-1ZM2 4h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm3 0h1v1h-1Zm5 0h1v1h-1Zm3 0h1v1h-1Zm3 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 5h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 6h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm10 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 7h1v1H2Zm6 0h1v1H8Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1Zm3 0h1v1h-1Zm3 0h1v1h-1Zm6 0h1v1h-1ZM2 8h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM10 9h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1ZM2 10h1v1H2Zm4 0h1v1H6Zm2 0h1v1H8Zm1 0h1v1H9Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1ZM3 11h1v1H3Zm1 0h1v1H4Zm2 0h1v1H6Zm3 0h1v1H9Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 12h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm4 0h1v1H8Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm5 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1ZM2 13h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm2 0h1v1H6Zm1 0h1v1H7Zm2 0h1v1H9Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1ZM2 14h1v1H2Zm2 0h1v1H4Zm2 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1ZM2 15h1v1H2Zm8 0h1v1h-1Zm2 0h1v1h-1Zm5 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 16h1v1H2Zm1 0h1v1H3Zm3 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM9 17h1v1H9Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm6 0h1v1h-1Zm1 0h1v1h-1ZM2 18h1v1H2Zm1 0h1v1H3Zm4 0h1v1H7Zm1 0h1v1H8Zm4 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1ZM2 19h1v1H2Zm3 0h1v1H5Zm5 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1ZM6 20h1v1H6Zm2 0h1v1H8Zm1 0h1v1H9Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm2 0h1v1h-1ZM4 21h1v1H4Zm1 0h1v1H5Zm2 0h1v1H7Zm2 0h1v1H9Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1ZM2 22h1v1H2Zm1 0h1v1H3Zm3 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm-20 1h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm4 0h1v1h-1ZM2 24h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1ZM2 25h1v1H2Zm6 0h1v1H8Zm4 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1ZM2 26h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm2 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 27h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm3 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm7 0h1v1h-1ZM2 28h1v1H2Zm2 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm2 0h1v1H8Zm4 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm3 0h1v1h-1Zm4 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1ZM2 29h1v1H2Zm6 0h1v1H8Zm4 0h1v1h-1Zm1 0h1v1h-1Zm4 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1Zm2 0h1v1h-1Zm2 0h1v1h-1Zm1 0h1v1h-1ZM2 30h1v1H2Zm1 0h1v1H3Zm1 0h1v1H4Zm1 0h1v1H5Zm1 0h1v1H6Zm1 0h1v1H7Zm1 0h1v1H8Zm2 0h1v1h-1Zm1 0h1v1h-1Zm1 0h1v1h-1Zm7 0h1v1h-1Zm3 0h1v1h-1Zm1 0h1v1h-1Zm3 0h1v1h-1Zm3 0h1v1h-1Z"
          />
        </svg>
      </div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  return (
    <div className="about-section">
      <a
        href="https://buymeacoffee.com/pausebreak"
        target="_blank"
        rel="noopener noreferrer"
        className="buy-me-coffee-link"
      >
        ☕ Buy me a coffee
      </a>
      <div className="share-section">
        <div className="share-header">Share This:</div>
        <Qr />
        <p>https://pausebreak.github.io/darts/</p>
      </div>
    </div>
  );
};

const AccordionSection: React.FC<{
  id: ActiveSection;
  title: string;
  summary: string;
  isActive: boolean;
  onToggle: (id: ActiveSection) => void;
  children: React.ReactNode;
}> = ({ id, title, summary, isActive, onToggle, children }) => {
  const handleClick = () => {
    onToggle(isActive ? null : id);
  };

  return (
    <div className="accordion-section">
      <button className="accordion-header" onClick={handleClick} type="button">
        <span className="accordion-title">{title}</span>
        <span className="accordion-summary">{summary}</span>
        <span className={`accordion-chevron ${isActive ? "expanded" : ""}`}>›</span>
      </button>
      {isActive && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export const GameSetup: React.FC = () => {
  const players = useStore((state) => state.players);
  const setGame = useStore((state) => state.setGame);

  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [chooserState, setChooserState] = useState<GameChooserState>(initialChooserState);

  const singlePlayer = players.length === 1;
  const canStart = canStartGame(chooserState);

  const handleStart = () => {
    const game = buildGame(chooserState, singlePlayer);
    if (game) setGame(game);
  };

  return (
    <>
      <h1>Darts</h1>
      <div className="game-setup">
        <AccordionSection
          id="players"
          title="Players"
          summary={getPlayersSummary(players)}
          isActive={activeSection === "players"}
          onToggle={setActiveSection}
        >
          <PlayerChooser />
        </AccordionSection>

        {players.length > 0 && (
          <AccordionSection
            id="game"
            title="Game"
            summary={getGameSummary(chooserState, singlePlayer)}
            isActive={activeSection === "game"}
            onToggle={setActiveSection}
          >
            <GameChooser singlePlayer={singlePlayer} state={chooserState} onChange={setChooserState} />
          </AccordionSection>
        )}

        <AccordionSection
          id="settings"
          title="Settings"
          summary=""
          isActive={activeSection === "settings"}
          onToggle={setActiveSection}
        >
          <SettingsSection />
        </AccordionSection>

        <AccordionSection
          id="about"
          title="About"
          summary=""
          isActive={activeSection === "about"}
          onToggle={setActiveSection}
        >
          <AboutSection />
        </AccordionSection>
        {canStart && (
          <button className="start-button" onClick={handleStart}>
            start
          </button>
        )}
      </div>
    </>
  );
};
