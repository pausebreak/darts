import { Player, Mark, Multiple } from '../types';
import { PieChartData } from './PieChart';

const HIT_TYPES = ['misses', 'singles', 'doubles', 'triples'];

export function prepareStackedBarData(players: Player[]): { data: any[], hitTypes: string[] } {
  const data = players.map(player => {
    let singles = 0, doubles = 0, triples = 0, misses = 0;
    player.darts.forEach(dart => {
      if (dart[1] === Multiple.Single && dart[0] !== Mark.Miss) singles++;
      if (dart[0] === Mark.Double || dart[1] === Multiple.Double) doubles++;
      if (dart[0] === Mark.Triple || dart[1] === Multiple.Triple) triples++;
      if (dart[0] === Mark.Miss) misses++;
    });
    // Flatten hit types to top-level keys
    return {
      player: player.name,
      misses,
      singles,
      doubles,
      triples,
    };
  });
  return { data, hitTypes: HIT_TYPES };
}

export function preparePieChartData(player: Player): PieChartData[] {
  let singles = 0, doubles = 0, triples = 0, misses = 0;
  player.darts.forEach(dart => {
    if (dart[1] === Multiple.Single && dart[0] !== Mark.Miss) singles++;
    if (dart[0] === Mark.Double || dart[1] === Multiple.Double) doubles++;
    if (dart[0] === Mark.Triple || dart[1] === Multiple.Triple) triples++;
    if (dart[0] === Mark.Miss) misses++;
  });
  return [
    { label: 'misses', value: misses },
    { label: 'singles', value: singles },
    { label: 'doubles', value: doubles },
    { label: 'triples', value: triples },
  ];
} 