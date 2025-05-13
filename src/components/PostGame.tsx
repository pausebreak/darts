import React, { useState } from "react";
import { useStore } from "../machine";
import { Mark, Multiple } from "../types";
import { currentRound, gameOperations, mprForPlayerAsOfRound, pointsForPlayerAsOfRound } from "../games";
import LineChart from "../graphs/LineChart";
import "./PostGame.css";
import CHART_COLORS from "../graphs/Palettes";

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
  const [chartTab, setChartTab] = useState<'mpr' | 'points'>('mpr');

  // Prepare MPR data for each player for each round
  const chartSeries = getPlayers.map((player) => ({
    label: player.name,
    data: Array.from({ length: totalRounds }, (_, i) => ({
      x: i + 1,
      y: Number(mprForPlayerAsOfRound(player, i + 1)),
    })),
  }));

  // Prepare Points data for each player for each round
  const pointsChartSeries = getPlayers.map((player) => ({
    label: player.name,
    data: Array.from({ length: totalRounds }, (_, i) => ({
      x: i + 1,
      y: pointsForPlayerAsOfRound(player, getPlayers, game, i + 1),
    })),
  }));

  const winnerIndex = getPlayers.findIndex(p => p.name === winner.name);
  const winnerColor = CHART_COLORS[winnerIndex % CHART_COLORS.length];

  return (
    <>
      <div className="winnerBannerRow">
        <div className="winnerBanner" style={{ background: winnerColor, color: '#000' }}>
          <div className="winnerSubtext" style={{ fontSize: '1em' }}>
            In {totalRounds} {roundsText}, <span className="winnerNameEm">{winner.name}</span> won the game of {game.name}.
          </div>
        </div>
        <button
          className="playAnotherSmall"
          onClick={() => {
            setWinner(null);
            setGame(null);
          }}
        >
          Play Another
        </button>
      </div>
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

          const playerColor = CHART_COLORS[index % CHART_COLORS.length];
          const cName = player.name === winner.name ? "playerStats win" : "playerStats";

          return (
            <div
              className={cName}
              key={player.name}
              style={{ border: `2px solid ${playerColor}` }}
            >
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
      <div className="chartSection" style={{ padding: 16 }}>
        {game.pointing && (
          <div className="chartTabButtons">
            <button
              onClick={() => setChartTab('mpr')}
              style={{ fontWeight: chartTab === 'mpr' ? 700 : 400 }}
              aria-selected={chartTab === 'mpr'}
            >
              MPR over rounds
            </button>
            <button
              onClick={() => setChartTab('points')}
              style={{ fontWeight: chartTab === 'points' ? 700 : 400 }}
              aria-selected={chartTab === 'points'}
            >
              Points over rounds
            </button>
          </div>
        )}
        {chartTab === 'mpr' && (
          <>
            <h2 style={{ textAlign: 'center', margin: 0 }}>MPR over rounds</h2>
            <LineChart
              series={chartSeries}
              xLabel="Round"
              yLabel="MPR"
              height={320}
              margin={{ top: 24, right: 24, bottom: 56, left: 56 }}
              yTickFormat={n => String(n)}
              yTickValues={(() => {
                const min = Math.floor(Math.min(...chartSeries.flatMap(s => s.data.map(d => d.y)), 0));
                const max = Math.ceil(Math.max(...chartSeries.flatMap(s => s.data.map(d => d.y)), 1));
                return Array.from({length: max - min + 1}, (_,i) => min + i);
              })()}
              xTickValues={Array.from({length: Math.ceil((totalRounds+1)/5)}, (_,i) => i*5)}
            />
          </>
        )}
        {game.pointing && chartTab === 'points' && (
          <>
            <h2 style={{ textAlign: 'center', margin: 0 }}>Points over rounds</h2>
            <LineChart
              series={pointsChartSeries}
              xLabel="Round"
              yLabel="Points"
              height={320}
              margin={{ top: 24, right: 24, bottom: 56, left: 56 }}
              yTickFormat={n => String(n)}
              yTickValues={(() => {
                const min = Math.floor(Math.min(...pointsChartSeries.flatMap(s => s.data.map(d => d.y)), 0));
                const max = Math.ceil(Math.max(...pointsChartSeries.flatMap(s => s.data.map(d => d.y)), 1));
                const start = Math.floor(min / 10) * 10;
                const end = Math.ceil(max / 10) * 10;
                const ticks = [];
                for (let v = start; v <= end; v += 10) ticks.push(v);
                return ticks;
              })()}
              xTickValues={Array.from({length: Math.ceil((totalRounds+1)/5)}, (_,i) => i*5)}
            />
          </>
        )}
      </div>
    </>
  );
};
