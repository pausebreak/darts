import React, { useState } from "react";
import { useStore } from "../machine";
import { PlayerChooser } from "./PlayerChooser";
import { GameChooser } from "./GameChooser";
import { Game, Player } from "../types";
import "./GameSetup.css";

type ActiveSection = "players" | "settings" | "game" | "about" | null;

// Summary helper functions
const getPlayersSummary = (players: Player[]): string => {
  if (players.length === 0) return "No players";
  if (players.length === 1) return "1 player";
  return `${players.length} players`;
};

const getGameSummary = (game: Game | null, pointing: boolean): string => {
  if (!game) return "No game selected";
  return pointing ? `${game.name} (pointing)` : game.name;
};

// Settings component extracted from GameChooser
const SettingsSection: React.FC = () => {
  const setUseSound = useStore((state) => state.setUseSound);
  const setUseAutoForward = useStore((state) => state.setUseAutoForward);
  const useSound = useStore((state) => state.useSound);
  const useAutoForward = useStore((state) => state.useAutoForward);
  const voiceIndex = useStore((state) => state.voiceIndex);
  const setVoiceIndex = useStore((state) => state.setVoiceIndex);

  const isAndroid = window?.navigator?.userAgent?.indexOf("Android") !== -1;
  const voices = window.speechSynthesis?.getVoices();

  const voiceSortCompare = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) =>
    a.lang.localeCompare(b.lang);

  const onVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(event.target.value);
    const voice = voices[index];
    const utterance = new SpeechSynthesisUtterance(voice.name);
    utterance.voice = voice;

    setVoiceIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const toggleUseSound = () => setUseSound(!useSound);
  const toggleUseAutoForward = () => setUseAutoForward(!useAutoForward);

  return (
    <div className="options">
      <label>
        <input type="checkbox" checked={useSound} onChange={toggleUseSound} />
        Sounds ?
      </label>
      <label>
        <input type="checkbox" checked={useAutoForward} onChange={toggleUseAutoForward} />
        Auto forward to next player when idle ?
      </label>
      {useSound && !isAndroid && voices && voices.length !== 0 && (
        <div>
          <label>
            Voice{" "}
            <select
              className="voice"
              onChange={onVoiceChange}
              value={isBlank(voiceIndex) ? "" : voiceIndex}
            >
              {voices
                .slice()
                .sort(voiceSortCompare)
                .map((v) => {
                  const voiceIdx = voices.findIndex((vo) => vo.lang === v.lang && vo.name === v.name);
                  return (
                    <option key={v.name} value={voiceIdx}>
                      {v.lang} - {v.name}
                    </option>
                  );
                })}
            </select>
          </label>
        </div>
      )}
    </div>
  );
};

// QR component
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

// About section component
const AboutSection: React.FC = () => {
  return (
    <div className="about-section">
      <a
        href="https://github.com/pausebreak/darts"
        target="_blank"
        rel="noopener noreferrer"
        className="buy-me-coffee-link"
      >
        ☕ Buy me a coffee
      </a>
      <div className="share-section">
        <div className="share-header">Share app:</div>
        <Qr />
        <p>https://pausebreak.github.io/darts/</p>
      </div>
    </div>
  );
};

// Accordion section component
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
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const players = useStore((state) => state.players);
  const useSound = useStore((state) => state.useSound);
  const useAutoForward = useStore((state) => state.useAutoForward);
  const voiceIndex = useStore((state) => state.voiceIndex);

  const voices = window.speechSynthesis?.getVoices();
  const singlePlayer = players.length === 1;

  // Get summaries
  const playersSummary = getPlayersSummary(players);
  
  // Track selected game, pointing state, and start handler
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [pointing, setPointing] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [startHandler, setStartHandler] = useState<(() => void) | null>(null);
  
  const gameSummary = getGameSummary(selectedGame, pointing);

  const handleStartReady = (canStartGame: boolean, handler: () => void) => {
    setCanStart(canStartGame);
    setStartHandler(() => handler);
  };

  const handleStartClick = () => {
    if (startHandler) {
      startHandler();
    }
  };

  return (
    <>
      <h1>Darts</h1>
      <div className="game-setup">
        <AccordionSection
          id="players"
          title="Players"
          summary={playersSummary}
          isActive={activeSection === "players"}
          onToggle={setActiveSection}
        >
          <PlayerChooser />
        </AccordionSection>

        {players.length > 0 && (
          <AccordionSection
            id="game"
            title="Game"
            summary={gameSummary}
            isActive={activeSection === "game"}
            onToggle={setActiveSection}
          >
            <GameChooser
              singlePlayer={singlePlayer}
              initialGame={selectedGame}
              onGameChange={setSelectedGame}
              onPointingChange={setPointing}
              onStartReady={handleStartReady}
            />
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
      </div>
      {canStart && startHandler && (
        <button className="start-button" onClick={handleStartClick}>
          start
        </button>
      )}
    </>
  );
};

