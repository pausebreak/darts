import React, { useState } from "react";
import { useStore } from "../machine";
import { Mark, Multiple } from "../types";
import { currentRound, gameOperations, mprForPlayerAsOfRound } from "../games";
import LineChart from "./LineChart";

import "./PostGame.css";

export const PostGame = () => {
  const game = useStore((state) => state.game);
  const players = useStore((state) => state.players);
  const winner = useStore((state) => state.winner);

  const setGame = useStore((state) => state.setGame);
  const setWinner = useStore((state) => state.setWinner);

  // specifically do not want this updating from the store
  // or else adding players after a finished game would be
  // in the list
  const [getPlayers] = useState(players);

  const totalRounds = currentRound(players);
  const stats = gameOperations(game).stats?.(players);
  const roundsText = totalRounds > 1 ? "rounds" : "round";

  // Chart view state
  const [showChart, setShowChart] = useState(false);

  // Prepare MPR data for each player for each round
  const chartSeries = getPlayers.map((player) => ({
    label: player.name,
    data: Array.from({ length: totalRounds }, (_, i) => ({
      x: i + 1,
      y: Number(mprForPlayerAsOfRound(player, i + 1)),
    })),
  }));

  if (showChart) {
    return (
      <div className="chartView" style={{ padding: 16 }}>
        <button className="backButton" onClick={() => setShowChart(false)} style={{ marginBottom: 16 }}>
          Back
        </button>
        <h2 style={{ textAlign: 'center', margin: 0 }}>MPR over time</h2>
        <LineChart
          series={chartSeries}
          xLabel="Round"
          yLabel="MPR"
          height={320}
        />
      </div>
    );
  }

  return (
    <>
      <div className="winner">{winner.name} is the winner</div>
      <p>
        In {totalRounds} {roundsText} {winner.name} won the game of {game.name}.
      </p>
      <div className="stats">
        {getPlayers.map((player, index) => {
          let singles = 0;
          let doubles = 0;
          let triples = 0;
          let misses = 0;

          player.darts.forEach((dart) => {
            if (dart[1] === Multiple.Single && dart[0] !== Mark.Miss) {
              singles++;
            }

            if (dart[0] === Mark.Double || dart[1] === Multiple.Double) {
              doubles++;
            }

            if (dart[0] === Mark.Triple || dart[1] === Multiple.Triple) {
              triples++;
            }

            if (dart[0] === Mark.Miss) {
              misses++;
            }
          });

          const cName = player.name === winner.name ? "playerStats win" : "playerStats";

          return (
            <div className={cName} key={player.name}>
              <div className="centered">{player.name}</div>
              {game.pointing && stats && <div className="centered">{stats.scores[index]}</div>}
              <table>
                <tbody>
                  <tr>
                    <td className="right">misses</td>
                    <td className="centered">{misses}</td>
                  </tr>
                  <tr>
                    <td className="right">singles</td>
                    <td className="centered">{singles}</td>
                  </tr>
                  <tr>
                    <td className="right">doubles</td>
                    <td className="centered">{doubles}</td>
                  </tr>
                  <tr>
                    <td className="right">triples</td>
                    <td className="centered">{triples}</td>
                  </tr>
                  <tr className="total">
                    <td className="right">total</td>
                    <td className="centered">{player.darts.length}</td>
                  </tr>
                  {stats && (
                    <>
                      <tr>
                        <td className="right">marks</td>
                        <td className="centered">{stats.marks[index]}</td>
                      </tr>
                      <tr>
                        <td className="right">MPR</td>
                        <td className="centered">
                          {stats.marks[index] ? (stats.marks[index] / totalRounds).toFixed(2) : 0}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <div className="backAgain">
        <button
          onClick={() => {
            setWinner(null);
            setGame(null);
          }}
        >
          Play Another
        </button>
        <button
          className="viewChartsButton"
          style={{ marginLeft: 12 }}
          onClick={() => setShowChart(true)}
        >
          View charts
        </button>
      </div>
    </>
  );
};
