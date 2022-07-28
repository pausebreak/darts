import isBlank from "@sedan-utils/is-blank";
import React, { ChangeEvent, useState } from "react";
import { useStore } from "../machine";

import "./PlayerChooser.css";

export const PlayerChooser: React.FC = () => {
  const players = useStore((state) => state.players);
  const addPlayer = useStore((state) => state.addPlayer);
  const removePlayer = useStore((state) => state.removePlayer);
  const [getPlayer, setPlayer] = useState("");
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
    <div className="playerChooser">
      <div style={{ flex: 1 }}>
        <input type="text" size={15} maxLength={15} onChange={setNewPlayer} value={getPlayer} />{" "}
        <button onClick={addNewPlayer} disabled={hasError}>
          Add Player
        </button>
        {hasError && <div>name already exists</div>}
      </div>

      {players.map((player, id) => (
        <div className="player" key={`${player.name}${id}`}>
          <button
            onClick={(event) => {
              event.preventDefault();
              removePlayer(id);
            }}
          >
            remove
          </button>
          {player.name}
        </div>
      ))}
    </div>
  );
};
