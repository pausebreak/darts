import React from 'react';
import { ParentSize } from '@visx/responsive';
import { BarStack } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import CHART_COLORS from './Palettes';

export interface StackedBarChartData {
  player: string;
  hits: { [hitType: string]: number };
}

export interface StackedBarChartProps {
  data: StackedBarChartData[];
  hitTypes: string[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const defaultMargin = { top: 24, right: 16, bottom: 40, left: 40 };

const LEGEND_ITEM_WIDTH = 100;
const LEGEND_ITEM_HEIGHT = 20;
const LEGEND_GAP = 8;
const LEGEND_ITEMS_PER_ROW = 4;

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  hitTypes,
  height = 320,
  margin = defaultMargin,
}) => {
  return (
    <ParentSize>{({ width }) => {
      // Responsive legend layout
      const legendItemsPerRow = Math.max(1, Math.floor((width - margin.left - margin.right) / LEGEND_ITEM_WIDTH));
      const legendRows = Math.ceil(hitTypes.length / legendItemsPerRow);
      const legendHeight = legendRows * (LEGEND_ITEM_HEIGHT + LEGEND_GAP);
      const chartHeight = height - legendHeight - 16; // 16px gap between chart and legend
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = chartHeight - margin.top - margin.bottom;
      const xScale = scaleBand({
        domain: data.map(d => d.player),
        range: [0, innerWidth],
        padding: 0.3,
      });
      const maxY = Math.max(
        ...data.map(d => hitTypes.reduce((sum, h) => sum + (d[h] || 0), 0)),
        1
      );
      const yScale = scaleLinear({
        domain: [0, maxY],
        range: [innerHeight, 0],
        nice: true,
      });
      return (
        <svg width={width} height={height} role="img" aria-label="Stacked bar chart">
          <g transform={`translate(${margin.left},${margin.top})`}>
            <AxisLeft
              scale={yScale}
              stroke="#888"
              tickStroke="#888"
              tickLabelProps={() => ({ fill: '#888', fontSize: 12, textAnchor: 'end', dy: '0.33em' })}
            />
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              stroke="#888"
              tickStroke="#888"
              tickLabelProps={() => ({ fill: '#888', fontSize: 12, textAnchor: 'middle', dy: '0.5em' })}
            />
            <BarStack
              data={data}
              keys={hitTypes}
              x={d => d.player}
              xScale={xScale}
              yScale={yScale}
              color={key => CHART_COLORS[hitTypes.indexOf(key) % CHART_COLORS.length]}
            >
              {barStacks =>
                barStacks.map(barStack =>
                  barStack.bars.map(bar => (
                    <rect
                      key={bar.key + '-' + bar.index}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      aria-label={`${bar.key}: ${bar.bar.data[bar.key]}`}
                    />
                  ))
                )
              }
            </BarStack>
            {/* Direct labels on top of each bar */}
            {data.map((d, i) => {
              const total = hitTypes.reduce((sum, h) => sum + (d[h] || 0), 0);
              return (
                <text
                  key={d.player + '-label'}
                  x={(xScale(d.player) ?? 0) + (xScale.bandwidth() / 2)}
                  y={yScale(total) - 6}
                  fontSize={12}
                  fill="#333"
                  fontWeight={600}
                  textAnchor="middle"
                  aria-label={d.player}
                  style={{ userSelect: 'none' }}
                >
                  {d.player}
                </text>
              );
            })}
            {/* Responsive Legend */}
            <g transform={`translate(0,${innerHeight + 32})`}>
              {hitTypes.map((h, i) => {
                const row = Math.floor(i / legendItemsPerRow);
                const col = i % legendItemsPerRow;
                return (
                  <g key={h} transform={`translate(${col * LEGEND_ITEM_WIDTH},${row * (LEGEND_ITEM_HEIGHT + LEGEND_GAP)})`}>
                    <rect width={16} height={16} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    <text x={22} y={13} fontSize={13} fill="#333">{h}</text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      );
    }}</ParentSize>
  );
};

export default StackedBarChart; 