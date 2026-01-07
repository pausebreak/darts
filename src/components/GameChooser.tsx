import React, { ChangeEvent, useState, useEffect, useCallback } from "react";
import { bulls } from "../games/bulls";
import { cricket } from "../games/cricket";
import { ohGames } from "../games/oh1";
import { useStore } from "../machine";
import { Game, Multiple, GameName } from "../types";
import isBlank from "@sedan-utils/is-blank";
import { cutThroat } from "../games";

import "./GameChooser.css";
import { tactical } from "../games/tactical";

export interface GameChooserProps {
  singlePlayer: boolean;
  initialGame?: Game | null;
  onGameChange?: (game: Game | null) => void;
  onStartReady?: (canStart: boolean, startHandler: () => void) => void;
}

export const GameChooser: React.FC<GameChooserProps> = ({ singlePlayer, initialGame, onGameChange, onStartReady }) => {
  const chooseGame = useStore((state) => state.setGame);

  const [getGame, setGame] = useState<Game>(initialGame || null);
  const [getLimit, setLimit] = useState(301);
  const [getPointing, setPointing] = useState(false);
  const [getNumberOfBulls, setNumberOfBulls] = useState(25);
  const [getIn, setIn] = useState(Multiple.Single);
  const [getOut, setOut] = useState(Multiple.Single);
  const [hasError, setError] = useState(false);

  // Sync with initialGame prop when it changes (e.g., when accordion reopens)
  // This handles the case where the component remounts with a different initialGame
  useEffect(() => {
    if (initialGame !== undefined) {
      const currentGameName = getGame?.name;
      const initialGameName = initialGame?.name;
      
      // Only update if the game actually differs
      if (currentGameName !== initialGameName) {
        setGame(initialGame);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGame]);

  // this does not work until the user clicks a button
  const voices = window.speechSynthesis?.getVoices();

  const onLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    if (isBlank(getLimit) || value < 10) {
      setError(true);
    } else {
      setError(false);
    }

    setLimit(value);
  };

  const onNumberOfBulls = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    if (isBlank(getLimit) || value < 3 || value > 100) {
      setError(true);
    } else {
      setError(false);
    }

    setNumberOfBulls(value);
    setLimit(value * 25);
  };

  const onInChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setIn(value as unknown as Multiple);
  };

  const onOutChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setOut(value as unknown as Multiple);
  };

  const onPointingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPointing(event.target.checked);
  };

  const pointing = singlePlayer ? false : getPointing;

  // Notify parent when game changes
  useEffect(() => {
    if (onGameChange) {
      onGameChange(getGame);
    }
  }, [getGame, onGameChange]);

  // Create start handler with useCallback
  const handleStart = useCallback(() => {
    if (!getGame) return;

    let limit = getLimit;
    let checkIn = getIn;
    let checkOut = getOut;

    if (getGame?.name === GameName.Oh1 && isBlank(limit)) {
      setError(true);
      return;
    }

    if (getGame?.name === GameName.Bulls) {
      limit = getNumberOfBulls * 25;
      checkIn = null;
      checkOut = null;
    }

    if (getGame?.name === GameName.Cricket) {
      limit = getGame.limit;
      checkIn = null;
      checkOut = null;
    }

    let arePointing = getPointing;

    if ([GameName.CutThroat, GameName.Tactical].includes(getGame?.name)) {
      limit = 0;
      checkIn = null;
      checkOut = null;

      arePointing = true;
    }

    chooseGame({
      name: getGame.name,
      checkIn,
      checkOut,
      limit,
      marks: getGame.marks,
      multiples: getGame.multiples,
      clear: getGame.clear,
      pointing: arePointing,
    });
  }, [getGame, getLimit, getIn, getOut, getPointing, getNumberOfBulls, chooseGame]);

  // Notify parent about start readiness
  useEffect(() => {
    if (onStartReady) {
      onStartReady(!!getGame, handleStart);
    }
  }, [getGame, onStartReady, handleStart]);

  return (
    <>
      <div className="games">
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(bulls());
          }}
        >
          Bulls {getGame?.name === GameName.Bulls && <span>!!</span>}
        </button>

        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(cricket(getPointing));
          }}
        >
          Cricket {getGame?.name === GameName.Cricket && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(tactical(getPointing));
          }}
        >
          Tactical {getGame?.name === GameName.Tactical && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(ohGames(Number(getLimit)));
          }}
        >
          Oh 1 {getGame?.name === GameName.Oh1 && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(cutThroat());
          }}
        >
          Cut Throat {getGame?.name === GameName.CutThroat && <span>!!</span>}
        </button>
      </div>
      {getGame && getGame.name === GameName.Cricket && (
        <a target={"_blank"} href="https://en.wikipedia.org/wiki/Cricket_(darts)">
          The game of Cricket
        </a>
      )}
      {getGame && getGame.name === GameName.Oh1 && (
        <a target={"_blank"} href="https://en.wikipedia.org/wiki/Darts#Games">
          The game of Darts
        </a>
      )}
      {getGame && (
        <div className="options">
          {getGame?.limit !== 0 && getGame.name !== GameName.Bulls && (
            <div>
              <input maxLength={4} type="number" max={9999} min={3} value={getLimit} onChange={onLimitChange} />
              limit
              {hasError && <span>invalid value</span>}
            </div>
          )}

          {![GameName.Bulls, GameName.Oh1, GameName.CutThroat].includes(getGame.name) && (
            <div>
              <label>
                <input type="checkbox" disabled={singlePlayer} checked={pointing} onChange={onPointingChange} />
                pointing ?
              </label>
              {hasError && <span>invalid value</span>}
            </div>
          )}

          {getGame.name === GameName.Bulls && (
            <div>
              <input
                maxLength={3}
                type="number"
                max={100}
                min={3}
                value={getNumberOfBulls}
                onChange={onNumberOfBulls}
              />
              Number of Bulls
              {hasError && <span>invalid value</span>}
            </div>
          )}

          {![GameName.Bulls, GameName.Cricket, GameName.Tactical, GameName.CutThroat].includes(getGame.name) && (
            <>
              <div>
                <select onChange={onInChange} value={getIn}>
                  <option value={Multiple.Single}>Single</option>
                  <option value={Multiple.Double}>Double</option>
                  <option value={Multiple.Triple}>Triple</option>
                </select>{" "}
                in
                {hasError && <span>invalid value</span>}
              </div>
              <div>
                <select onChange={onOutChange} value={getOut}>
                  <option value={Multiple.Single}>Single</option>
                  <option value={Multiple.Double}>Double</option>
                  <option value={Multiple.Triple}>Triple</option>
                </select>{" "}
                out
                {hasError && <span>invalid value</span>}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
