import React from 'react';
import { ParentSize } from '@visx/responsive';
import { Pie } from '@visx/shape';
import { scaleOrdinal } from '@visx/scale';
import CHART_COLORS from './Palettes';

export interface PieChartData {
  label: string;
  value: number;
}

export interface PieChartProps {
  data: PieChartData[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const defaultMargin = { top: 24, right: 16, bottom: 40, left: 40 };
const LEGEND_ITEM_WIDTH = 100;
const LEGEND_ITEM_HEIGHT = 20;
const LEGEND_GAP = 8;
const LEGEND_ITEMS_PER_ROW = 4;

const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 240,
  margin = defaultMargin,
}) => {
  return (
    <ParentSize>{({ width }) => {
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const legendItemsPerRow = Math.max(1, Math.floor(innerWidth / LEGEND_ITEM_WIDTH));
      const legendRows = Math.ceil(data.length / legendItemsPerRow);
      const legendHeight = legendRows * (LEGEND_ITEM_HEIGHT + LEGEND_GAP);
      // Dynamically increase SVG height to fit legend
      const svgHeight = height + legendHeight;
      const radius = Math.min(innerWidth, innerHeight) / 2 - 8;
      const colorScale = scaleOrdinal({
        domain: data.map(d => d.label),
        range: CHART_COLORS,
      });
      const centerX = margin.left + innerWidth / 2;
      const centerY = margin.top + innerHeight / 2;
      const total = data.reduce((sum, d) => sum + d.value, 0);
      return (
        <svg width={width} height={svgHeight} role="img" aria-label="Pie chart">
          <g transform={`translate(${centerX},${centerY})`}>
            <Pie
              data={data}
              pieValue={d => d.value}
              outerRadius={radius}
              innerRadius={0}
              cornerRadius={4}
            >
              {pie =>
                pie.arcs.map((arc, i) => (
                  <g key={arc.data.label}>
                    <path
                      d={pie.path(arc) || undefined}
                      fill={colorScale(arc.data.label)}
                      aria-label={`${arc.data.label}: ${arc.data.value}`}
                    />
                    {/* Only show label if slice is at least 25% of total */}
                    {(() => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      const percent = arc.data.value / total;
                      if (percent >= 0.25 && arc.data.value > 0) {
                        return (
                          <text
                            x={centroidX}
                            y={centroidY}
                            fontSize={13}
                            fill="#333"
                            fontWeight={600}
                            textAnchor="middle"
                            aria-label={arc.data.label}
                            style={{ userSelect: 'none' }}
                          >
                            {arc.data.label}
                          </text>
                        );
                      }
                      return null;
                    })()}
                  </g>
                ))
              }
            </Pie>
          </g>
          {/* Responsive Legend */}
          <g transform={`translate(${margin.left},${height - margin.bottom + 16})`}>
            {data.map((d, i) => {
              const row = Math.floor(i / legendItemsPerRow);
              const col = i % legendItemsPerRow;
              return (
                <g key={d.label} transform={`translate(${col * LEGEND_ITEM_WIDTH},${row * (LEGEND_ITEM_HEIGHT + LEGEND_GAP)})`}>
                  <rect width={16} height={16} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  <text x={22} y={13} fontSize={13} fill="#fff">{d.label}</text>
                </g>
              );
            })}
          </g>
        </svg>
      );
    }}</ParentSize>
  );
};

export default PieChart; 