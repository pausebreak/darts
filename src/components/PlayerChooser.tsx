import isBlank from "@sedan-utils/is-blank";
import React, { ChangeEvent, useState } from "react";
import { useStore } from "../machine";

import "./PlayerChooser.css";

export const PlayerChooser: React.FC = () => {
  const players = useStore((state) => state.players);
  const addPlayer = useStore((state) => state.addPlayer);
  const removePlayer = useStore((state) => state.removePlayer);
  const movePlayerLeft = useStore((state) => state.movePlayerLeft);
  const movePlayerRight = useStore((state) => state.movePlayerRight);

  const [getPlayer, setPlayer] = useState("");
  const [getActivePlayerName, setActivePlayerName] = useState(null);
  const [hasError, setError] = useState(false);

  const setNewPlayer = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    if (!players.find((player) => player.name === name)) {
      setError(false);
    } else {
      setError(true);
    }
    setPlayer(name);
  };

  const addNewPlayer = () => {
    if (!hasError && !isBlank(getPlayer)) {
      addPlayer({ name: getPlayer, darts: [] });
      setPlayer("");
    }
  };

  return (
    <>
      <div className="addPlayer">
        <input
          type="text"
          size={15}
          maxLength={15}
          onFocus={() => setActivePlayerName(null)}
          onChange={setNewPlayer}
          value={getPlayer}
        />
        <button onClick={addNewPlayer} disabled={hasError}>
          Add Player
        </button>
        {hasError && <div>name already exists</div>}
      </div>

      <div className="playerChooser">
        {players.map((player, id) => {
          const divClick =
            player.name !== getActivePlayerName
              ? (event) => {
                  event.preventDefault();
                  setActivePlayerName(player.name);
                }
              : null;

          return (
            <div className="player" key={`${player.name}${id}`} onClick={divClick}>
              {player.name !== getActivePlayerName && player.name}
              {player.name === getActivePlayerName && (
                <>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      removePlayer(id);
                      setActivePlayerName(null);
                    }}
                  >
                    remove
                  </button>
                  {player.name}
                  <button
                    style={{ marginLeft: "0.5em" }}
                    onClick={(event) => {
                      event.preventDefault();
                      movePlayerLeft(id);
                    }}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      movePlayerRight(id);
                    }}
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
