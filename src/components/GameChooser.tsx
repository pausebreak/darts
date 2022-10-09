import React, { ChangeEvent, useState } from "react";
import "./GameChooser.css";
import { bulls } from "../games/bulls";
import { cricket } from "../games/cricket";
import { ohGames } from "../games/oh1";
import { useStore } from "../machine";
import { Game, Multiple, GameName } from "../types";
import isBlank from "@sedan-utils/is-blank";
import { cutThroat } from "../games";

export const GameChooser: React.FC<{ singlePlayer: boolean }> = ({ singlePlayer }) => {
  const chooseGame = useStore((state) => state.setGame);
  const setUseSound = useStore((state) => state.setUseSound);
  const useSound = useStore((state) => state.useSound);

  const [getGame, setGame] = useState<Game>(null);
  const [getLimit, setLimit] = useState(301);
  const [getPointing, setPointing] = useState(false);
  const [getNumberOfBulls, setNumberOfBulls] = useState(25);
  const [getIn, setIn] = useState(Multiple.Single);
  const [getOut, setOut] = useState(Multiple.Single);
  const [hasError, setError] = useState(false);

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

  const toggleUseSound = () => setUseSound(!useSound);

  return (
    <>
      <div className="options">
        <label>
          <input type="checkbox" checked={useSound} onChange={toggleUseSound} />
          Speech and Sounds ?
        </label>
      </div>
      <div className="games">
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(bulls());
          }}
          className={getGame?.name && getGame?.name !== GameName.Bulls && 'unselected-button' }
        >
          Bulls
        </button>

        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(cricket(getPointing));
          }}
          className={getGame?.name && getGame?.name !== GameName.Cricket && 'unselected-button' }
        >
          Cricket
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(ohGames(Number(getLimit)));
          }}
          className={getGame?.name && getGame?.name !== GameName.Oh1 && 'unselected-button' }
        >
          Oh
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setGame(cutThroat());
          }}
          className={getGame?.name && getGame?.name !== GameName.CutThroat && 'unselected-button' }
        >
          Cut Throat
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

          {![GameName.Bulls, GameName.Cricket, GameName.CutThroat].includes(getGame.name) && (
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

          <button
            style={{ flex: 1, fontSize: "2em", padding: "0 1em", marginTop: "0.77em" }}
            onClick={(event) => {
              event.preventDefault();

              let limit = getLimit;
              let checkIn = getIn;
              let checkOut = getOut;

              if (getGame?.name === GameName.Oh1 && isBlank(limit)) {
                setError(true);
                return;
              }

              if (getGame?.name === GameName.Bulls) {
                limit = getNumberOfBulls * 25;
                checkIn = Multiple.Single;
                checkOut = Multiple.Single;
              }

              if (getGame?.name === GameName.Cricket) {
                limit = getGame.limit;
                checkIn = null;
                checkOut = null;
              }

              let arePointing = getPointing;

              if (getGame?.name === GameName.CutThroat) {
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
            }}
          >
            start
          </button>
        </div>
      )}
    </>
  );
};
