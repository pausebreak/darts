import React from "react";
import { Multiple, GameName } from "../types";

import "./GameChooser.css";

export interface GameChooserState {
  selected: GameName | null;
  limit: number;
  pointing: boolean;
  numberOfBulls: number;
  checkIn: Multiple;
  checkOut: Multiple;
  shanghaiShort: boolean;
}

export const initialChooserState: GameChooserState = {
  selected: null,
  limit: 301,
  pointing: false,
  numberOfBulls: 25,
  checkIn: Multiple.Single,
  checkOut: Multiple.Single,
  shanghaiShort: true,
};

export interface GameChooserProps {
  singlePlayer: boolean;
  state: GameChooserState;
  onChange: (state: GameChooserState) => void;
}

const showLimit = (name: GameName) => name === GameName.Oh1;
const showPointing = (name: GameName) => name === GameName.Cricket || name === GameName.Tactical;
const showBulls = (name: GameName) => name === GameName.Bulls;
const showInOut = (name: GameName) => name === GameName.Oh1;
const showShanghaiVariant = (name: GameName) => name === GameName.Shanghai;

export const GameChooser: React.FC<GameChooserProps> = ({ singlePlayer, state, onChange }) => {
  const { selected, limit, pointing, numberOfBulls, checkIn, checkOut, shanghaiShort } = state;
  const update = (patch: Partial<GameChooserState>) => onChange({ ...state, ...patch });

  const effectivePointing = singlePlayer ? false : pointing;
  const limitInvalid = selected === GameName.Oh1 && (Number.isNaN(limit) || limit < 10);
  const bullsInvalid = selected === GameName.Bulls && (numberOfBulls < 3 || numberOfBulls > 100);

  const pick = (name: GameName) => update({ selected: name });

  return (
    <>
      <div className="games">
        <button
          onClick={(event) => {
            event.preventDefault();
            pick(GameName.Bulls);
          }}
        >
          Bulls {selected === GameName.Bulls && <span>!!</span>}
        </button>

        <button
          onClick={(event) => {
            event.preventDefault();
            pick(GameName.Cricket);
          }}
        >
          Cricket {selected === GameName.Cricket && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            pick(GameName.Tactical);
          }}
        >
          Tactical {selected === GameName.Tactical && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            pick(GameName.Oh1);
          }}
        >
          Oh 1 {selected === GameName.Oh1 && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            pick(GameName.CutThroat);
          }}
        >
          Cut Throat {selected === GameName.CutThroat && <span>!!</span>}
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            pick(GameName.Shanghai);
          }}
        >
          Shanghai {selected === GameName.Shanghai && <span>!!</span>}
        </button>
      </div>
      {selected === GameName.Cricket && (
        <a target={"_blank"} href="https://en.wikipedia.org/wiki/Cricket_(darts)">
          The game of Cricket
        </a>
      )}
      {selected === GameName.Oh1 && (
        <a target={"_blank"} href="https://en.wikipedia.org/wiki/Darts#Games">
          The game of Darts
        </a>
      )}
      {selected && (
        <div className="options">
          {showLimit(selected) && (
            <div>
              <input
                maxLength={4}
                type="number"
                max={9999}
                min={3}
                value={limit}
                onChange={(e) => update({ limit: Number(e.target.value) })}
              />
              limit
              {limitInvalid && <span>invalid value</span>}
            </div>
          )}

          {showPointing(selected) && (
            <div>
              <label>
                <input
                  type="checkbox"
                  disabled={singlePlayer}
                  checked={effectivePointing}
                  onChange={(e) => update({ pointing: e.target.checked })}
                />
                pointing ?
              </label>
            </div>
          )}

          {showBulls(selected) && (
            <div>
              <input
                maxLength={3}
                type="number"
                max={100}
                min={3}
                value={numberOfBulls}
                onChange={(e) => update({ numberOfBulls: Number(e.target.value) })}
              />
              Number of Bulls
              {bullsInvalid && <span>invalid value</span>}
            </div>
          )}

          {showShanghaiVariant(selected) && (
            <div>
              <select
                onChange={(e) => update({ shanghaiShort: e.target.value === "short" })}
                value={shanghaiShort ? "short" : "full"}
              >
                <option value="short">15 - 20 (6 rounds)</option>
                <option value="full">1 - 20 (20 rounds)</option>
              </select>{" "}
              Rounds
            </div>
          )}

          {showInOut(selected) && (
            <>
              <div>
                <select onChange={(e) => update({ checkIn: Number(e.target.value) as Multiple })} value={checkIn}>
                  <option value={Multiple.Single}>Single</option>
                  <option value={Multiple.Double}>Double</option>
                  <option value={Multiple.Triple}>Triple</option>
                </select>{" "}
                in
              </div>
              <div>
                <select onChange={(e) => update({ checkOut: Number(e.target.value) as Multiple })} value={checkOut}>
                  <option value={Multiple.Single}>Single</option>
                  <option value={Multiple.Double}>Double</option>
                  <option value={Multiple.Triple}>Triple</option>
                </select>{" "}
                out
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
