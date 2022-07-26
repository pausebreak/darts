import React, { ChangeEvent, useState } from "react";
import "./GameChooser.css";
import { bulls } from "../games/bulls";
import { cricket } from "../games/cricket";
import { ohGames } from "../games/oh1";
import { useStore } from "../machine";
import { Game, Multiple, GameName } from "../types";
import isBlank from "@sedan-utils/is-blank";

export const GameChooser: React.FC<{ singlePlayer: boolean }> = ({ singlePlayer }) => {
  const chooseGame = useStore((state) => state.setGame);

  const [getGame, setGame] = useState<Game>(null);
  const [getLimit, setLimit] = useState(301);
  const [getPointing, setPointing] = useState(false);
  const [getNumberOfBulls, setNumberOfBulls] = useState(25);
  const [getIn, setIn] = useState(Multiple.Double);
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
            setGame(ohGames(Number(getLimit)));
          }}
        >
          Oh {getGame?.name === GameName.Oh1 && <span>!!</span>}
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

          {![GameName.Bulls, GameName.Oh1].includes(getGame.name) && (
            <div>
              <input type="checkbox" disabled={singlePlayer} checked={pointing} onChange={onPointingChange} />
              pointing?
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

          {![GameName.Bulls, GameName.Cricket].includes(getGame.name) && (
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

              if (getGame?.name === GameName.Oh1 && isBlank(limit)) {
                setError(true);
                return;
              }

              if (getGame?.name === GameName.Bulls) {
                limit = getGame.limit;
              }

              if (getGame?.name === GameName.Cricket) {
                limit = getGame.limit;
              }

              chooseGame({
                name: getGame.name,
                checkIn: getIn,
                checkOut: getOut,
                limit,
                marks: getGame.marks,
                clear: getGame.clear,
                pointing: getPointing,
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
